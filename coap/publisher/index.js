const coap = require('coap'), // or coap
request = require('request'),
localObserver = coap.request({
    observe: true,
    host: 'localhost',
    port: 6780
}),
config = require('../../configuration.js'),
remoteServer = 'http://' + Config.coap_server_address +':' +  Config.coap_recieve_port; //Set the ip of the server where the backend is running here

localObserver.on('response', function (res) {
sendDataToRemote(res);
});

function sendDataToRemote(res)
{
console.log(res);
res.setEncoding('utf8');
res.on('data', function (data) {
    var obj = JSON.parse(data.toString());
    console.log("Recieved value (" + obj.value + ") of type " + obj.valueType + " from " + obj.sensorName + " (" + obj.sensorId + ")");
    var r = request(remoteServer, {
        method: 'POST',
        body: obj,
        json: true
    });
});
}

localObserver.end(); 
