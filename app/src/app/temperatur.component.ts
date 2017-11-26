import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts/ng2-charts';
import {TemperaturService} from './temperatur.service';

@Component({
  selector: 'app-temperatur-graph',
  templateUrl: './temperatur.component.html'

})
export class TemperaturGraphComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  subsTemp;
  constructor(public tempService: TemperaturService) {}

  // lineChart
  public lineChartData: Array<any> = [
    {data: [], label: 'Temperatur'}
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          steps : 1,
          stepValue : 5,
          max: 40,
          min: 15
        }
      }]
    }
  };

  public lineChartColors: Array<any> = [
    { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'}
    ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.subsTemp = this.tempService.event.subscribe((data) => {
      if (this.lineChartData[0].data.length > 20) {
        this.lineChartData[0].data.shift();
      }

      if ( this.lineChartLabels.length > 20 ) {
        this.lineChartLabels.shift();
      }

      this.lineChartData[0].data.push(data.value);
      this.lineChartLabels.push(data.time);
      if (this.chart.chart != null) {
        this.chart.chart.update();
      }
    });
  }


  ngOnDestroy(): void {
    this.subsTemp.unsubscribe();
  }
}
