import { Component, OnInit, Inject, ElementRef } from "@angular/core";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { EventService } from "src/app/_services/event.service";
import { catchError, filter } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { RouterEvent, NavigationEnd, Router, Event } from "@angular/router";
import { SubmissionService } from "src/app/_services/submission.service";
import { PageActionsComponent } from "src/app/main/page-actions/page-actions.component";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-review-main",
  templateUrl: "./review-main.component.html",
  styleUrls: ["./review-main.component.css"],
  standalone: false,
})
export class ReviewMainComponent
  extends PageActionsComponent
  implements OnInit
{
  isAdmin$: Observable<boolean>;
  downloading = false;
  track = null;
  loading = false;
  events = [];
  selectedEvent: any;

  constructor(
    @Inject(DOCUMENT) public document,
    public elementRef: ElementRef,
    private authenticationService: AuthenticationService,
    public submissionService: SubmissionService,
    public eventService: EventService,
    private router: Router,
    private toastr: ToastrService
  ) {
    super(document, elementRef);
    this.isAdmin$ = this.authenticationService.isAdminGlobal;
  }

  ngOnInit() {
    this.fetchEvents();

    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((routeData: any) => {
        if (routeData.urlAfterRedirects === "/home/(content:reviews)") {
          this.fetchEvents();
        }
      });
  }

  fetchEvents() {
    this.loading = true;
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

  loadSubmissionsByTrack(track) {
    this.track = track;
  }

  downloadSubmissions() {
    this.downloading = true;
    this.submissionService.readReportSubmissions(this.track._id).subscribe(
      (response) => {
        this.downloading = false;
        this.downloadXlsxFile(response, `submissoes-${this.track.name}`);
      },
      (error) => {
        this.downloading = false;
        this.toastr.error(error);
      }
    );
  }
}
