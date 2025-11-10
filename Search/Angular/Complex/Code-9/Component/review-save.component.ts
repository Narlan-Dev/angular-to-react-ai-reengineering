import {
  Component,
  OnInit,
  ElementRef,
  Inject,
  ViewChild,
} from "@angular/core";
import { PageActionsComponent } from "src/app/main/page-actions/page-actions.component";
import { DOCUMENT } from "@angular/common";
import {
  Router,
  RouterEvent,
  Event,
  NavigationEnd,
  ActivatedRoute,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { filter, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReviewService } from "src/app/_services/review.service";
import { SubmissionService } from "src/app/_services/submission.service";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { User } from "src/app/_models/user";
import { TrackService } from "src/app/_services/track.service";
import { QuestionElement } from "src/app/_models/question";
import { QuestionMainComponent } from "src/app/question/question-main/question-main.component";

@Component({
  selector: "app-review-save",
  templateUrl: "./review-save.component.html",
  styleUrls: ["./review-save.component.css"],
  standalone: false,
})
export class ReviewSaveComponent
  extends PageActionsComponent
  implements OnInit
{
  reviewForm: FormGroup;
  submitted = false;
  editorConfig: any;
  submissionReview: any;
  questions: QuestionElement[] = [];
  review: any;
  userCurrent: User;
  status = true;
  loading = false;
  track: any;
  @ViewChild(QuestionMainComponent)
  questionMainComponent: QuestionMainComponent;

  constructor(
    @Inject(DOCUMENT) public document,
    public elementRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private reviewService: ReviewService,
    private submissionService: SubmissionService,
    private trackService: TrackService,
    private authenticationService: AuthenticationService
  ) {
    super(document, elementRef);
  }

  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
      feedback: ["", Validators.required],
      status: [true, Validators.required],
      answerForQuestionTrack: [false],
      answerForSecondQuestionTrack: [false],
      questions: [null],
    });
    this.f.status.setValue(this.status);
    this.userCurrent = this.authenticationService.currentUserValue;
    const submission = this.route.snapshot.paramMap.get("submission");
    this.submissionReview = JSON.parse(submission);
    this.loading = true;
    this.submissionService
      .readById(this.submissionReview.submission._id)
      .pipe(
        catchError((error) => {
          this.loading = false;
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((result) => {
        this.submissionReview.submission.abstract =
          result.data.submissions.abstract;
        this.trackService
          .readById(this.submissionReview.submission.event_track)
          .pipe(
            catchError((error) => {
              this.loading = false;
              this.toastr.error(error, "Erro");
              return throwError(error);
            })
          )
          .subscribe((trackResult) => {
            this.track = trackResult.data;
            this.questions = this.track.questionsReviewers;
            this.fetchQuestions();
            this.loading = false;

            if (
              this.submissionReview.review_realized_user &&
              this.submissionReview.review_realized_user.appraisals.length > 0
            ) {
              this.review = this.submissionReview.review_realized_user;
              this.analyzeReviewRealized();
              this.router.events
                .pipe(filter((event: Event) => event instanceof NavigationEnd))
                .subscribe((routeData: any) => {
                  if (routeData.urlAfterRedirects === "/home/(save-review)") {
                    this.analyzeReviewRealized();
                  }
                });
            }
          });
      });
  }

  get f() {
    return this.reviewForm.controls;
  }

  downloadSubmissionFile(submission: any) {
    try {
      this.submissionService
        .getSubmissionFile(submission)
        .subscribe((response) => {
          this.downloadPdfFile(response, submission._id);
        });
    } catch (e) {
      this.toastr.error(`Ocorreu um erro.`);
    }
  }
  analyzeReviewRealized() {
    if (this.review) {
      this.review.appraisals.map((review) => {
        if (review.reviewer_id === this.userCurrent._id) {
          this.f.feedback.setValue(review.result.feedback);
          this.f.status.setValue(review.result.approved);
          this.f.answerForQuestionTrack.setValue(
            review.result.answerForQuestionTrack
          );
          if (
            review.result.additionalQuestionsAnswers &&
            review.result.additionalQuestionsAnswers.answers.length > 0
          ) {
            this.questions =
              review.result.additionalQuestionsAnswers.answers.map(
                (data) => data.question
              );
            const formattedAnswers =
              review.result.additionalQuestionsAnswers.answers.map((data) => ({
                question_id: data.question._id,
                [data.question._id]: data.answer,
              }));

            this.reviewForm.patchValue({
              questions: { questions: formattedAnswers },
            });
          } else if (
            review.result.additionalQuestionsAnswers &&
            review.result.additionalQuestionsAnswers.answers.length <= 0
          ) {
            if (this.track.questionsReviewers.length > 0) {
              this.reviewForm.patchValue({ questions: this.questions });
            }
          }
        }
      });
    }
  }

  fetchQuestions() {
    if (
      this.submissionReview.review_realized_user &&
      this.submissionReview.review_realized_user.appraisals.length > 0
    ) {
      this.review = this.submissionReview.review_realized_user;
      this.analyzeReviewRealized();
    } else {
      if (this.track.questionsReviewers.length > 0) {
        this.reviewForm.patchValue({ questions: this.questions });
      }
    }
  }

  updateSubmission() {
    this.loading = true;
    console.log(this.submissionReview.submission.reviews);
    return;
    if (this.submissionReview.submission.reviews.length === 1) {
      this.submissionService
        .updateSubmissionDateReview(this.submissionReview.submission)
        .pipe(
          catchError((error) => {
            this.toastr.error(error, "Erro");
            return throwError(error);
          })
        )
        .subscribe((data) => {
          this.loading = false;
          if (data.status === "success") {
            this.router
              .navigate(["/home", { outlets: { content: ["reviews"] } }])
              .then(() => {
                this.toastr.success(
                  "Revisão realizada com sucesso.",
                  "Sucesso"
                );
              });
          }
        });
    } else {
      this.submissionService
        .updateSubmissionReviewManyReviewer(this.submissionReview.submission)
        .pipe(
          catchError((error) => {
            this.toastr.error(error, "Erro");
            return throwError(error);
          })
        )
        .subscribe((data) => {
          this.loading = false;
          if (data.status === "success") {
            this.router
              .navigate(["/home", { outlets: { content: ["reviews"] } }])
              .then(() => {
                this.toastr.success(
                  "Revisão realizada com sucesso.",
                  "Sucesso"
                );
              });
          } else {
            this.toastr.error(data.message, "Erro");
          }
        });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.reviewForm.invalid || this.questionMainComponent?.isInvalid()) {
      return;
    }
    this.loading = true;

    this.status = this.f.status.value;
    this.submissionReview.submission.approved = this.f.status.value;
    const questionsComponent = this.reviewForm.get("questions");
    const questionTotal = this.questionMainComponent
      ? this.questionMainComponent.getTotal()
      : 0;

    const questionAnswers = {
      answers: this.formattedAddictionQuestionAnswer(
        questionsComponent?.value?.questions || []
      ),
      total: questionTotal,
    };
    const idReview = this.submissionReview.submission.reviews[0]._id;
    const resultReview = {
      reviewer_id: this.userCurrent._id,
      reviewer_name: this.userCurrent.name,
      result: {
        feedback: this.f.feedback.value,
        approved: this.status,
        answerForQuestionTrack: this.f.answerForQuestionTrack.value,
        answerForSecondQuestionTrack: this.f.answerForSecondQuestionTrack.value,
        additionalQuestionsAnswers: questionAnswers,
      },
    };

    this.reviewService
      .sendReview(this.submissionReview.submission._id, resultReview)
      .pipe(
        catchError((error) => {
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((data) => {
        if (data.status === "success") {
          this.loading = false;
          this.review = data.review;
          this.toastr.success("Revisão realizada com sucesso.", "Sucesso");
        }
      });
  }

  cancelReview() {
    this.router.navigate(["/home", { outlets: { content: ["reviews"] } }]);
  }

  formattedAddictionQuestionAnswer(content: Array<any>) {
    return content.map((response) => {
      return {
        question: response.question_id,
        answer: response[response.question_id],
      };
    });
  }
}
