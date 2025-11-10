import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Routine } from "src/app/_models/routine";

@Component({
  selector: "app-routine-details",
  templateUrl: "./routine-details.component.html",
  styleUrl: "./routine-details.component.css",
  standalone: false,
})
export class RoutineDetailsComponent implements OnInit {
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<RoutineDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public routine: Routine
  ) {}

  ngOnInit() {
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
