import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { PageActionsComponent } from "src/app/main/page-actions/page-actions.component";
import {
  Router,
  RouterEvent,
  Event,
  NavigationEnd,
  ActivatedRoute,
} from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DOCUMENT } from "@angular/common";
import { catchError, filter } from "rxjs/operators";
import { throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MatPaginator } from "@angular/material/paginator";
import { SubmissionDetailsComponent } from "../submission-details/submission-details.component";
import { SubmissionService } from "./../../_services/submission.service";
import { SubmissionElement } from "src/app/_models/submissions";
import { ConfirmDialogComponent } from "src/app/_shared/confirm-dialog/confirm-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-review-status",
  templateUrl: "./review-status.component.html",
  styleUrls: ["./review-status.component.css"],
  standalone: false,
})
export class ReviewStatusComponent
  extends PageActionsComponent
  implements OnInit
{
  loading = false;
  statusReview: boolean;
  track: any;
  submissions = [];
  downloading = false;

  displayedColumns: string[] = [
    "counter",
    "title",
    "knowledge_area",
    "authors",
    "reviewers",
    "details",
  ];
  dataSource: MatTableDataSource<SubmissionElement>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    @Inject(DOCUMENT) public document,
    public elementRef: ElementRef,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private submissionService: SubmissionService
  ) {
    super(document, elementRef);
  }

  ngOnInit() {
    const status = this.route.snapshot.paramMap.get("statusReview");
    const track = this.route.snapshot.paramMap.get("track");
    this.statusReview = JSON.parse(status);
    this.track = JSON.parse(track);
    this.fetchSubmissionStatusEvent();
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((routeData: any) => {
        if (routeData.urlAfterRedirects === "/home/(content:review-status)") {
          this.fetchSubmissionStatusEvent();
        }
      });
  }

  fetchSubmissionStatusEvent() {
    this.loading = true;
    this.submissionService
      .readByStatusTrack(this.track, this.statusReview)
      .pipe(
        catchError((error) => {
          this.loading = false;
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((result) => {
        this.loading = false;
        this.submissions = result.data;
        this.fillReviewsDataSource(this.submissions);
      });
  }

  fillReviewsDataSource(submissions) {
    this.dataSource = new MatTableDataSource<SubmissionElement>(submissions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDetailsDialog(submission): void {
    this.dialog.open(SubmissionDetailsComponent, {
      width: "500px",
      data: submission,
    });
  }

  downloadSubmissionsByApprovalStatus(status: boolean) {
    this.downloading = true;
    this.submissionService
      .readReportSubmissionsByApprovalStatus(this.track._id, status)
      .subscribe(
        (response) => {
          this.downloading = false;
          this.downloadXlsxFile(
            response,
            `submissoes-${status ? "aprovadas" : "reprovadas"}`
          );
        },
        (error) => {
          this.downloading = false;
          this.toastr.error(error);
        }
      );
  }

  sendSubmissionResultByEmail(status: boolean) {
    const submissions = [];

    this.submissions.forEach((submission) => {
      submissions.push({
        owner: submission.owner,
        submissionId: submission._id,
        event: submission.event,
      });
    });

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: `Deseja comunicar o resultado via e-mail para os ${submissions.length} participantes envolvidos?`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submissionService
          .reportSubmissionStatusByEmail(submissions, status)
          .subscribe(
            (response) => {
              this.toastr.success("E-mails enviados com sucesso!", "Sucesso");
            },
            (error) => {
              this.toastr.error(error, "Erro");
            }
          );
      }
    });
  }
}
