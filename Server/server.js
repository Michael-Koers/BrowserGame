let express = require('express');
let app = express();
let expressWs = require('express-ws')(app);

const PORT = 3000;

let clients = [];

app.ws('/lobby', function (ws, req) {

    console.log("LOBBY - New Web Socket started connection");

    console.log("LOBBY - Sending client confirmation");
    ws.send(JSON.stringify({message: new String("Succesfully logged in"), status: new String("SUCCESS")}));
    
    clients.push(ws);

    
    ws.on('message', function (msg) {
        console.log(msg);
    });

    ws.on('close', function () {
        console.log("LOBBY - Web Socket closed connection")
        let index = clients.indexOf(ws);
        clients.splice(index, 1);
    })
});

console.log(`Expres WS Server listening on port ${PORT}`)
app.listen(PORT);