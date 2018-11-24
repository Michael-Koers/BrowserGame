'use strict'

let express = require('express');
let app = express();
let expressWs = require('express-ws')(app);

const PORT = 3000;


let unregisteredClients = [];
let registeredClients = [];

let socketActions = Object.freeze({
    LOGIN: "LOGIN",
    NEWUSER: "NEWUSER",
    DISCONNECTED: "DISCONNECTED",
    GETUSERS: "GETUSERS",
    SENDCHAT: "SENDCHAT",
    RECEIVECHAT: "RECEIVECHAT",
    UNKNOWN: "UNKNOWN"
});

app.ws('/lobby', function (ws, req) {

    console.log("New Web Socket started connection");

    ws.send(JSON.stringify({ data: "Connection was made!", status: "SUCCESS" }));

    unregisteredClients.push(ws);

    ws.on('message', function (msg) {

        let req = JSON.parse(msg);
        let index;

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
                    if (client != ws) {
                        client.send(JSON.stringify({
                            action: socketActions.RECEIVECHAT,
                            data: req.data,
                            status: "SUCCESS",
                            user: req.user
                        }));
                    }
                })

                break;

            case socketActions.LOGIN:
                index = unregisteredClients.indexOf(ws);
                if (index > -1) {

                    //Update all clients of new friendo in chat!:D
                    registeredClients.forEach(client => {
                        client.send(JSON.stringify({
                            action: socketActions.NEWUSER,
                            data: req.data,
                            status: "SUCCESS",
                            user: req.data
                        }));
                    });

                    //Move client from unregistered to registered
                    unregisteredClients.splice(index, 1);
                    registeredClients.push(ws);

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

            case socketActions.DISCONNECTED:
                console.log("Client disconnected");


            default:
                console.log("client send unknown action :/");
                ws.send(JSON.stringify({
                    action: socketActions.UNKNOWN,
                    data: "Server received unknown action from you",
                    status: "FAIL",
                    user: "Server",
                }));
                break;
        }
    });

    ws.on('close', function () {
        console.log("Web Socket closed connection");
        console.log("clients:", registeredClients);
        console.log("ws:", ws);
        let index = registeredClients.indexOf(ws);
        console.log("index:", index);
        if (index > -1) {
            registeredClients.splice(index, 1);

            registeredClients.forEach(client => {
                client.send(JSON.stringify({
                    action: socketActions.DISCONNECTED,
                    data: ws.username,
                    status: "SUCCESS",
                    user: ws.username
                }))
            })
        };
    })
});

console.log(`Expres WS Server listening on port ${PORT}`)
app.listen(PORT);