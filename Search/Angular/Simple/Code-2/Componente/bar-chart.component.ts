import { Component, Input, KeyValueDiffers, DoCheck } from "@angular/core";
import { Chart } from "chart.js/auto";
import ChartModel from "../../models/Chart.model";

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.css"],
  standalone: false,
})
export class BarChartComponent implements DoCheck {
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
          this.generatePresencesGroupedChart(this.chart.data);
        }, 200);
      }
    }
  }

  generatePresencesGroupedChart = (presencesGroupedBySessionGroup) => {
    return new Chart(this.chart.ctx || this.chart.label, {
      type: "bar",
      data: {
        labels: presencesGroupedBySessionGroup.map((item) => item.title),
        datasets: [
          {
            label: this.chart.columns[0],
            data: presencesGroupedBySessionGroup.map((item) => item.value),
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
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
