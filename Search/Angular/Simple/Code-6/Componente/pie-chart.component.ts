import ChartDataLabels from "chartjs-plugin-datalabels";
import { Component, Input, KeyValueDiffers, DoCheck } from "@angular/core";
import { Chart } from "chart.js/auto";
import ChartModel from "../../models/Chart.model";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.css"],
  standalone: false,
})
export class PieChartComponent implements DoCheck {
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
  generatePresencesGroupedChart = (submissionsStatus) => {
    return new Chart("submissions_stats_chart", {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: submissionsStatus,
            backgroundColor: [
              "rgb(211, 211, 211)",
              "rgb(255, 205, 86)",
              "rgb(54, 162, 235)",
              "rgb(255, 99, 132)",
            ],
          },
        ],
        labels: this.chart.columns ?? [
          "Não atribuída",
          "Pendente",
          "Aprovada",
          "Reprovada",
        ],
      },
      options: {
        plugins: {
          datalabels: {
            formatter: (value) => {
              return value + "%";
            },
          },
        },
      },
    });
  };
}
