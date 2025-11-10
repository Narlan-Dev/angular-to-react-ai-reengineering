import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { PageActionsComponent } from "src/app/main/page-actions/page-actions.component";
import { DOCUMENT } from "@angular/common";
import { Router, RouterEvent, NavigationEnd, Event } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { filter, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { SubmissionService } from "src/app/_services/submission.service";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { SubmissionElement } from "src/app/_models/submissions";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/_shared/confirm-dialog/confirm-dialog.component";
import { AdminSubmissionElement } from "src/app/_models/admin-submissions";
import { EventService } from "src/app/_services/event.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SUBMISSION_LIFE_CYCLE } from "src/app/_constants/submissionCycle.constants";

@Component({
  selector: "app-submission-main",
  templateUrl: "./submission-main.component.html",
  styleUrls: ["./submission-main.component.css"],
  standalone: false,
})
export class SubmissionMainComponent
  extends PageActionsComponent
  implements OnInit
{
  loading = false;
  loadingForAdvisorSubmissions = false;
  loadedFirstTime = false;
  isAdmin$: Observable<boolean>;
  isAdmin = false;

  submissions = [];
  submissionsAdmin = [];
  events = [];
  selectedEvent: any;
  trackId: any;

  page = 1;
  amountUsers: any;
  currentPage: any;
  pageSize: any;
  searchForm: FormGroup;
  searchAdvisorForm: FormGroup;
  filterValue = "";
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [
    "counter",
    "title",
    "created_at",
    "event_short_name",
    "event_track_name",
    "presentation",
    "button_edit",
    "button_exclude",
  ];
  adminDisplayedColumns: string[] = [
    "counter",
    "cpf",
    "title",
    "created_at",
    "presentation",
    "status",
    "button_edit",
    "button_exclude",
  ];
  tabIndex = 1;
  pageForAdvisor = 1;
  submissionsAdminForAdvisor = [];
  filterValueForAdvisor = "";
  amountOfSubmissions: any;
  currentPageForAdvisor: any;
  pageSizeForAdvisor: any;
  adminDataSourceForAdvisor: MatTableDataSource<AdminSubmissionElement>;
  searchForAdvisorForm: FormGroup;
  displayedColumnsForAdvisor: string[] = [
    "counter",
    "title",
    "created_at",
    "button_edit",
  ];

  dataSource: MatTableDataSource<SubmissionElement>;
  adminDataSource: MatTableDataSource<AdminSubmissionElement>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) adminPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) adminSort: MatSort;

  constructor(
    @Inject(DOCUMENT) public document,
    public elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private submissionService: SubmissionService,
    public eventService: EventService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    super(document, elementRef);
  }

  ngOnInit() {
    this.isAdmin$ = this.authenticationService.isAdminGlobal;
    this.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    this.searchForm = this.formBuilder.group({
      search: [""],
    });
    this.searchForAdvisorForm = this.formBuilder.group({
      searchAdvisor: [""],
    });
    this.fetchData();
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((routeData: any) => {
        if (routeData.urlAfterRedirects === "/home/(content:submissions)") {
          this.fetchData();
        }
      });
  }

  get f() {
    return this.searchForm.controls;
  }
  get fAdvisor() {
    return this.searchForAdvisorForm.controls;
  }

  fetchData() {
    if (!this.isAdmin) {
      this.submissions = [];
      this.fetchSubmissions();
    } else {
      this.submissionsAdmin = [];
      if (this.trackId) {
        this.fetchSubmissionsByTrack(this.trackId, this.filterValue);
      } else {
        this.fetchEvents();
      }
    }
  }

  fetchSubmissions() {
    if (!this.isAdmin) {
      this.submissionService
        .readByUserId(this.authenticationService.userId)
        .pipe(
          catchError((error) => {
            this.loading = false;
            this.toastr.error(error, "Erro");
            return throwError(error);
          })
        )
        .subscribe((result) => {
          this.loading = false;
          if (result.status === "success") {
            this.submissions = result.data;
            this.dataSource = new MatTableDataSource<SubmissionElement>(
              result.data
            );
            this.dataSource.sort = this.sort;
            this.tabIndex = 0;
          } else {
            this.toastr.error(result.message, "Erro");
          }
        });
    }
  }

  getSubmissionStatus(status: string) {
    switch (status) {
      case SUBMISSION_LIFE_CYCLE.APPROVED:
        return "Submissão concluída";
      case SUBMISSION_LIFE_CYCLE.PENDING_CORRECTION:
        return "Ajuste pendente";
      case SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_REVIEW:
        return "Aguardando revisão e liberação do orientador";
      case SUBMISSION_LIFE_CYCLE.PENDING_REVIEWER_APPROVAL:
        return "Aguardando revisão";
      case SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_ACCEPTANCE:
        return "Aguardando aceite do orientador";
      case SUBMISSION_LIFE_CYCLE.CREATED:
        return "Submissão criada";
      case SUBMISSION_LIFE_CYCLE.DISAPPROVED:
        return "Submissão reprovada";
      case SUBMISSION_LIFE_CYCLE.PRESENTED:
        return "Submissão apresentada";
      default:
        return "Aguardando liberação do orientador";
    }
  }

  search() {
    this.page = 1;
    this.fetchSubmissionsByTrack(this.trackId, this.f.search.value);
  }

  searchAdvisor() {
    this.page = 1;
    this.fetchSubmissionsForAdvisorByTrack(
      this.trackId,
      this.fAdvisor.searchAdvisor.value
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToEditSubmission(submission) {
    this.router.navigate([
      "/home",
      { outlets: { content: ["submission-save", { id: submission._id }] } },
    ]);
  }
  navigateToValidateSubmission(submission) {
    this.router.navigate([
      "/home",
      { outlets: { content: ["submission-save", { id: submission._id }] } },
    ]);
  }

  removeSubmission(element) {
    this.submissionService
      .remove(element)
      .pipe(
        catchError((error) => {
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.fetchData();
      });
  }

  openRemoveDialog(submission): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: `Deseja realmente apagar a submissão intitulada '${submission.title}'?`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeSubmission(submission);
      }
    });
  }

  navigateToNewSubmission() {
    this.router.navigate([
      "/home",
      {
        outlets: {
          content: [
            "choose-track",
            {
              destinationRoute: "submission-save",
              title: "Nova submissão",
              eventServiceRoute: "on_submission",
            },
          ],
        },
      },
    ]);
  }

  fetchEvents() {
    if (this.isAdmin) {
      this.events = [];
      this.eventService
        .readForSubmission()
        .pipe(
          catchError((error) => {
            this.loading = false;
            this.toastr.error(error, "Erro");
            return throwError(error);
          })
        )
        .subscribe((result) => {
          this.loading = false;
          if (result.status === "success") {
            this.events = result.data;
          } else {
            this.toastr.error(result.message, "Erro");
          }
        });
    }
  }

  loadSubmissionsByTrack(track) {
    this.filterValue = "";
    this.f.search.setValue("");
    this.fAdvisor.searchAdvisor.setValue("");
    this.submissionsAdmin = [];
    this.page = 1;
    this.trackId = track._id;
    this.fetchSubmissionsByTrack(track._id, this.filterValue);
    this.fetchSubmissionsForAdvisorByTrack(track._id, this.filterValue);
  }

  fetchSubmissionsForAdvisorByTrack(id, filterValue) {
    this.loadingForAdvisorSubmissions = true;
    this.submissionService
      .readUserSubmissions(this.pageForAdvisor, filterValue)
      .pipe(
        catchError((error) => {
          this.loadingForAdvisorSubmissions = false;
          this.loadedFirstTime = true;
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((result) => {
        this.loadingForAdvisorSubmissions = false;
        this.loadedFirstTime = true;
        if (result.status === "success") {
          if (result.data.documents.length === 0) {
            this.searchForAdvisorForm.controls.searchAdvisor.setErrors({
              not_match: true,
            });
            return;
          } else {
            this.submissionsAdminForAdvisor = result.data.documents;
            this.filterValueForAdvisor = filterValue;
            this.amountOfSubmissions = result.total;
            this.currentPageForAdvisor = result.currentPage;
            this.pageSizeForAdvisor = result.pageSize;
            this.adminDataSourceForAdvisor =
              new MatTableDataSource<AdminSubmissionElement>(
                result.data.documents
              );
            this.adminDataSourceForAdvisor.paginator = this.adminPaginator;
            this.adminDataSourceForAdvisor.sort = this.adminSort;
            this.tabIndex = 0;
          }
        } else {
          this.toastr.error(result.message, "Erro");
        }
      });
  }

  fetchSubmissionsByTrack(id, filterValue) {
    this.loading = true;
    this.submissionService
      .readByTrackId(id, this.page, filterValue)
      .pipe(
        catchError((error) => {
          this.loading = false;
          this.loadedFirstTime = true;
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((result) => {
        this.loading = false;
        this.loadedFirstTime = true;
        if (result.status === "success") {
          if (result.data.submissions.length === 0) {
            this.searchForm.controls.search.setErrors({ not_match: true });
            return;
          } else {
            this.submissionsAdmin = result.data.submissions;
            this.filterValue = filterValue;
            this.amountUsers = result.total;
            this.currentPage = result.currentPage;
            this.pageSize = result.pageSize;
            this.adminDataSource =
              new MatTableDataSource<AdminSubmissionElement>(
                result.data.submissions
              );
            this.adminDataSource.paginator = this.adminPaginator;
            this.adminDataSource.sort = this.adminSort;
            this.tabIndex = 0;
          }
        } else {
          this.toastr.error(result.message, "Erro");
        }
      });
  }

  paginate(page: any) {
    this.page = page;
    this.fetchSubmissionsByTrack(this.trackId, this.filterValue);
  }
}
