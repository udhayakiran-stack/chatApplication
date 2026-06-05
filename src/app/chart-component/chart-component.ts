import { Component, ChangeDetectionStrategy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import {
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [HighchartsChartComponent, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './chart-component.html',
})
export class ChartComponent {
  chartForm = new FormGroup({
    month: new FormControl('', [Validators.required]),
    value: new FormControl('', Validators.required),
  });
  Highcharts: typeof Highcharts = Highcharts;
  Highchartsone: typeof Highcharts = Highcharts;
  cate: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  valueNum: any[] = [10, 25, 15, 40, 30];
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Monthly Sales',
    },
    xAxis: {
      categories: this.cate,
    },
    series: [
      {
        type: 'line',
        name: 'Sales',
        data: this.valueNum,
      },
    ],
  };
  chartOptions1: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    xAxis: {
      type: 'datetime',
    },
    series: [
      {
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        pointStart: Date.UTC(2010, 0, 1),
        pointInterval: 3600 * 1000,
      },
    ],
  };
  onSubmit() {
    if (this.chartForm.valid) {
      const selectedMonth = this.chartForm.value?.month;
      const selectedNumber = this.chartForm.value?.value;

      if (selectedMonth) {
        this.cate.push(selectedMonth);
      }
      if (selectedNumber) {
        this.valueNum.push(selectedNumber);
      }
      this.chartOptions = {
        ...this.chartOptions,
        xAxis: {
          ...this.chartOptions.xAxis,
          categories: [...this.cate],
        },
        series: [
          {
            type: 'line',
            name: 'Sales',
            data: [...this.valueNum],
          },
        ],
      };
      this.chartForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }
}
