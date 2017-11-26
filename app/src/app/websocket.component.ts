import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import {LightIntensityService} from './lightIntensity.service';
import {TemperaturService} from "./temperatur.service";

const websocketAdress = 'ws://ur.l:port/'; //Adress of the websocket

export class Message {
  value: string;
}

@Component({
  templateUrl: 'websocket.component.html',
  providers: [WebsocketService],
})

export class WebsocketComponent implements OnInit, OnDestroy {
  public lights: Subject<Message>;

  constructor(public wsService: WebsocketService,
    public lightIntensity: LightIntensityService,
    public tempService: TemperaturService) {
  }

  ngOnInit(): void {
    console.log("--- INIT WEBSOCKETS ---");
    this.lights = <Subject<Message>>this.wsService
      .connect(websocketAdress).map((response: MessageEvent): Message => {
        const data = response.data;
        return {
          value: data
        };
      });
    this.lights.subscribe(msg => {
      const obj = JSON.parse(msg.value.toString());
      switch (obj.typ) {
        case 'temp':
          this.tempService.publish(obj);
          break;
        case 'light':
          this.lightIntensity.publish(obj);
          break;
      }
    });
  }
  ngOnDestroy(): void {
    this.lights.subscribe().unsubscribe();
    console.log('Unsubscribe');
  }
}
