import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { QuestionElement } from "src/app/_models/question";
import { QuestionService } from "src/app/_services/question.service";
import { PageActionsComponent } from "src/app/main/page-actions/page-actions.component";
import { QuestionSaveComponent } from "../question-save/question-save.component";
import { ConfirmDialogComponent } from "src/app/_shared/confirm-dialog/confirm-dialog.component";
import { catchError, throwError } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { QUESTION_MODEL } from "./../../_constants/questionModel.constants";
import { AuthenticationService } from "src/app/_services/authentication.service";

@Component({
  selector: "app-question-manager",
  templateUrl: "./question-manager.component.html",
  styleUrl: "./question-manager.component.css",
  standalone: false,
})
export class QuestionManagerComponent
  extends PageActionsComponent
  implements OnInit
{
  loading = false;
  submitted = false;
  track: any;
  displayedColumns: string[] = [
    "title",
    "description",
    "weight",
    "type",
    "button_edit",
    "button_exclude",
  ];
  questions: QuestionElement[] = [];
  currentUser: any;
  dataSource: MatTableDataSource<QuestionElement>;
  @Input() model: string = QUESTION_MODEL.SUBMISSION || QUESTION_MODEL.REVIEWER;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    @Inject(DOCUMENT) public document,
    public elementRef: ElementRef,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    super(document, elementRef);
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.track = JSON.parse(this.route.snapshot.paramMap.get("track"));
    this.fetchQuestions();
  }

  fetchQuestions() {
    this.loading = true;
    const query = {
      user_id: this.currentUser._id,
      track_id: this.track?._id ?? null,
      model: this.model,
    };

    this.questionService
      .readByUserAndTrack(query)
      .pipe(
        catchError((error) => {
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((response) => {
        if (response.status === "success") {
          this.fillDataSource(response.data);
        } else {
          this.questions = [];
        }
        this.loading = false;
      });
  }

  applyFilterQuestion(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fillDataSource(questions) {
    this.questions = questions;
    this.dataSource = new MatTableDataSource<QuestionElement>(questions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  navigateToEditQuestion(question: QuestionElement) {
    const dialogRef = this.dialog.open(QuestionSaveComponent, {
      width: "800px",
      data: {
        question,
        model: question.model,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchQuestions();
    });
  }

  openQuestionSaveDialog(): void {
    const dialogRef = this.dialog.open(QuestionSaveComponent, {
      width: "800px",
      data: {
        model: this.model,
        track: this.track,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      await this.refreshComponent();
    });
  }

  openRemoveDialog(question) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: `Deseja realmente apagar a pergunta ${question.title}?`,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.questionService
          .remove(question)
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
              this.fetchQuestions();
            } else {
              this.toastr.error(response.message);
            }
          });
      }
    });
  }

  refreshComponent(): Promise<QuestionElement[]> {
    return new Promise<QuestionElement[]>((resolve) => {
      this.ngOnInit();
      const interval = setInterval(() => {
        if (!this.loading) {
          clearInterval(interval);
          resolve(this.questions);
        }
      }, 100);
    });
  }
}
