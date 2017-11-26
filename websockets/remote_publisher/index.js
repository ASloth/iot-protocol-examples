const WebSocket = require('ws'),
    wss = new WebSocket.Server({ port: 8001 }, function () { }); 

//Open connection
wss.on('connection', function connection(ws, req) {

    //Listen to messages
    ws.on('message', function incoming(data) {
        console.log("Recieved data: " + data);

        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data); 
            }
        });
    });
});