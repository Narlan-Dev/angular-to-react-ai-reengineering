import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { catchError, throwError } from "rxjs";
import { QUESTION_TYPES } from "src/app/_constants/questionTypes.constants";
import { QuestionElement } from "src/app/_models/question";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { QuestionService } from "src/app/_services/question.service";

interface ResponseData {
  question?: QuestionElement;
  model: string;
  track?: any;
}

@Component({
  selector: "app-question-save",
  templateUrl: "./question-save.component.html",
  styleUrl: "./question-save.component.css",
  standalone: false,
})
export class QuestionSaveComponent implements OnInit {
  questionForm: FormGroup;
  questions: QuestionElement[] = [];
  loading = false;
  submitted = false;
  isEdit = false;
  track: any;
  currentUser: any;
  types = [
    QUESTION_TYPES.TEXT,
    QUESTION_TYPES.LONG_TEXT,
    QUESTION_TYPES.SELECT,
    QUESTION_TYPES.NUMBER,
  ];

  constructor(
    public dialogRef: MatDialogRef<QuestionSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ResponseData,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      title: ["", Validators.required],
      type: ["", Validators.required],
      weight: [null],
      description: [""],
    });

    this.currentUser = this.authenticationService.currentUserValue;
    this.fetchedQuestions();
    this.isEdit = !!this.responseData?.question;
    if (this.isEdit) {
      this.f.title.setValue(this.responseData.question.title);
      this.f.type.setValue(this.responseData.question.type);

      if (this.responseData.question.description) {
        this.f.description.setValue(this.responseData.question.description);
      }

      if (this.responseData.question.weight) {
        this.f.weight.setValue(this.responseData.question.weight);
      }
    }

    this.questionForm.get("type")?.valueChanges.subscribe((typeValue) => {
      const weightControl = this.questionForm.get("weight");

      if (
        typeValue === QUESTION_TYPES.SELECT ||
        typeValue === QUESTION_TYPES.NUMBER
      ) {
        weightControl?.setValidators(Validators.required);
      } else {
        weightControl?.clearValidators();
      }
      weightControl?.updateValueAndValidity();

      weightControl?.setValue(null);
    });

    this.loading = false;
  }

  fetchedQuestions() {
    this.questionService
      .readByUserAndTrack({
        user_id: this.currentUser._id,
        track_id: this.responseData?.track?._id ?? null,
        model: this.responseData.model,
      })
      .pipe(
        catchError((error) => {
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((response) => {
        if (response.status === "success") {
          this.questions = response.data;
        }
      });
  }

  get f() {
    return this.questionForm.controls;
  }

  isWeightInvalid() {
    return (
      (this.f.type.value === QUESTION_TYPES.SELECT ||
        this.f.type.value === QUESTION_TYPES.NUMBER) &&
      this.submitted &&
      this.f.weight.errors?.required
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;

    const weight = this.f.weight.value;
    const type = this.f.type.value;

    if (
      (type === QUESTION_TYPES.SELECT || type === QUESTION_TYPES.NUMBER) &&
      (weight <= 0 || weight > 100)
    ) {
      this.toastr.warning(`O peso fornecido deve está no intervalo de 1 a 100`);
      this.loading = false;
      return;
    }

    if (this.questionForm.invalid) {
      if (this.f.type.errors) {
        this.toastr.warning(`Necessário informar o tipo da pergunta`);
      }
      this.loading = false;
      return;
    }

    if (!this.validationLimitWeight()) {
      this.toastr.warning(
        `A soma dos pesos das perguntas para ${this.responseData.model} não pode ultrapassar 100`
      );
      this.loading = false;
      return;
    }

    const question: QuestionElement = {
      title: this.f.title.value,
      description: this.f.description.value,
      weight:
        this.f.type.value === QUESTION_TYPES.NUMBER ||
        this.f.type.value === QUESTION_TYPES.SELECT
          ? this.f.weight.value
          : null,
      type: this.f.type.value,
      model: this.responseData.model,
      owner: this.currentUser,
    };

    if (this.isEdit) {
      question["_id"] = this.responseData.question._id;
      this.questionService
        .update(question)
        .pipe(
          catchError((error) => {
            this.toastr.error(error, "Erro");
            this.loading = false;
            return throwError(error);
          })
        )
        .subscribe((response) => {
          if (response.status === "success") {
            this.toastr.success(response.message);
            this.dialogRef.close(response.data);
          } else {
            this.toastr.error(response.message);
          }
        });
    } else {
      this.questionService
        .save(question)
        .pipe(
          catchError((error) => {
            this.toastr.error(error, "Erro");
            this.loading = false;
            return throwError(error);
          })
        )
        .subscribe((response) => {
          if (response.status === "success") {
            this.toastr.success(response.message);
            this.dialogRef.close(response.data);
          } else {
            this.toastr.error(response.message);
          }
        });
    }
  }

  validationLimitWeight() {
    const totalWeight = this.questions.reduce(
      (acc: number, question: QuestionElement) => {
        if (question.weight) {
          if (this.isEdit && question._id === this.responseData.question._id) {
            return acc;
          }
          acc += question.weight;
        }
        return acc;
      },
      0
    );
    const currentWeight = this.f.weight.value || 0;

    if (
      this.f.type.value === QUESTION_TYPES.SELECT ||
      this.f.type.value === QUESTION_TYPES.NUMBER
    ) {
      const newTotal = currentWeight + totalWeight;

      if (newTotal > 100) {
        return false;
      }

      return true;
    }
    return true;
  }
}
