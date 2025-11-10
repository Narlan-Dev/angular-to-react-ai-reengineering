import { Component, OnInit, Input } from "@angular/core";
import ChartModel from "../../models/Chart.model";

@Component({
  selector: "app-multiple-kpi",
  templateUrl: "./multiple-kpi.component.html",
  styleUrls: ["./multiple-kpi.component.css"],
  standalone: false,
})
export class MultipleKpiComponent implements OnInit {
  @Input() chart!: ChartModel;

  labels: string[] = ["Não atribuídos", "Pendentes", "Aprovados", "Reprovados"];

  constructor() {}

  ngOnInit() {}
}
