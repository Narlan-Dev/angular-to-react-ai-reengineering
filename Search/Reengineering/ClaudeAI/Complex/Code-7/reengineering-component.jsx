<div className={styles.pageWrapper}>
  <div className={styles.pageBreadcrumb}>
    <div className={styles.row}>
      <div className={`${styles.col12} ${styles.dFlex} ${styles.alignItemsCenter}`}>
        <h4 className={styles.pageTitle}>Submissões</h4>
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
            <h4 className={styles.cardTitle}>
              Submeter trabalho para a trilha {track ? track.name : ""}
            </h4>
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="title"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Título
              </label>
              <div className={styles.colSm9}>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.title ? styles.isInvalid : ''}`}
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  placeholder="Título do seu trabalho"
                />
                {submitted && errors.title && (
                  <div className={styles.invalidFeedback}>
                    {errors.title.required && (
                      <div>Necessário informar o título do trabalho</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {!fullTrackFormat && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label
                  htmlFor="abstract"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  Resumo
                </label>
                <div className={styles.colSm9}>
                  <div className={styles.editorMenu}>
                    {/* Implement your editor menu here */}
                  </div>
                  <div className={styles.editor} style={{ height: '400px' }}>
                    <textarea
                      name="abstract"
                      value={formValues.abstract}
                      onChange={(e) => {
                        handleChange(e);
                        wordCounter();
                      }}
                      className="form-control"
                      rows={10}
                    />
                  </div>
                  <div className={styles.col12}>
                    <span className={styles.floatRight}>
                      Total: {words} {words > 1 ? "palavras" : "palavra"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {fullTrackFormat && !fileExists && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label
                  htmlFor="submissionFile"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  Arquivo da submissão
                </label>
                <div className={styles.colSm9}>
                  <input
                    type="file"
                    className={`form-control ${submitted && errors.submissionFile ? styles.isInvalid : ''}`}
                    id="submissionFile"
                    name="submissionFile"
                    onChange={onSubmissionFileChange}
                    accept="application/pdf"
                  />
                  {submitted && errors.submissionFile && (
                    <div className={styles.invalidFeedback}>
                      <div>Necessário anexar o arquivo (PDF) da submissão.</div>
                    </div>
                  )}
                  {track?.submissionInstructionsLink && track?.format === 'full' && (
                    <a
                      href={track.submissionInstructionsLink}
                      target="_blank"
                      className={styles.mt3}
                    >
                      Instruções para submissão
                    </a>
                  )}
                </div>
              </div>
            )}

            {fileExists && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label
                  className={`${styles.colSm3} ${styles.textRight} ${styles.alignMiddle} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  Arquivo da submissão
                </label>
                <div className={`${styles.colSm9} ${styles.row}`}>
                  <div className={styles.colSm3}>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => downloadSubmissionFile(submission)}
                    >
                      Download
                    </button>
                  </div>
                  <div className={styles.colSm3}>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={changeSubmissionFile}
                    >
                      Substituir arquivo da submissão
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="keywords"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Palavras-chave
              </label>
              <div className={styles.colSm9}>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.keywords ? styles.isInvalid : ''}`}
                  id="keywords"
                  name="keywords"
                  value={formValues.keywords}
                  onChange={handleChange}
                  placeholder="Palavras-chave separadas por vírgula ( , )"
                />
                {submitted && errors.keywords && (
                  <div className={styles.invalidFeedback}>
                    {errors.keywords.required && (
                      <div>Informe pelo menos uma palavra-chave</div>
                    )}
                    {errors.keywords.lessThanOne && (
                      <div>Informe pelo menos uma palavra-chave</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="authors"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Autores
              </label>
              <div className={styles.colSm9}>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.authors ? styles.isInvalid : ''}`}
                  id="authors"
                  name="authors"
                  value={formValues.authors}
                  onChange={handleChange}
                  placeholder="Autores separados por vírgula ( , )"
                />
                {submitted && errors.authors && (
                  <div className={styles.invalidFeedback}>
                    {errors.authors.required && (
                      <div>Informe pelo menos um autor</div>
                    )}
                    {errors.authors.lessThanOne && (
                      <div>Informe pelo menos um autor</div>
                    )}
                    {errors.authors.containsPoint && (
                      <div>Não são permitidas abreviações nos nomes dos autores</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.row}`}>
              <label className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>
              </label>
              <div className={styles.colSm9}>
                <div className={`${styles.customControl} ${styles.customCheckbox}`}>
                  <input
                    type="checkbox"
                    className={`${styles.customControlInput} ${submitted && errors.extensive ? styles.isInvalid : ''}`}
                    id="extensive_yes"
                    name="extensive"
                    checked={formValues.extensive}
                    onChange={handleChange}
                  />
                  <label className={styles.customControlLabel} htmlFor="extensive_yes">
                    Afirmo que os nomes de todos os autores acima citados estão
                    escritos por extenso e não possuem abreviações
                  </label>
                  {submitted && errors.extensive && (
                    <div className={styles.invalidFeedback}>
                      {errors.extensive.required && (
                        <div>
                          Você deve confirmar que os nomes de todos os autores estão
                          escritos por extenso
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="knowledge_area"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Área
              </label>
              <div className={styles.colSm9}>
                <select
                  className={`form-control ${submitted && errors.knowledge_area ? styles.isInvalid : ''}`}
                  name="knowledge_area"
                  value={formValues.knowledge_area}
                  onChange={handleChange}
                  multiple
                >
                  <option value="">Selecione a área de conhecimento</option>
                  {dropdownList.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {submitted && errors.knowledge_area && (
                  <div className={styles.invalidFeedback}>
                    {errors.knowledge_area.required && (
                      <div>Informe a área de conhecimento</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {track && track.submissionCategory && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label
                  htmlFor="category"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  {track.submissionCategory}
                </label>
                <div className={styles.colSm9}>
                  <select
                    className={`select2 form-control select2-hidden-accessible font-big ${submitted && errors.category ? styles.isInvalid : ''}`}
                    style={{ width: '100%', height: 36 }}
                    name="category"
                    value={formValues.category}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    {track.submissionCategoryValues.map((categoryValue, index) => (
                      <option key={index} value={categoryValue}>
                        {categoryValue}
                      </option>
                    ))}
                  </select>
                  {submitted && errors.category && (
                    <div className={styles.invalidFeedback}>
                      {errors.category.required && (
                        <div>{track.submissionCategory} é uma informação obrigatória</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {track &&
              track.advisorReviewRequired &&
              (!editByAdvisor || requestAdvisorCpf) && (
                <div className={`${styles.formGroup} ${styles.row}`}>
                  <label
                    htmlFor="advisor"
                    className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                  >
                    CPF do orientador
                  </label>
                  <div className={styles.colSm9}>
                    <input
                      type="text"
                      maxLength={11}
                      className={`form-control ${submitted && errors.advisor ? styles.isInvalid : ''}`}
                      placeholder="CPF do orientador (apenas números)"
                      id="advisor"
                      name="advisor"
                      value={formValues.advisor}
                      onChange={handleChange}
                      onKeyPress={allowOnlyNumbers}
                    />
                    {submitted && errors.advisor && (
                      <div className={styles.invalidFeedback}>
                        {errors.advisor.required && (
                          <div>Necessário informar o CPF do orientador</div>
                        )}
                        {errors.advisor.cpfvalidator && (
                          <div>CPF inválido</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            {requestEmail && !editByAdvisor && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label
                  htmlFor="advisorEmail"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  E-mail do orientador
                </label>
                <div className={styles.colSm9}>
                  <input
                    type="text"
                    className={`form-control ${submitted && errors.advisorEmail ? styles.isInvalid : ''}`}
                    placeholder="Email do orientador"
                    id="advisorEmail"
                    name="advisorEmail"
                    value={formValues.advisorEmail}
                    onChange={handleChange}
                  />
                  {submitted && errors.advisorEmail && (
                    <div className={styles.invalidFeedback}>
                      {errors.advisorEmail.required && (
                        <div>Necessário informar o e-mail do orientador</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="institution"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Instituição
              </label>
              <div className={styles.colSm9}>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.institution ? styles.isInvalid : ''}`}
                  placeholder="Instituição a qual está vinculado"
                  id="institution"
                  name="institution"
                  value={formValues.institution}
                  onChange={handleChange}
                />
                {submitted && errors.institution && (
                  <div className={styles.invalidFeedback}>
                    {errors.institution.required && (
                      <div>Necessário informar instituição a qual você está vinculado</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="center"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Centro de ensino
              </label>
              <div className={styles.colSm9}>
                <select
                  className="select2 form-control select2-hidden-accessible font-big"
                  style={{ width: '100%', height: 36 }}
                  name="center"
                  value={formValues.center}
                  onChange={handleChange}
                >
                  <option value="">Não se aplica</option>
                  {centers.map((ce, index) => (
                    <option key={index} value={ce}>
                      {ce}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {track && track.additionalQuestionAuthor && !editByAdvisor && (
              <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
                <label
                  htmlFor="additionalQuestionAnswer"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  {track.additionalQuestionAuthor}
                </label>
                <div id="approved" className={styles.colSm9}>
                  <div className={`${styles.row} ${styles.justifyContentStart} ${styles.alignItemsCenter}`}>
                    <div className={styles.hPadding}>Não</div>
                    <label className={`${styles.switch} ${styles.tpMargin}`}>
                      <input
                        type="checkbox"
                        id="additionalQuestionAnswer"
                        name="additionalQuestionAnswer"
                        checked={formValues.additionalQuestionAnswer}
                        onChange={handleChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <div className={styles.hPadding}>Sim</div>
                  </div>
                </div>
              </div>
            )}

            <div className={`${styles.formGroup} ${styles.row}`}>
              <label
                htmlFor="supporting_source"
                className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
              >
                Fonte de financiamento
              </label>
              <div className={styles.colSm9}>
                <select
                  className={`select2 form-control select2-hidden-accessible font-big ${submitted && errors.supporting_source ? styles.isInvalid : ''}`}
                  style={{ width: '100%', height: 36 }}
                  name="supporting_source"
                  value={formValues.supporting_source}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  {supportingSources.map((source, index) => (
                    <option key={index} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                {submitted && errors.supporting_source && (
                  <div className={styles.invalidFeedback}>
                    {errors.supporting_source.required && (
                      <div>Informe a fonte de financiamento</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {event &&
              event.supporting_institution_message_instructions &&
              event.supporting_institution_message_instructions.length > 4 &&
              formValues.supporting_source &&
              formValues.supporting_source !== 'Não se aplica' && (
                <div className={`${styles.formGroup} ${styles.row}`}>
                  <label className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>
                  </label>
                  <div className={styles.colSm9}>
                    <label className={styles.colSm12}>
                      Instruções para preenchimento do texto no campo Apoio (abaixo):
                    </label>
                    <div
                      className={styles.colSm12}
                      dangerouslySetInnerHTML={{
                        __html: event.supporting_institution_message_instructions
                      }}
                    />
                  </div>
                </div>
              )}

            {formValues.supporting_source &&
              formValues.supporting_source !== 'Sem financiamento' && (
                <div className={`${styles.formGroup} ${styles.row}`}>
                  <label
                    htmlFor="supporting_institution_message"
                    className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                  >
                    Mensagem de apoio
                  </label>
                  <div className={styles.colSm9}>
                    <textarea
                      rows={3}
                      className="form-control"
                      id="supporting_institution_message"
                      placeholder="Mensagem de apoio exigida pelo órgão de fomento ou instituição financiadora"
                      name="supporting_institution_message"
                      value={formValues.supporting_institution_message}
                      onChange={handleChange}
                    />
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

            {event && event.virtual && !editByAdvisor && (
              <div
                className={`${styles.formGroup} ${styles.row}`}
                style={{ marginBottom: 0 }}
              >
                <div className={styles.colSm3}>
                  <input
                    type="checkbox"
                    id="acceptVirtualEventStatement"
                    name="acceptVirtualEventStatement"
                    checked={formValues.acceptVirtualEventStatement}
                    onChange={handleChange}
                    className={submitted && errors.acceptVirtualEventStatement ? styles.isInvalid : ''}
                    style={{ float: 'right', marginTop: 10 }}
                  />
                </div>
                <label className={styles.colSm9} htmlFor="acceptVirtualEventStatement">
                  {virtualEventStatement}
                </label>
              </div>
            )}

            {submitted && errors.acceptVirtualEventStatement && (
              <div className={`${styles.formGroup} ${styles.row} ${styles.justifyContentEnd}`}>
                {errors.acceptVirtualEventStatement.required && (
                  <span
                    style={{
                      fontSize: '80%',
                      color: '#da542e',
                      marginRight: '20px'
                    }}
                  >
                    Você deve concordar com a declaração acima para finalizar a submissão
                  </span>
                )}
              </div>
            )}

            <div className={`${styles.formGroup} ${styles.row} ${styles.textCenter}`} style={{ marginTop: 15 }}>
              <strong>
                ATENÇÃO: verifique atenciosamente as informações desta submissão e
                também os dados cadastrais da sua conta (especialmente o seu nome
                completo), pois serão utilizados na geração de certificado e
                outras finalidades.
              </strong>
            </div>

            {isEdit && track?.advisorReviewRequired && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label
                  htmlFor="comment"
                  className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}
                >
                  Novo comentário
                </label>
                <div className={styles.colSm9}>
                  <textarea
                    className="form-control"
                    id="comment"
                    placeholder="Insira aqui um comentário"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
            )}

            {isEdit && track?.advisorReviewRequired && (
              <div className={`${styles.row} ${styles.justifyContentEnd}`}>
                <div className={styles.colSm9}>
                  <h6>Comentários:</h6>
                  <div
                    className={`${styles.border} ${styles.rounded5} ${styles.mt2} ${styles.justifyContentCenter}`}
                    style={{
                      overflowY: 'auto',
                      height: 250,
                      borderRadius: '3px',
                      borderColor: '#e9ecef'
                    }}
                  >
                    {submission.submissionComments.map((c, index) => (
                      <div
                        key={index}
                        className={`${styles.card} ${styles.bgLight} ${styles.mb2}`}
                        style={{ margin: '7px' }}
                      >
                        <div className={styles.cardHeader}>
                          <strong className={styles.mr1}>{c.author} </strong> em {c.date}
                        </div>
                        <div className={styles.cardBody}>
                          <p className={styles.cardText}>{c.message}</p>
                        </div>
                      </div>
                    ))}
                    {!loading && submission.submissionComments?.length === 0 && (
                      <p className={`${styles.mt3} ${styles.ml3}`}>
                        Nenhum comentário cadastrado.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.borderTop}>
            <div className={styles.cardBody}>
              <button
                type="submit"
                className="btn btn-success"
                disabled={
                  !(submission?.advisorState !== 'advisor_feedback_approved') &&
                  editByAdvisor
                }
              >
                {editByAdvisor ? "Liberar para revisão do evento" : "Salvar"}
              </button>
              {submission?.advisorState !== 'advisor_feedback_approved' &&
                editByAdvisor && (
                  <a
                    onClick={addSubmissionComment}
                    className={`btn btn-danger text-white ${styles.ml2}`}
                  >
                    Solicitar correção pelo autor
                  </a>
                )}
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