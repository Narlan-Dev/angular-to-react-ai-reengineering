import { Component, OnInit, Input } from "@angular/core";
import Chart from "../../models/Chart.model";

@Component({
  selector: "app-kpi",
  templateUrl: "./kpi.component.html",
  styleUrls: ["./kpi.component.css"],
  standalone: false,
})
export class KpiComponent implements OnInit {
  @Input() chart!: Chart;

  constructor() {}

  ngOnInit() {}
}
