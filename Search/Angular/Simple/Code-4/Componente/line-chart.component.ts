import { Component, Input, KeyValueDiffers, DoCheck } from "@angular/core";
import { Chart } from "chart.js/auto";
import ChartModel from "../../models/Chart.model";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
  standalone: false,
})
export class LineChartComponent implements DoCheck {
  @Input() chart: ChartModel;
  differ: any;

  constructor(private differs: KeyValueDiffers) {
    this.differ = differs.find({}).create();
  }

  ngDoCheck() {
    var changes = this.differ.diff(this.chart);

    if (changes) {
      if (this.chart.data) {
        setTimeout(() => {
          this.generateLineChart(this.chart.data);
        }, 200);
      }
    }
  }

  generateLineChart = (data) => {
    return new Chart(this.chart.ctx || this.chart.label, {
      type: "line",
      data: {
        labels: data.map((item) => item.title),
        datasets: [
          {
            label: this.chart.columns[0],
            data: data.map((item) => item.value),
            fill: true,
            borderColor: "#2196f3",
            backgroundColor: "#2196f3",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };
}
