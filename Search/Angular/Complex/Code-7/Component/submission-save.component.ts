import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { PageActionsComponent } from "src/app/main/page-actions/page-actions.component";
import { DOCUMENT } from "@angular/common";
import _ from "lodash";
import {
  Router,
  ActivatedRoute,
  RouterEvent,
  NavigationEnd,
  Event,
} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { CustomValidators } from "src/app/_helpers/custom-validators";
import { KnowledgeAreaService } from "src/app/_services/knowledge-area.service";
import { UserExceptionService } from "src/app/_services/user-exception.service";
import { catchError, filter } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import PresentationConstants from "src/app/_constants/presentation.constants";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { SubmissionService } from "src/app/_services/submission.service";
import { Config } from "./editor-config";
import { EventService } from "src/app/_services/event.service";
import { ValidateBrService } from "angular-validate-br";
import { TrackService } from "src/app/_services/track.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import ConvertUtils from "src/app/_utils/convert-utils";
import { SUBMISSION_LIFE_CYCLE } from "src/app/_constants/submissionCycle.constants";
import { SubmissionElement } from "src/app/_models/submissions";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { QuestionElement } from "src/app/_models/question";
import { QuestionService } from "src/app/_services/question.service";
import { Editor, Toolbar } from "ngx-editor";
import { QuestionMainComponent } from "src/app/question/question-main/question-main.component";

interface SelectOption {
  value: number;
  label: string;
}

@Component({
  selector: "app-submission-save",
  templateUrl: "./submission-save.component.html",
  styleUrls: ["./submission-save.component.css"],
  standalone: false,
})
export class SubmissionSaveComponent
  extends PageActionsComponent
  implements OnInit
{
  dropdownSettings: IDropdownSettings;
  dropdownList = [];
  selectedItems = [];
  questions: QuestionElement[] = [];
  submissionForm: FormGroup;
  submissions = [];
  tabIndex = 1;
  loading = false;
  submitted = false;
  fullTrackFormat = false;
  fileExists = false;
  badFormat = false;
  isAdmin$: Observable<boolean>;
  isAdmin = false;
  error = "";
  minWords = environment.minWords;
  maxWords = environment.maxWords;
  words = 0;
  presentationTypes = PresentationConstants.PRESENTATION_TYPES;
  areas = [];
  supportingSources = [
    "CNPq",
    "FAPESB",
    "PROEXT",
    "PET/UFRB",
    "CAPES",
    "UFRB",
    "Outros editais",
    "Outras instituições",
    "Sem financiamento",
  ];
  selectedKnowledgeArea: any;
  requestEmail = false;
  requestAdvisorCpf = false;
  editByAdvisor = false;
  isEdit = false;
  track: any;
  event: any;
  submission: any;
  editorConfig: any;
  toolbar: Toolbar = [
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"],
  ];
  virtualEventStatement = "";
  comment = "";
  centers = [
    "CAHL",
    "CETENS",
    "CCAAB",
    "CCS",
    "CETEC",
    "CECULT",
    "CFP",
    "Outros setores",
  ];
  dataSource: MatTableDataSource<SubmissionElement>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("questionsForm") questionsForm: QuestionMainComponent;

  constructor(
    @Inject(DOCUMENT) public document,
    public elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    private eventService: EventService,
    private trackService: TrackService,
    private authenticationService: AuthenticationService,
    private areaService: KnowledgeAreaService,
    private userExceptionService: UserExceptionService,
    private submissionService: SubmissionService,
    private validateBrService: ValidateBrService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    super(document, elementRef);
  }

  ngOnInit() {
    this.isAdmin$ = this.authenticationService.isAdminGlobal;
    this.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    this.submissionForm = this.formBuilder.group(
      {
        title: ["", Validators.required],
        abstract: ["", Validators.required],
        authors: ["", [Validators.required, this.validateContainsPoint]],
        keywords: ["", Validators.required],
        presentation: ["", Validators.required],
        knowledge_area: ["", Validators.required],
        institution: ["", Validators.required],
        advisor: [""],
        submissionFile: [null],
        advisorEmail: [""],
        supporting_source: ["", Validators.required],
        supporting_institution_message: [""],
        acceptVirtualEventStatement: [false],
        additionalQuestionAnswer: [false],
        category: [""],
        submission_with_file: [false],
        center: [""],
        extensive: [false, Validators.requiredTrue],
        questions: [null],
      },
      {
        validators: [this.validateAtLeastOneName],
      }
    );

    this.submissions = [];
    this.fetchSubmissions();

    const t = this.route.snapshot.paramMap.get("track");
    const e = this.route.snapshot.paramMap.get("event");
    this.editByAdvisor = Boolean(
      this.route.snapshot.paramMap.get("edit_by_advisor")
    );

    if (t) {
      this.track = JSON.parse(t);
      if (this.track.format == "full") {
        const fileControl = this.submissionForm.get("submissionFile");
        const abstract = this.submissionForm.get("abstract");
        abstract.clearValidators();
        abstract.updateValueAndValidity();
        fileControl.setValidators([Validators.required]);

        this.fullTrackFormat = true;
      }
      if (this.track.advisorReviewRequired) {
        const advisorControl = this.submissionForm.get("advisor");
        advisorControl.setValidators([
          Validators.required,
          this.validateBrService.cpf,
        ]);
      }
      this.event = JSON.parse(e);
      this.submissionForm.setValidators([
        this.validateAbstractLimits(
          this.event.submissionMinWords,
          this.event.submissionMaxWords
        ),
        this.validateTitle(),
      ]);
      this.presentationTypes = [PresentationConstants.UNDEFINED_PRESENTATION];
      this.f.presentation.setValue(
        PresentationConstants.UNDEFINED_PRESENTATION
      );
      this.f.extensive.setValue(this.event.extensive);
      if (this.event.virtual && !this.editByAdvisor) {
        // tslint:disable-next-line:max-line-length
        this.virtualEventStatement =
          "Declaro, para todos os fins de direito, que estou ciente que durante as atividades do evento " +
          this.event.short_name +
          ", poderão ser captadas imagens e vozes da minha participação ou daqueles que represento como responsável legal. Autorizo a captação e utilização de tais imagens e vozes da minha pessoa ou daqueles que represento pela UNIVERSIDADE FEDERAL DO RECÔNCAVO DA BAHIA (UFRB) desde que tais dados sejam utilizados para fins acadêmicos ou de divulgação científica no contexto dos canais de comunicação, plataformas de disponibilização de vídeos e redes sociais da UFRB, nos termos da Lei nº 13.709/2018 (LGPD – Lei Geral de Proteção de Dados), conforme as finalidades previstas acima, nos termos do artigo 7º, inciso I, da referida norma.";
        const virtualEventStatementControl = this.submissionForm.get(
          "acceptVirtualEventStatement"
        );
        virtualEventStatementControl.setValidators([Validators.requiredTrue]);
      }
      if (this.track.submissionCategory) {
        const categoryControl = this.submissionForm.get("category");
        categoryControl.setValidators([Validators.required]);
      }
      this.fetchQuestions();
      this.fechDataLists();
    } else {
      const submissionId = this.route.snapshot.paramMap.get("id");
      this.isEdit = true;
      this.loading = true;
      this.submissionService
        .readById(submissionId)
        .pipe(
          catchError((error) => {
            this.loading = false;
            this.toastr.error(error, "Erro");
            return throwError(error);
          })
        )
        .subscribe((result) => {
          if (result.status === "success") {
            this.submission = result.data.submissions;
            if (this.submission.file) {
              const fileControl = this.submissionForm.get("submissionFile");
              fileControl.setValidators([Validators.required]);
              this.fullTrackFormat = true;

              const abstract = this.submissionForm.get("abstract");
              abstract.clearValidators();
              abstract.updateValueAndValidity();
              this.fileExists = true;
            }
            if (
              this.submission.additionalQuestionsAnswers &&
              this.submission.additionalQuestionsAnswers.length > 0
            ) {
              this.questions = this.submission.additionalQuestionsAnswers.map(
                (data) => data.question
              );
              const formattedAnswers =
                this.submission.additionalQuestionsAnswers.map((data) => ({
                  question_id: data.question._id,
                  [data.question._id]: data.answer,
                }));

              this.submissionForm.patchValue({
                questions: { questions: formattedAnswers },
              });
            }
            this.f.title.setValue(this.submission.title);
            this.f.abstract.setValue(this.submission.abstract.trim());
            this.f.submissionFile.setValue(this.submission.file);
            this.f.authors.setValue(this.submission.authors.toString());
            this.f.keywords.setValue(this.submission.keywords.toString());
            this.f.presentation.setValue(this.submission.presentation);
            //console.log(this.submission.knowledge_area);
            //this.f.knowledge_area.setValue(this.submission.knowledge_area);
            this.f.center.setValue(this.submission.center);
            this.fechDataLists();
            this.f.institution.setValue(this.submission.institution);
            this.f.supporting_source.setValue(
              this.submission.supporting_source
            );
            this.f.supporting_institution_message.setValue(
              this.submission.supporting_institution_message
            );
            this.f.advisor.setValue(this.submission.advisor);
            this.f.additionalQuestionAnswer.setValue(
              this.submission.additionalQuestionAnswer
            );
            this.f.extensive.setValue(true);
            this.f.category.setValue(this.submission.category);
            this.wordCounter();
            this.eventService
              .readById(result.data.submissions.event)
              .pipe(
                catchError((error) => {
                  this.loading = false;
                  this.toastr.error(error, "Erro");
                  return throwError(error);
                })
              )
              .subscribe((eventResult) => {
                if (eventResult.status === "success") {
                  this.event = eventResult.data;
                  this.trackService
                    .readById(result.data.submissions.event_track)
                    .pipe(
                      catchError((error) => {
                        this.loading = false;
                        this.toastr.error(error, "Erro");
                        return throwError(error);
                      })
                    )
                    .subscribe((eventTrack) => {
                      this.loading = false;
                      if (eventTrack.status === "success") {
                        this.track = eventTrack.data;
                      } else {
                        this.toastr.error(result.message, "Erro");
                      }
                    });
                } else {
                  this.toastr.error(result.message, "Erro");
                }
              });
          } else {
            this.toastr.error(result.message, "Erro");
          }
        });
    }

    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((routeData: any) => {
        if (
          routeData.urlAfterRedirects.startsWith(
            "/home/(content:submission-save"
          )
        ) {
          this.fechDataLists();
        }
      });
    this.editorConfig = new Editor({
      history: true,
    });

    this.dropdownSettings = {
      singleSelection: true,
      allowSearchFilter: true,
      idField: "item_id",
      textField: "item_text",
      closeDropDownOnSelection: true,
    };
    //
  }

  fechDataLists() {
    this.areas = [];
    this.areaService
      .readAll()
      .pipe(
        catchError((error) => {
          this.loading = false;
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((result) => {
        let tmp = [];
        this.loading = false;
        if (result.status === "success") {
          this.areas = result.data;
          //modificado para que as áreas de conhecimento possam ser exibidas no novo componente de seleção adicionado
          for (let i = 0; i < this.areas.length; i++) {
            tmp.push({
              item_id: i,
              item_text: this.areas[i].area + " - " + this.areas[i].sub_area,
            });
          }
          this.dropdownList = tmp;

          if (this.submission) {
            const selectedItem = this.returnSelectedItems();
            this.selectedItems?.push(selectedItem);
            this.f.knowledge_area.setValue([selectedItem]);
          }
        } else {
          this.toastr.error(result.message, "Erro");
        }
      });

    this.userExceptionService
      .readByType("fapesb_oral_presentations")
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
          const index = _.findIndex(result.data, [
            "cpf",
            this.authenticationService.currentUserValue.cpf,
          ]);
          if (index > 0) {
            this.presentationTypes = [PresentationConstants.ORAL_PRESENTATION];
            this.f.presentation.setValue(
              PresentationConstants.ORAL_PRESENTATION
            );
          }
        } else {
          this.toastr.error(result.message, "Erro");
        }
      });
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

  fetchQuestions() {
    this.trackService
      .readById(this.track._id)
      .pipe(
        catchError((error) => {
          this.toastr.error(error, "Erro");
          return throwError(error);
        })
      )
      .subscribe((response) => {
        this.loading = false;
        if (response.status === "success") {
          const track = response.data;
          if (track.questionsSubmission.length > 0) {
            this.questions = track.questionsSubmission;
            this.submissionForm.patchValue({ questions: this.questions }); // Ensure form is updated
          }
        } else {
          this.toastr.error(response.message, "Erro");
        }
      });
  }

  //função para retornar itens selecionados mantendo a consistência na interação com o usuário
  returnSelectedItems() {
    for (let i = 0; i < this.dropdownList.length; i++) {
      if (
        this.dropdownList[i].item_text.includes(this.submission.knowledge_area)
      ) {
        return this.dropdownList[i];
      }
    }
  }

  validateAbstractLimits(minWords, maxWords): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const abstractField = c.get("abstract");
      const words = !this.fullTrackFormat
        ? SubmissionSaveComponent.countWords(abstractField.value)
        : minWords;
      if (words < minWords) {
        abstractField.setErrors({ wordsMinRequired: true });
      } else if (words > maxWords) {
        abstractField.setErrors({ wordsMaxExceeded: true });
      } else {
        CustomValidators.removeErrors(["wordsMinRequired"], abstractField);
        CustomValidators.removeErrors(["wordsMaxExceeded"], abstractField);
      }
      return null;
    };
  }

  validateTitle(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const titleField = c.get("title");
      const submissionsTitles = this.submissions.map(
        (submission) => submission.title
      );
      if (submissionsTitles.includes(titleField.value)) {
        titleField.setErrors({ registeredTitle: true });
      } else {
        CustomValidators.removeErrors(["registeredTitle"], titleField);
      }
      return null;
    };
  }

  validateContainsPoint(c: AbstractControl) {
    const value = c.value;
    if (value && value.includes(".")) {
      c.setErrors({ containsPoint: true });
      return { containsPoint: true };
    }
    return null;
  }

  validateAtLeastOneName(c: AbstractControl) {
    CustomValidators.validateFieldNamesLargerThanOne("authors", c);
    CustomValidators.validateFieldNamesLargerThanOne("keywords", c);
  }

  onSubmissionFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      let badFileSize = false;
      this.badFormat = false;

      if (file.size > 10002597) {
        this.toastr.error(
          `O tamanho do arquivo da submissão deve ser menor que 10MB.`
        );
        this.submissionForm.controls.submissionFile.setErrors({
          required: true,
        });
        document.getElementById("submissionFile").classList.add("is-invalid");
        this.badFormat = true;
        badFileSize = true;
      }
      reader.readAsDataURL(file);
      // reader.readAsBinaryString(file)

      // reader.result.replaceAll("","")
      reader.onload = () => {
        // const dataFile = String(reader.result).replace('data:application/octet-stream;base64,', '');

        const dataFile = String(reader.result);
        const fileData = dataFile.split(";base64,");
        if (
          !fileData[0] ||
          (!(fileData[0] == "data:application/pdf") && !badFileSize)
        ) {
          this.toastr.error(
            `O formato do arquivo informado é inválido. Só são aceitos arquivos em formato PDF para submissão.`
          );
          this.submissionForm.controls.submissionFile.setErrors({
            required: true,
          });
          document.getElementById("submissionFile").classList.add("is-invalid");
          this.badFormat = true;
        } else if (!this.badFormat && !badFileSize) {
          document
            .getElementById("submissionFile")
            .classList.remove("is-invalid");
          this.submissionForm.patchValue({
            submissionFile: dataFile,
          });
          this.cd.markForCheck();
        }
      };
    }
  }

  changeSubmissionFile() {
    this.fileExists = false;
    this.f.submissionFile.setValue(null);
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

  // convenience getter for easy access to form fields
  get f() {
    return this.submissionForm.controls;
  }
  /**
   * Função que realiza o submit para o form de submissões dentro do sistema, alterada por andersoney
   *  Rodrigues para permitir usar o trim(), pois o mesmo não estava funcionando.
   *  alterada por Dinho Stork para permitir o envio de submissões com arquivos
   * @author Tassio Vale
   * @author Andersoney
   * @author Dinho Stork
   */
  onSubmit() {
    this.submitted = true;

    if (this.submissionForm.invalid || this.questionsForm?.isInvalid()) {
      this.submissionForm.controls.submissionFile.setErrors(null);
      if (
        (this.fullTrackFormat && !this.f.submissionFile.value) ||
        this.badFormat
      ) {
        this.submissionForm.controls.submissionFile.setErrors({
          required: true,
        });
      }
      if (this.f.abstract.errors) {
        if (this.f.abstract.errors.required) {
          this.toastr.error(
            "Necessário informar o resumo do trabalho",
            "Erro!"
          );
        } else if (this.f.abstract.errors.wordsMinRequired) {
          this.toastr.error(
            `O resumo deve conter um mínimo de ${this.event.submissionMinWords} palavras`,
            "Erro!"
          );
        } else {
          this.toastr.error(
            `O resumo deve conter um máximo de ${this.event.submissionMaxWords} palavras`,
            "Erro!"
          );
        }
      }
      if (this.f.title.errors) {
        if (this.f.title.errors.registeredTitle) {
          this.toastr.error(
            `Você já submeteu este trabalho. Caso queira realizar alguma modificação, remova a sumissão já realizada e realize uma nova submissão.`,
            "Erro!"
          );
        }
      }
      return;
    }

    const questionsComponent = this.submissionForm.get("questions");
    const questionAnswers = this.formattedAddictionQuestionAnswer(
      questionsComponent?.value?.questions || []
    );

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    if (this.editByAdvisor && this.track?.advisor_review_end_date) {
      if (dateNow > new Date(this.track.advisor_review_end_date)) {
        this.toastr.error(
          "O prazo para atualização da submissão não é mais válido",
          "Erro"
        );
        return;
      }
    }

    this.loading = true;
    const autores = this.f.authors.value.split(",");
    for (let index = 0; index < autores.length; index++) {
      autores[index] = autores[index].trim();
    }
    // tslint:disable-next-line:variable-name
    const palavras_chaves = this.f.keywords.value.split(",");
    for (let index = 0; index < palavras_chaves.length; index++) {
      palavras_chaves[index] = palavras_chaves[index].trim();
    }
    const submission = {
      title: this.f.title.value,
      abstract: this.f.abstract.value,
      authors: autores,
      keywords: palavras_chaves,
      presentation: this.f.presentation.value,
      //Modificação necessária para retornar um valor consistente com o formato pré-existente no banco de dados
      knowledge_area: this.f.knowledge_area.value[0].item_text.split(" - ")[1],
      institution: this.f.institution.value,
      file: this.f.submissionFile.value,
      supporting_source: this.f.supporting_source.value,
      supporting_institution_message:
        this.f.supporting_institution_message.value,
      owner: this.authenticationService.currentUserValue._id,
      event_track: this.track ? this.track._id : this.submission.event_track,
      event_track_name: this.track
        ? this.track.name
        : this.submission.event_track_name,
      event: this.track ? this.track.event : this.submission.event,
      event_short_name: this.track
        ? this.track.event_short_name
        : this.submission.event_short_name,
      advisor: this.f.advisor.value.replace(/\D/g, ""),
      advisorEmail: this.f.advisorEmail.value,
      additionalQuestionAnswer: this.f.additionalQuestionAnswer.value,
      category: this.f.category.value || null,
      center: this.f.center.value,
      additionalQuestionsAnswers: questionAnswers,
    };
    if (this.isEdit) {
      submission["_id"] = this.submission._id;
      submission["approved"] = this.submission.approved;
      submission["approval_date"] = this.submission.approval_date;
      submission["owner"] = this.submission.owner;
      submission["created_at"] = this.submission.created_at;
      submission["center"] = this.submission.center;
      if (this.editByAdvisor || this.isAdmin) {
        submission["status"] = SUBMISSION_LIFE_CYCLE.PENDING_REVIEWER_APPROVAL;
        submission["advisorState"] = "advisor_feedback_approved";
      } else {
        submission["status"] = SUBMISSION_LIFE_CYCLE.PENDING_ADVISOR_REVIEW;
      }

      this.submissionService
        .update(submission)
        .pipe(
          catchError((error) => {
            this.toastr.error(error, "Erro");
            this.loading = false;
            return throwError(error);
          })
        )
        .subscribe((data) => {
          this.loading = false;
          if (data.status === "success") {
            if (this.editByAdvisor) {
              this.router
                .navigate(["/home", { outlets: { content: ["advisor"] } }])
                .then(() => {
                  const message = this.track.advisorReviewRequired
                    ? `Submissão atualizada com sucesso! Agora o resumo será avaliado pelos revisores do evento.`
                    : "Submissão atualizada com sucesso.";
                  this.toastr.success(message, "Sucesso");
                });
            } else {
              if (this.comment) {
                this.addSubmissionComment();
              }
              this.router
                .navigate(["/home", { outlets: { content: ["submissions"] } }])
                .then(() => {
                  const message = this.track.advisorReviewRequired
                    ? `Submissão atualizada com sucesso.
                    Enviamos um e-mail ao seu orientador com instruções
                    para que ele possa revisar a sua submissão e dar
                    continuidade ao processo.`
                    : "Submissão atualizada com sucesso.";
                  this.toastr.success(message, "Sucesso");
                });
            }
          } else if (
            data.status === "advisor_not_found" &&
            !this.editByAdvisor
          ) {
            this.requestEmail = true;
            this.f.advisorEmail.setValidators(Validators.required);
            this.toastr.warning(data.message, "Aviso");
          } else if (
            data.status === "advisor_not_found" &&
            this.editByAdvisor
          ) {
            this.requestAdvisorCpf = true;
            const advisorControl = this.submissionForm.get("advisor");
            advisorControl.setValidators([
              Validators.required,
              this.validateBrService.cpf,
            ]);
            this.toastr.warning(data.message, "Aviso");
          }
          this.loading = false;
        });
    } else {
      this.submissionService
        .save(submission)
        .pipe(
          catchError((error) => {
            this.toastr.error(error, "Erro");
            this.loading = false;
            return throwError(error);
          })
        )
        .subscribe((data) => {
          if (data.status === "success") {
            this.router
              .navigate(["/home", { outlets: { content: ["submissions"] } }])
              .then(() => {
                const message = this.track.advisorReviewRequired
                  ? `Submissão realizada com sucesso.
                  Enviamos um e-mail ao seu orientador com instruções
                  para que ele possa revisar a sua submissão e dar
                  continuidade ao processo..`
                  : "Submissão realizada com sucesso.";
                this.toastr.success(message, "Sucesso");
              });
          } else if (data.status === "advisor_not_found") {
            this.requestEmail = true;
            this.f.advisorEmail.setValidators(Validators.required);
            this.toastr.warning(data.message, "Aviso");
          } else if (data.status === "error") {
            this.toastr.error(data.message, "Erro");
          }
          this.loading = false;
        });
    }
  }

  addSubmissionComment() {
    let content = {
      author: this.authenticationService.currentUserValue.name,
      message: this.comment,
      date: Date.now(),
    };
    if (this.comment) {
      this.submissionService
        .addSubmissionComment(this.submission._id, content)
        .pipe(
          catchError((error) => {
            this.loading = false;
            this.toastr.error(error, "Erro");
            return throwError(error);
          })
        )
        .subscribe((result) => {
          if (
            this.submission.advisor ===
            this.authenticationService.currentUserValue.cpf
          ) {
            this.requestCorrection();
          }
        });
    } else {
      this.toastr.warning(
        "É necessário pelo menos um comentário para solicitar correção."
      );
    }
  }

  requestCorrection() {
    this.submissionService
      .correctionRequestByAdvisor(
        this.submission._id,
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
        this.router
          .navigate(["/home", { outlets: { content: ["advisor"] } }])
          .then(() => {
            this.toastr.success(result.message, "Sucesso");
          });
      });
  }

  allowOnlyNumbers(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode);
    const pattern = "[0-9]";
    if (!char.match(pattern)) {
      e.preventDefault();
    }
  }

  wordCounter() {
    this.words = SubmissionSaveComponent.countWords(this.f.abstract.value);
  }

  // tslint:disable-next-line:member-ordering
  static countWords(text) {
    return text ? text.replace(/<\/?[^>]+(>|$)/g, "").split(" ").length : 0;
    // old
    // return text
    //   ? text
    //       .replace(/[^a-zA-Z ]/g, "")
    //       .trimLeft()
    //       .trimRight()
    //       .split(" ").length
    //   : 0;
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
