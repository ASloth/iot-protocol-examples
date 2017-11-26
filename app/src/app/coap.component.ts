import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { LightIntensityService } from './lightIntensity.service';
import { TemperaturService } from "./temperatur.service";

const socket_url = 'ws://ur.l:port'; //Url to the websocket that provides the coap data 

export class Message {
    time: string
    value: number
    valueType: string
    sensorId: number
    sensorName: string
}

@Component({
  templateUrl: 'coap.component.html',
  providers: [WebsocketService],
})

export class CoapComponent implements OnInit, OnDestroy {
  public websocketMessage: Subject<Message>;

  constructor(public wsService: WebsocketService,
    public lightService: LightIntensityService,
    public tempService: TemperaturService) {
  }

  ngOnInit(): void {
    console.log("--- INIT COAP CONNECTION ---");

    //Set websocket message object
    this.websocketMessage = <Subject<Message>>this.wsService
      .connect(socket_url).map((response: MessageEvent): Message => {
        const data = response.data;
        console.log("Recieved data from websocket.");
        console.log(data);
        return data;
      });

    this.websocketMessage.subscribe(msg => {
      const obj = JSON.parse(msg.toString());
      switch(obj.valueType){
        case "temp":
          this.tempService.publish(obj);
          break;
        case "light":
          this.lightService.publish(obj);
          break;
      }
    });
  }

  //Unsubscribe from the websocket on destroy
  ngOnDestroy(): void {
    this.websocketMessage.subscribe().unsubscribe();
    console.log('--- CLOSED COAP CONNECTION ---');
  }
}
