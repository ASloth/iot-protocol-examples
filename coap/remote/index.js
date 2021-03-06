const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  WebSocket = require('ws'), 
  config = require('../../configuration.js'),
  dataInPort = Config.coap_recieve_port, //Part where the publisher can connect to to publish data.
  wss = new WebSocket.Server({ port: Config.coap_publish_port }, function () { }); //Clients will connect to this port to recieve data.

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Defines the broadcast function. Broadcast the data to all clients.
wss.broadcast = function broadcast(data) {
  console.log('Broadcasting to ' + wss.clients.size + ' clients.');
  var string = JSON.stringify(data);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(string);
    }
  });
};

//Listen to clients that connect and add them to the client list
wss.on('connection', function connection(ws, req) {
  console.log(req.connection.remoteAddress + " connected.");
  wss.clients.add(ws);
});

//Listen to data from a publisher
app.post('', function (req, res) {
  var body = req.body;
  console.log(body);
  wss.broadcast(body);
  res.send();
});

var listener = app.listen(dataInPort, function () {
  console.log('Server recieving data on port ' + dataInPort);
}); 
