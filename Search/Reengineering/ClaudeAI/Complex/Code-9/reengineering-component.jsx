<div className={styles.pageWrapper}>
  <div className={styles.pageBreadcrumb}>
    <div className={styles.row}>
      <div className={`${styles.col12} ${styles.dFlex} ${styles.alignItemsCenter}`}>
        <h4 className={styles.pageTitle}>Revisar trabalho</h4>
      </div>
    </div>
  </div>
  {!loading ? (
    <div className={styles.containerFluid}>
      <div className={styles.card}>
        <form
          onSubmit={onSubmit}
          className={styles.formHorizontal}
        >
          <div className={styles.cardBody}>
            <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
              <label
                htmlFor="title"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Título:
              </label>
              <div id="title" className={styles.colSm9}>
                {submissionReview.submission.title}
              </div>
            </div>
            
            <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
              <label
                htmlFor="keywords"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Palavras-chave:
              </label>
              <div id="keywords" className={styles.colSm9}>
                {submissionReview.submission.keywords}
              </div>
            </div>
            
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="abstract"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Resumo:
              </label>
              <div 
                id="abstract" 
                className={styles.colSm8} 
                style={{ textAlign: 'justify' }}
              >
                <div 
                  dangerouslySetInnerHTML={{
                    __html: submissionReview.submission.abstract
                  }}
                />
              </div>
            </div>

            {submissionReview.submission.file && (
              <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
                <label
                  htmlFor="file"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  Arquivo da Submissão:
                </label>
                <div id="file" className={styles.colSm3}>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => downloadSubmissionFile(submissionReview.submission)}
                  >
                    Download
                  </button>
                </div>
              </div>
            )}

            <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
              <label
                htmlFor="event"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Evento:
              </label>
              <div id="event" className={styles.colSm9}>
                {submissionReview.submission.event_short_name}
              </div>
            </div>
            
            <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
              <label
                htmlFor="track"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Trilha:
              </label>
              <div id="track" className={styles.colSm9}>
                {submissionReview.submission.event_track_name}
              </div>
            </div>
            
            <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
              <label
                htmlFor="area"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Área de Conhecimento:
              </label>
              <div id="area" className={styles.colSm9}>
                {submissionReview.submission.knowledge_area}
              </div>
            </div>
            
            {submissionReview.submission?.additionalQuestionsAnswers?.length > 0 &&
              submissionReview.submission.additionalQuestionsAnswers.map((questionAnswer, index) => (
                <div key={index} className={styles.formGroup}>
                  <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
                    <label
                      className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                    >
                      {questionAnswer.question.title}
                    </label>
                    <div className={styles.colSm9}>
                      {questionAnswer.answer}
                    </div>
                  </div>
                </div>
              ))}
            
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="feedback"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Parecer:
              </label>
              <div id="result" className={`${styles.colSm9} ${styles.container}`}>
                <textarea
                  id="feedback"
                  placeholder="Informe seu parecer"
                  name="feedback"
                  value={formValues.feedback}
                  onChange={handleChange}
                  className={`md-textarea md-textarea-auto form-control ${
                    submitted && errors.feedback ? styles.isInvalid : ''
                  }`}
                />
                {submitted && errors.feedback && (
                  <div className={styles.invalidFeedback}>
                    {errors.feedback.required && (
                      <div>Informe o parecer da submissão</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {track.additionalQuestionReviewer && (
              <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
                <label
                  htmlFor="answerForQuestionTrack"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  {track.additionalQuestionReviewer}
                </label>
                <div id="approved" className={styles.colSm9}>
                  <div className={`${styles.row} ${styles.justifyContentStart} ${styles.alignItemsCenter}`}>
                    <div className={styles.hPadding}>Não</div>
                    <label className={`${styles.switch} ${styles.tpMargin}`}>
                      <input
                        type="checkbox"
                        id="answerForQuestionTrack"
                        name="answerForQuestionTrack"
                        checked={formValues.answerForQuestionTrack}
                        onChange={handleChange}
                        className={submitted && errors.answerForQuestionTrack ? styles.isInvalid : ''}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <div className={styles.hPadding}>Sim</div>
                  </div>
                </div>
              </div>
            )}

            {track.secondAdditionalQuestionReviewer && (
              <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
                <label
                  htmlFor="answerForSecondQuestionTrack"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  {track.secondAdditionalQuestionReviewer}
                </label>
                <div id="approved" className={styles.colSm9}>
                  <div className={`${styles.row} ${styles.justifyContentStart} ${styles.alignItemsCenter}`}>
                    <div className={styles.hPadding}>Não</div>
                    <label className={`${styles.switch} ${styles.tpMargin}`}>
                      <input
                        type="checkbox"
                        id="answerForSecondQuestionTrack"
                        name="answerForSecondQuestionTrack"
                        checked={formValues.answerForSecondQuestionTrack}
                        onChange={handleChange}
                        className={submitted && errors.answerForSecondQuestionTrack ? styles.isInvalid : ''}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <div className={styles.hPadding}>Sim</div>
                  </div>
                </div>
              </div>
            )}

            {questions && questions.length > 0 && (
              <QuestionMain
                questions={questions}
                submitted={submitted}
                value={formValues.questions}
                onChange={(value) => setFormValues(prev => ({ ...prev, questions: value }))}
              />
            )}

            <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
              <label
                htmlFor="status_approved"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Resultado:
              </label>
              <div id="approved" className={styles.colSm9}>
                <div className={`${styles.row} ${styles.justifyContentStart} ${styles.alignItemsCenter}`}>
                  <div className={styles.hPadding}>Reprovado</div>
                  <label className={`${styles.switch} ${styles.tpMargin}`}>
                    <input
                      type="checkbox"
                      id="status_approved"
                      name="status"
                      checked={formValues.status}
                      onChange={handleChange}
                      className={submitted && errors.status ? styles.isInvalid : ''}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <div className={styles.hPadding}>Aprovado</div>
                </div>
                {submitted && errors.status && (
                  <div className={styles.invalidFeedback}>
                    {errors.status.required && (
                      <div>Informe o status da submissão</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.borderTop}>
              <div className={styles.cardBody}>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="btn btn-primary"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={cancelReview}
                  className="btn btn-danger"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <span className={styles.spinnerWrapper}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
    </span>
  )}
</div>