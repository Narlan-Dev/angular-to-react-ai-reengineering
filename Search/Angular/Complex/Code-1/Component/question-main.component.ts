import { Component, forwardRef, Input } from "@angular/core";
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from "@angular/forms";
import { QUESTION_TYPES } from "src/app/_constants/questionTypes.constants";
import { QuestionElement } from "src/app/_models/question";

@Component({
  selector: "app-question-main",
  templateUrl: "./question-main.component.html",
  styleUrl: "./question-main.component.css",
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => QuestionMainComponent),
    },
  ],
})
export class QuestionMainComponent implements ControlValueAccessor {
  @Input() questions: QuestionElement[] = [];
  @Input() submitted: boolean = false;

  questionForm: FormGroup;
  total: number = 0;

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      questions: this.fb.array([]),
    });

    this.questionForm.valueChanges.subscribe(() => {
      this.calculateTotal();
      this.onChange({
        questions: this.questionForm.value.questions,
        total: this.total,
      });
    });
  }

  ngOnInit() {
    if (this.questions && this.questions.length > 0) {
      this.initializeQuestionControls();
    }

    this.questionForm.valueChanges.subscribe(() => {
      this.onChange(this.questionForm.value);
    });
  }

  initializeQuestionControls() {
    const questionsArray = this.questionForm.get("questions") as FormArray;
    questionsArray.clear();

    this.questions.forEach((question) => {
      const questionGroup = this.fb.group({
        question_id: question._id,
        [question._id]: this.createQuestionControl(question),
      });
      questionsArray.push(questionGroup);
    });
  }

  createQuestionControl(question: QuestionElement): FormControl {
    switch (question.type) {
      case QUESTION_TYPES.LONG_TEXT:
        return new FormControl("", [
          Validators.required,
          Validators.minLength(10),
        ]);
      case QUESTION_TYPES.TEXT:
        return new FormControl("", [
          Validators.required,
          Validators.minLength(1),
        ]);
      case QUESTION_TYPES.SELECT:
        return new FormControl<number | null>(null, [
          Validators.required,
          Validators.min(1),
          Validators.max(5),
        ]);
      case QUESTION_TYPES.NUMBER:
        return new FormControl<number | null>(null, [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ]);
      default:
        return new FormControl("", Validators.required);
    }
  }

  getQuestionControl(questionId: string) {
    const questionsArray = this.questionForm.get("questions") as FormArray;
    const questionGroup = questionsArray.controls.find(
      (control) => control.get("question_id")?.value === questionId
    );
    return questionGroup ? questionGroup.get(questionId) : null;
  }

  getMinValue(type: string): number {
    switch (type) {
      case QUESTION_TYPES.SELECT:
        return 1;
      case QUESTION_TYPES.NUMBER:
        return 0;
      default:
        return 0;
    }
  }

  getMaxValue(type: string): number {
    switch (type) {
      case QUESTION_TYPES.SELECT:
        return 5;
      case QUESTION_TYPES.NUMBER:
        return 100;
      default:
        return 0;
    }
  }

  calculateTotal() {
    this.total = 0;
    const questionsArray = this.questionForm.get("questions") as FormArray;

    questionsArray.controls.forEach((control) => {
      const questionId = control.get("question_id")?.value;
      const question = this.questions.find((q) => q._id === questionId);

      if (
        question &&
        (question.type === QUESTION_TYPES.SELECT ||
          question.type === QUESTION_TYPES.NUMBER)
      ) {
        const value = control.get(questionId)?.value || 0;
        this.total += value * (question.weight || 1);
      }
    });
  }

  hasWeightQuestions(): boolean {
    return this.questions.some(
      (q) =>
        q.type === QUESTION_TYPES.SELECT || q.type === QUESTION_TYPES.NUMBER
    );
  }

  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      if (value.questions) {
        this.questionForm.patchValue(value);
      } else {
        this.questionForm.patchValue({ questions: value });
      }
    } else {
      this.questionForm.reset();
      this.initializeQuestionControls();
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.questionForm.disable() : this.questionForm.enable();
  }

  getTotal(): number {
    return this.total;
  }

  isInvalid(): boolean {
    return this.questionForm.invalid;
  }
}
