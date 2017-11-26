# iot-protocol-examples
 
## Let it run 
### Prerequisitions
* Device to connect the sensors to, required to run NodeJs
* Sensors: You can connect one sensor of type ds18b20 and/or bh1750 to each device.
* Server to run the broker/broadcaster and frontend on, required to run NodeJs

1. Clone the repo to your server and all sensors
2. Install the following components:
 * NodeJs on all devices
 * AngularCli on your Server
 * Mosquitto on your server https://mosquitto.org/
3. Create a configuration.js file and add it to the root of the cloned repo, the content should look like this:
```
global.Config = {
    "coap_recieve_port": 1234, //Port where your sensor can send data to
    "coap_publish_port":1234, //Port where the client can connect to your coap broadcaster
    "coap_websocket_address":'ur.l', //Server ip where you plan to run your coap broadcaster
    "websocket_port":1234, //Port of your websocket broadcaster
    "websocket_address":'ur.l', //Server ip where you plan to run your websocket broadcaster
    "mqtt_broker_address":'ur.l', //Server ip where your mqtt broker (mosquitto) runs.
    "mqtt_broker_mqtt_port": 1234, //MQTT port you configured in your broker (mosquitto)
    "mqtt_broker_websocket_port": 1234 //WebSocket port you configured in your broker (mosquitto)
};
```
4. Let it run
 * Dont forget to run npm install bevore running any comment the first time :)
 * Frontend in /app/ on your server: Run `ng build` and `node app`
 * MQTT in /mqtt/publisher on your sensor: Run 'node index`
 * COAP in /coap/remote on your server: Run `node index`
 * COAP in /coap/ on your sensor:
  * Start with the coap server in /coap/server: Run `node index`
  * Starting the publisher /coap/publisher:
    * You have to set the ports of all coap sensors you want to publish in the `index.js`, you will find the array `sensorPorts` at the top.
    * Run `node index`
!WebSockets will come soon!
