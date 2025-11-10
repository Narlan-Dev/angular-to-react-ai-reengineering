import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

interface ResponseData {
  type: string;
}

@Component({
  selector: "app-routine-upload",
  templateUrl: "./routine-upload.component.html",
  styleUrl: "./routine-upload.component.css",
  standalone: false,
})
export class RoutineUploadComponent implements OnInit {
  loading = false;
  uploadAssignmentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RoutineUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ResponseData,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.uploadAssignmentForm = this.formBuilder.group({
      uploadAssignment: [null],
    });
    this.loading = false;
  }

  get f() {
    return this.uploadAssignmentForm.controls;
  }

  onAssignmentModelFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataFile = String(reader.result);
        this.uploadAssignmentForm.patchValue({
          uploadAssignment: dataFile,
        });
        this.cd.markForCheck();
      };
    }
  }

  validateFields() {
    this.uploadAssignmentForm.controls.uploadAssignment.setErrors(null);
    if (!this.f.uploadAssignment.value) {
      this.uploadAssignmentForm.controls.uploadAssignment.setErrors({
        required: true,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    this.validateFields();
    if (this.uploadAssignmentForm.valid) {
      this.loading = true;
      this.dialogRef.close(this.f.uploadAssignment.value);
    } else {
      this.loading = false;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
