import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as MQTT from 'mqtt';
import {LightIntensityService} from './lightIntensity.service';
import {TemperaturService} from './temperatur.service';
import {Config} from './../../../configuration';


const mqttBroker = 'http://' + Config.mqtt_broker_address + ':' + Config.mqtt_broker_websocket_port ; //Adress of your broker comes here
let client;

@Component({
  templateUrl: 'mqtt.component.html',
})
export class MqttComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(public lightIntensity: LightIntensityService, public tempService: TemperaturService) {}

  ngOnInit(): void {
    client = MQTT.connect(mqttBroker);
    console.log(client.options.port);

    client.on('error', (err) => {
      console.log(err);
    });

    client.on('connect',
      () => {
        console.log("--- INIT MQTT CONNECTION ---"); 
        console.log("MQTT: Configured address: " + mqttBroker);

        client.subscribe('test/temp');
        client.subscribe('test/light'); 
        console.log('MQTT: Connected');
      });

    client.on('message',
      (topic, message) => {
        var obj = JSON.parse(message);
        if (topic == 'test/temp') {  
          this.tempService.publish(obj);
        } else if (topic == 'test/light') {   
          this.lightIntensity.publish(obj);
        }
      });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    console.log('Unsubscribe' + client);
    client.end();
  }
}
