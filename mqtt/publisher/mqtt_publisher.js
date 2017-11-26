var BH1750 = require('bh1750');
var light = new BH1750();
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://') //Add your broker ip here 
var ds18b20 = require('ds18b20');
var tempSensorId = 0;
var time = require('time-ms');

function getTransObject(value){
		var transObj = {
			value:value.toString(),
			time:time()
		}; 
		
		return JSON.stringify(transObj);
};

function readLight(){
	light.readLight(function (value) {
			console.log(value);
			client.publish('test/light', getTransObject(value))
		});
};

function readTemp(){
	if(tempSensorId != 0){ 
			ds18b20.temperature(tempSensorId, function(err, value) {
	  			console.log('Current temperature is', value);
				client.publish('test/temp', getTransObject(value));
			});
		}
};

ds18b20.sensors(function(err, ids) {
	if(ids !== undefined) {
		console.log('resolved ids: ');
		console.log(ids);
		tempSensorId = ids[ids.length-1];  			
	} else {
		console.log("No temperature sensors found");
	}
});
 
client.on('connect', function () {
	//Read the sensor data every 1000ms
	setInterval(function () {
		readLight();
		readTemp();
	}, 1000);
});
 
client.on('message', function (topic, message) { 
  console.log(message)
  client.end()
})




