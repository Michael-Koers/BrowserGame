let express = require('express');
let app = express();
let expressWs = require('express-ws')(app);

const PORT = 3000;


let unregisteredClients = [];
let registeredClients = [];

let socketActions = Object.freeze({
    LOGIN: "LOGIN",
    NEWUSER: "NEWUSER",
    GETUSERS: "GETUSERS",
    SENDCHAT: "SENDCHAT",
    RECEIVECHAT: "RECEIVECHAT"
});

app.ws('/lobby', function (ws, req) {

    console.log("New Web Socket started connection");

    ws.send(JSON.stringify({ data: "Connection was made!", status: "SUCCESS" }));

    unregisteredClients.push(ws);

    ws.on('message', function (msg) {

        let req = JSON.parse(msg);

        switch (req.action) {
            case socketActions.GETUSERS:
                console.log("GET USERS");
                let users = [];
                registeredClients.forEach(client => {
                    users.push(client.username);
                })
                console.log("result:", users);
                ws.send(JSON.stringify({
                    action: socketActions.GETUSERS,
                    data: users,
                    status: "SUCCESS",
                    user: ws.username
                }));
                break;

            case socketActions.SENDCHAT:
                console.log("SEND CHAT");

                registeredClients.forEach(client => {
                    if (client.socket != ws) {
                        client.socket.send(JSON.stringify({
                            action: socketActions.RECEIVECHAT,
                            data: req.data,
                            status: "SUCCESS",
                            user: req.user
                        }));
                    }
                })

                break;

            case socketActions.LOGIN:
                let index = unregisteredClients.indexOf(ws);
                if (index > -1) {

                    //Update all clients of new friendo in chat!:D
                    registeredClients.forEach(client => {
                        client.socket.send(JSON.stringify({
                            action: socketActions.NEWUSER,
                            data: req.data,
                            status: "SUCCESS",
                            user: req.data
                        }));
                    });

                    //Move client from unregistered to registered
                    unregisteredClients.splice(index, 1);
                    registeredClients.push({ socket: ws, username: req.data });
                    
                    //Set username on WebSocket object for easy access
                    ws.username = req.data;
                    
                    //Necessary logging
                    console.log("LOG IN SUCCESSFULL:", req.data);

                    //Send success message
                    ws.send(JSON.stringify({ data: "Log in was succesfull!", status: "SUCCESS" }));


                } else {
                    console.log("LOG IN FAILED:", req.data);
                    ws.send(JSON.stringify({ data: "Something went wrong when registering", status: "FAIL" }));
                }
                break;
        }
    });

    ws.on('close', function () {
        console.log("Web Socket closed connection")
        let index = registeredClients.indexOf(ws);
        registeredClients.splice(index, 1);
    })
});

console.log(`Expres WS Server listening on port ${PORT}`)
app.listen(PORT);