
const preEncryptedData = `{"iv":{"0":113,"1":205,"2":139,"3":39,"4":131,"5":214,"6":123,"7":190,"8":210,"9":209,"10":195,"11":64},"ciphertext":{"0":136,"1":179,"2":135,"3":86,"4":147,"5":11,"6":138,"7":13,"8":102,"9":143,"10":137,"11":196,"12":127,"13":226,"14":72,"15":77,"16":93,"17":112,"18":1,"19":150,"20":66,"21":125,"22":118,"23":247,"24":43,"25":222,"26":107,"27":100,"28":11,"29":43,"30":34,"31":141,"32":164,"33":174,"34":90,"35":92,"36":52,"37":233,"38":68,"39":249,"40":46,"41":212,"42":87,"43":226,"44":130,"45":160,"46":42,"47":0,"48":83,"49":235,"50":147,"51":71,"52":159,"53":71,"54":250,"55":156,"56":128,"57":19,"58":149,"59":135,"60":208,"61":4}}`;

async function decrypt(encrypted, key) {
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: encrypted.iv,
        },
        key,
        encrypted.ciphertext
    );

    return new TextDecoder().decode(decryptedData);
}

async function getCreds(password) {

    const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            "PBKDF2",
            false,
            ["deriveBits", "deriveKey"]
        );

        const key = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: encoder.encode(`this-is-my-salt-for-now`),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

    const generalObject = JSON.parse(preEncryptedData);
    const arrayObject = {"iv": new Uint8Array(Object.values(generalObject.iv)), "ciphertext": new Uint8Array(Object.values(generalObject.ciphertext))};
    const encrypted = arrayObject;
    const decrypted = await decrypt(encrypted, key);
    return decrypted;
}

// Check local storage for creds and if absent then prompt user, else use
let creds = null;
(async () => {
    if (window.localStorage.getItem(`CloudNotes_creds`)) {
        creds = window.localStorage.getItem(`CloudNotes_creds`);
    } else {
        // Prompt user for creds then save them
        const password = prompt("Enter your password");
        creds = await getCreds(password);
        // TODO do a pullNotes check, and if it fails for AccessDenied then notify the
        // user and don't save the creds
        window.localStorage.setItem(`CloudNotes_creds`, creds);
    }
    console.log(`creds are set to ${creds}`);
})();