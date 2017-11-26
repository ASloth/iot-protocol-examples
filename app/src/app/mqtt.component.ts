import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as MQTT from 'mqtt';
import {LightIntensityService} from './lightIntensity.service';
import {TemperaturService} from './temperatur.service';

const mqttBroker = 'http://'; //Adress of your broker comes here
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
        client.subscribe('test/temp');
        client.subscribe('test/light'); 
        console.log('Connected to ' + mqttBroker);
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
