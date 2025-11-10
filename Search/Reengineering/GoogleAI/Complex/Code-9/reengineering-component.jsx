return (
  <div className="page-wrapper">
    <div className="page-breadcrumb">
      <div className="row">
        <div className="col-12 d-flex no-block align-items-center">
          <h4 className="page-title">Revisar trabalho</h4>
        </div>
      </div>
    </div>
    {loading ? (
      <div className={styles.loadingContainer}>
        <CircularProgress color="primary" size={40} />
      </div>
    ) : (
      <div className="container-fluid">
        <div className="card">
          <form onSubmit={handleSubmit} className="form-horizontal">
            <div className="card-body">
              {/* Submission Details */}
              <div className="form-group row align-items-center">
                <label
                  htmlFor="title"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Título:
                </label>
                <div id="title" className="col-sm-9">
                  {submissionReview.submission.title}
                </div>
              </div>
              <div className="form-group row align-items-center">
                <label
                  htmlFor="keywords"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Palavras-chave:
                </label>
                <div id="keywords" className="col-sm-9">
                  {submissionReview.submission.keywords}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="abstract"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Resumo:
                </label>
                <div
                  id="abstract"
                  className="col-sm-8"
                  style={{ textAlign: 'justify' }}
                  dangerouslySetInnerHTML={{
                    __html: submissionReview.submission.abstract,
                  }}
                ></div>
              </div>
              {submissionReview.submission.file && (
                <div className="form-group row align-items-center">
                  <label
                    htmlFor="file"
                    className="col-sm-3 text-right control-label col-form-label"
                  >
                    Arquivo da Submissão:
                  </label>
                  <div id="file" className="col-sm-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() =>
                        downloadSubmissionFile(submissionReview.submission)
                      }
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}
              <div className="form-group row align-items-center">
                <label
                  htmlFor="event"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Evento:
                </label>
                <div id="event" className="col-sm-9">
                  {submissionReview.submission.event_short_name}
                </div>
              </div>
              <div className="form-group row align-items-center">
                <label
                  htmlFor="track"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Trilha:
                </label>
                <div id="track" className="col-sm-9">
                  {submissionReview.submission.event_track_name}
                </div>
              </div>
              <div className="form-group row align-items-center">
                <label
                  htmlFor="area"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Área de Conhecimento:
                </label>
                <div id="area" className="col-sm-9">
                  {submissionReview.submission.knowledge_area}
                </div>
              </div>

              {/* Additional Questions Answers */}
              {submissionReview.submission?.additionalQuestionsAnswers?.map(
                (qa, index) => (
                  <div
                    key={index}
                    className="form-group row align-items-center"
                  >
                    <label className="col-sm-3 text-right control-label col-form-label">
                      {qa.question.title}
                    </label>
                    <div className="col-sm-9">{qa.answer}</div>
                  </div>
                )
              )}

              {/* Feedback Textarea */}
              <div className="form-group row">
                <label
                  htmlFor="feedback"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Parecer:
                </label>
                <div className="col-sm-9">
                  <textarea
                    id="feedback"
                    placeholder="Informe seu parecer"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    className={`form-control ${
                      submitted && errors.feedback ? 'is-invalid' : ''
                    }`}
                  ></textarea>
                  {submitted && errors.feedback && (
                    <div className="invalid-feedback">
                      {errors.feedback.type === 'required' &&
                        'Informe o parecer da submissão'}
                    </div>
                  )}
                </div>
              </div>

              {/* Track Specific Questions (Switches) */}
              {track.additionalQuestionReviewer && (
                <div className="form-group row align-items-center">
                  <label className="col-sm-3 text-right control-label col-form-label">
                    {track.additionalQuestionReviewer}
                  </label>
                  <div className="col-sm-9">
                    <div className={styles.switchContainer}>
                      <span>Não</span>
                      <Switch
                        name="answerForQuestionTrack"
                        checked={formData.answerForQuestionTrack}
                        onChange={handleChange}
                      />
                      <span>Sim</span>
                    </div>
                  </div>
                </div>
              )}
              {track.secondAdditionalQuestionReviewer && (
                <div className="form-group row align-items-center">
                  <label className="col-sm-3 text-right control-label col-form-label">
                    {track.secondAdditionalQuestionReviewer}
                  </label>
                  <div className="col-sm-9">
                    <div className={styles.switchContainer}>
                      <span>Não</span>
                      <Switch
                        name="answerForSecondQuestionTrack"
                        checked={formData.answerForSecondQuestionTrack}
                        onChange={handleChange}
                      />
                      <span>Sim</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Component */}
              {questions && questions.length > 0 && (
                <QuestionMain
                  questions={questions}
                  submitted={submitted}
                  onFormChange={handleQuestionsChange} // Pass a callback to get data
                />
              )}

              {/* Final Result Switch */}
              <div className="form-group row align-items-center">
                <label className="col-sm-3 text-right control-label col-form-label">
                  Resultado:
                </label>
                <div className="col-sm-9">
                  <div className={styles.switchContainer}>
                    <span>Reprovado</span>
                    <Switch
                      name="status"
                      checked={formData.status}
                      onChange={handleChange}
                      color="primary"
                    />
                    <span>Aprovado</span>
                  </div>
                  {submitted && errors.status && (
                    <div className="invalid-feedback d-block">
                      {errors.status.type === 'required' &&
                        'Informe o status da submissão'}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-top">
                <div className="card-body">
                  <button type="submit" className="btn btn-primary">
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={cancelReview}
                    className="btn btn-danger ml-2"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
