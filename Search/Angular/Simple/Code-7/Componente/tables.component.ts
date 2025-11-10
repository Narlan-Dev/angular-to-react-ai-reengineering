import {
  Component,
  DoCheck,
  Input,
  KeyValueDiffers,
  OnInit,
} from "@angular/core";
import ChartModel from "../../models/Chart.model";

@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.css"],
  standalone: false,
})
export class TablesComponent implements DoCheck {
  @Input() chart: ChartModel;
  differ: any;

  constructor(private differs: KeyValueDiffers) {
    this.differ = differs.find({}).create();
  }

  ngDoCheck() {
    var changes = this.differ.diff(this.chart);
  }
}
