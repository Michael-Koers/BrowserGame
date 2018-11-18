let express = require('express');
let app = express();
let expressWs = require('express-ws')(app);

const PORT = 3000;

let clients = [];

let socketActions = Object.freeze({
    LOGIN = "LOGIN",
    GETUSERS = "GETUSERS",
    SENDCHAT = "SENDCHAT",
    RECEIVECHAT = "RECEIVECHAT"
});

app.ws('/lobby', function (ws, req) {

    console.log("New Web Socket started connection");

    console.log("Sending client confirmation");
    ws.send(JSON.stringify({ message: new String("Succesfully logged in"), status: new String("SUCCESS") }));

    clients.push(ws);


    ws.on('message', function (msg) {

        let req = JSON.parse(msg);

        switch (req.action) {
            case socketActions.GETUSERS:
                
                
                console.log("get users");
                break;

            case socketActions.SENDCHAT:
                console.log("sending message");
                break;
        }
    });

    ws.on('close', function () {
        console.log("Web Socket closed connection")
        let index = clients.indexOf(ws);
        clients.splice(index, 1);
    })
});

console.log(`Expres WS Server listening on port ${PORT}`)
app.listen(PORT);