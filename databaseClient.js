
AWS.config.update({region: 'us-east-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: creds});
const lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

async function submitNotes(notes) {
    return await callLambda("submitNotes", notes);
}

async function pullNotes() {
    return await callLambda("pullNotes", {});
}

async function callLambda(lambdaName, data) {
    return new Promise((resolve, reject) => {
        lambda.invoke(
            {
                FunctionName : lambdaName,
                Payload: JSON.stringify({
                    "written_timestamp": Date.now(),
                    "data": data   
                }),
                InvocationType : 'RequestResponse',
                LogType : 'None'
            }, function(err, data) {
                    if (err) {
                        console.error(`Got this error: ${err}`);
                        reject(err);
                    } else {
                        const response = JSON.parse(data.Payload);
                        resolve(response);
                    }
                });
    });
}