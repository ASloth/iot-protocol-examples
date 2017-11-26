const coap = require('coap') //Coap
	, server = coap.createServer() //Creating coap server
	, BH1750 = require('../../bh1750')
	, ds18b20 = require('ds18b20')
	, sensorId = 1 //Set a unique id here
	, sensorName = "Pi-One" //Set a name here
	, port = "6780"; //Port for the coap server to run on

var tempSensorId = 0

var subscribers = [];

var light = new BH1750({
	//options 
});

var lastLightValue = null;
var lastTempValue = null;

//Search for a temperatur sensor at start
ds18b20.sensors(function (err, ids) {
	if (ids !== undefined) {
		console.log('resolved ids: ');
		console.log(ids);
		tempSensorId = ids[ids.length - 1];
	} else {
		console.log("No temperature sensors found");
	}
});

//Listen to coap requests
server.on('request', function (req, res) {

	//We only respond to observs
	if (req.headers['Observe'] === 0) {
		addObserver(res);
		if (lastLightValue != null)
			res.write(lastLightValue + '\n');
		if (lastTempValue != null)
			res.write(lastTempValue + '\n');
	}

	res.on('finish', function (err) {
		console.log('Observer stoped: ' + res._packet.token);
		removeObserver(res);
	})
})

//Interval to fetch sensor data
setInterval(function () {
	console.log('------');
	if (tempSensorId == 0) {
		console.log("Temperatur sensor not found.")
	}
	else {
		ds18b20.temperature(tempSensorId, function (err, value) {
			console.log('Current temperature is', value);
			subscribers.forEach(function (observer) {
				var tempOut = {
					sensorName: sensorName,
					sensorId: sensorId,
					value: temp,
					time: new Date(),
					valueType: 'temp'
				};
				var outJson = JSON.stringify(tempOut);
				lastTempValue = outJson;
				observer.res.write(JSON.stringify(outJson) + '\n');
			});
		});
	}

	light.readLight(function (value, err) {
		if (err != null) {
			console.log('Light sensor error: ' + error);
		}
		else {
			console.log('New light data: ' + value);
			subscribers.forEach(function (observer) {
				var out = {
					sensorName: sensorName,
					sensorId: sensorId,
					value: value,
					time: new Date(),
					valueType: 'light'
				};
				var outJson = JSON.stringify(out);
				lastLightValue = outJson;
				observer.res.write(outJson + '\n');
			});
		}
	});
}, 1000)

//Adds the new observer to the stored observers
function addObserver(sender) {
	console.log('new observer: ' + sender._packet.token);
	subscribers.push({
		'res': sender,
		'token': sender._packet.token
	});
}

//Removes the observer from the stored observers
function removeObserver(sender) {
	var old = subscribers;
	subscribers = [];
	old.forEach(function (element) {
		if (element.token != sender._packet.token)
			subscribers.push(element);
	});
}

server.listen(port, function () {
	console.log('server started')
})
