let isLocal = 0;
const xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4) {
        if ("serviceWorker" in navigator) {
            if (xmlHttp.responseText === "1" && xmlHttp.status === 200) {
                navigator.serviceWorker.register("/sw.js",
                { scope: "/CloudNotes/" });
            } else {
                navigator.serviceWorker.register("/CloudNotes/sw.js",
                { scope: "/CloudNotes/" });
            }
        }
    }
}
xmlHttp.open("GET", "./isLocal.txt", true);
xmlHttp.send(null);