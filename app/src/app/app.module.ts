import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { MqttComponent } from './mqtt.component';
import { WebsocketComponent } from './websocket.component';
import { CoapComponent } from './coap.component';
import { PageNotFoundComponent } from './pageNotFoundComponent.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { LightGraphComponent } from './light.component';
import {LightIntensityService} from './lightIntensity.service';
import {TemperaturService} from './temperatur.service';
import {TemperaturGraphComponent} from './temperatur.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Config} from './../../../configuration';

const appRoutes: Routes = [
  { path: 'mqtt', component: MqttComponent },
  { path: 'websocket', component: WebsocketComponent },
  { path: 'coap', component: CoapComponent },
  { path: '',
    redirectTo: '/coap',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    MqttComponent,
    CoapComponent,
    WebsocketComponent,
    PageNotFoundComponent,
    LightGraphComponent,
    TemperaturGraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    NgbModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [LightIntensityService, TemperaturService],
  bootstrap: [AppComponent]
})
export class AppModule { }
