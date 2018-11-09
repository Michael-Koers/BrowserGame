let express = require('express');
let app = express();
let expressWs = require('express-ws')(app);

const PORT = 3000;
// app.use(function (req, res, next) {
//   console.log('middleware');
//   req.testing = 'testing';
//   return next();
// });

// app.get('/', function(req, res, next){
//   console.log('get route', req.testing);
//   res.end();
// });

let clients = [];

app.ws('/', function (ws, req) {

    console.log("New Web Socket started connection");

    clients.push(ws);

    ws.on('message', function (msg) {
        console.log(msg);
    });

    ws.on('close', function(){
        console.log("Web Socket closed connection")
        let index = clients.indexOf(ws);
        clients.splice(index, 1);
    })
});

console.log(`Expres WS Server listening on port ${PORT}`)
app.listen(PORT);