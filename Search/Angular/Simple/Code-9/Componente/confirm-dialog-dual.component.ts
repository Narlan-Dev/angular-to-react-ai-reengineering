import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-dialog-dual",
  templateUrl: "./confirm-dialog-dual.component.html",
  styleUrls: ["./confirm-dialog-dual.component.css"],
  standalone: false,
})
export class ConfirmDialogDualComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogDualComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) {}

  onNoClick() {
    this.dialogRef.close(false);
  }
  cancelClick() {
    this.dialogRef.close(undefined);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
