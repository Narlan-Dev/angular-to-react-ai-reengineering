import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router, NavigationEnd, Event } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { filter, catchError } from "rxjs/operators";
import { Routine } from "src/app/_models/routine";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { CertificateService } from "src/app/_services/certificate.service";
import { EventService } from "src/app/_services/event.service";
import { RoutineService } from "src/app/_services/routine.service";
import { PageActionsComponent } from "src/app/main/page-actions/page-actions.component";
import { RoutineDetailsComponent } from "../routine-details/routine-details.component";
import { RoutineUploadComponent } from "../routine-upload/routine-upload.component";
import { PresentationService } from "src/app/_services/presentation.service";
import { ReviewService } from "src/app/_services/review.service";

@Component({
  selector: "app-routine-main",
  templateUrl: "./routine-main.component.html",
  styleUrl: "./routine-main.component.css",
  standalone: false,
})
export class RoutineMainComponent
  extends PageActionsComponent
  implements OnInit
{
  loading = false;
  loadedFirstTime = false;
  isAdmin$: Observable<boolean>;
  isAdmin = false;
  routines = [];
  events = [];
  eventId: string;
  selectedEvent: any;
  page = 1;
  currentPage: any;
  totalItems: any;
  pageSize: any;
  searchForm: FormGroup;
  filterValue = "";
  displayedColumns: string[] = [
    "counter",
    "type",
    "created_by",
    "created_at",
    "finished_at",
    "status",
    "button_details",
  ];
  tabIndex = 1;
  pageForAdvisor = 1;
  amountOfSubmissions: any;
  adminDataSource: MatTableDataSource<Routine>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) adminPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) adminSort: MatSort;

  constructor(
    @Inject(DOCUMENT) public document,
    public elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private routineService: RoutineService,
    private reviewService: ReviewService,
    private certificateService: CertificateService,
    private presentationService: PresentationService,
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
    this.fetchData();
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((routeData: any) => {
        if (routeData.urlAfterRedirects === "/home/(content:routine-main)") {
          this.fetchData();
        }
      });
  }

  get f() {
    return this.searchForm.controls;
  }

  search() {
    this.page = 1;
    this.fetchRoutines(this.eventId, this.f.search.value);
  }

  fetchData() {
    this.routines = [];
    this.fetchEvents();
  }

  applyFilter(filterValue: string) {
    this.adminDataSource.filter = filterValue.trim().toLowerCase();
  }

  openRoutineDetailsDialog(routine: Routine): void {
    this.dialog.open(RoutineDetailsComponent, {
      width: "500px",
      data: routine,
    });
  }

  fetchEvents() {
    if (this.isAdmin) {
      this.events = [];
      this.eventService
        .readOnSubscriptionStarted()
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

  loadRoutinesByEvent(event: any) {
    this.filterValue = "";
    this.f.search.setValue("");
    this.routines = [];
    this.page = 1;
    this.eventId = event._id;
    this.fetchRoutines(event._id, this.filterValue);
  }

  fetchRoutines(id: string, filterValue: string) {
    this.loading = true;
    this.routineService
      .readByEventId(id, this.page, filterValue)
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
          if (result.data.routines.length === 0) {
            return;
          } else {
            this.routines = result.data.routines;
            this.filterValue = filterValue;
            this.totalItems = result.total;
            this.currentPage = result.currentPage;
            this.pageSize = result.pageSize;
            this.adminDataSource = new MatTableDataSource<Routine>(
              result.data.routines
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

  handleGenerateCertificates() {
    this.loading = true;
    this.certificateService
      .routineCreateCertificates(
        this.selectedEvent._id,
        this.authenticationService.currentUserValue._id
      )
      .pipe(
        catchError((error) => {
          this.loading = false;
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((result) => {
        this.loading = false;
        this.loadRoutinesByEvent(this.selectedEvent);
        if (result.status === "success") {
          this.toastr.success(result.message, "Sucesso");
        } else if (result.status === "warning") {
          this.toastr.warning(result.message, "Aviso");
        } else {
          this.toastr.error(result.message, "Erro");
        }
      });
  }

  handleImportAssignments() {
    const dialogRef = this.dialog.open(RoutineUploadComponent, {
      width: "720px",
      data: {
        type: "atribuições",
      },
    });
    dialogRef.afterClosed().subscribe((uploadedAssignments: any) => {
      if (uploadedAssignments) {
        this.loading = true;
        this.presentationService
          .routineImportAssignments(
            this.selectedEvent._id,
            uploadedAssignments,
            this.authenticationService.currentUserValue._id
          )
          .pipe(
            catchError((error) => {
              this.loading = false;
              this.toastr.error(error, "Erro");
              return throwError(error);
            })
          )
          .subscribe((result) => {
            this.loading = false;
            this.loadRoutinesByEvent(this.selectedEvent);
            if (result.status === "success") {
              this.toastr.success(result.message, "Sucesso");
            } else if (result.status === "warning") {
              this.toastr.warning(result.message, "Aviso");
            } else {
              this.toastr.error(result.message, "Erro");
            }
          });
      }
    });
  }

  handleAssignmentReviewers() {
    this.loading = true;
    this.reviewService
      .routineAssignReviewers(
        this.selectedEvent._id,
        this.authenticationService.currentUserValue._id
      )
      .pipe(
        catchError((error) => {
          this.loading = false;
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((result) => {
        this.loading = false;
        this.loadRoutinesByEvent(this.selectedEvent);
        if (result.status === "success") {
          this.toastr.success(result.message, "Sucesso");
        } else if (result.status === "warning") {
          this.toastr.warning(result.message, "Aviso");
        } else {
          this.toastr.error(result.message, "Erro");
        }
      });
  }

  handleImportExemptions() {
    const dialogRef = this.dialog.open(RoutineUploadComponent, {
      width: "720px",
      data: {
        type: "isenções",
      },
    });
    dialogRef.afterClosed().subscribe((uploadedExemptions: any) => {
      if (uploadedExemptions) {
        this.loading = true;
        this.eventService
          .routineImportExemptions(
            this.selectedEvent._id,
            uploadedExemptions,
            this.authenticationService.currentUserValue._id
          )
          .pipe(
            catchError((error) => {
              this.loading = false;
              this.toastr.error(error, "Erro");
              return throwError(error);
            })
          )
          .subscribe((result) => {
            this.loading = false;
            this.loadRoutinesByEvent(this.selectedEvent);
            if (result.status === "success") {
              this.toastr.success(result.message, "Sucesso");
            } else if (result.status === "warning") {
              this.toastr.warning(result.message, "Aviso");
            } else {
              this.toastr.error(result.message, "Erro");
            }
          });
      }
    });
  }

  paginate(page: any) {
    this.page = page;
    this.fetchRoutines(this.eventId, this.filterValue);
  }
}
