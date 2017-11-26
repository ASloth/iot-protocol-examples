import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts/ng2-charts';
import {LightIntensityService} from './lightIntensity.service';

@Component({
  selector: 'app-light-graph',
  templateUrl: './light.component.html'

})
export class LightGraphComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  subs;

  constructor(public lightIntensityService: LightIntensityService) {}

  // lineChart
  public lineChartData: Array<any> = [
    {data: [], label: 'Light Intesity'}
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          steps : 250,
          stepValue : 250,
          max: 30000
        }
      }]
    }
  };

  public lineChartColors: Array<any> = [];
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
    this.subs = this.lightIntensityService.event.subscribe((data) => {
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
    this.subs.unsubscribe();
  }
}
