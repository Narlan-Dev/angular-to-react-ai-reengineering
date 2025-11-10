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
        <form className={styles.formHorizontal} onSubmit={handleSubmit}>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>
              Submeter trabalho para a trilha {track ? track.name : ''}
            </h4>
            {/* Título */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label htmlFor="title" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Título</label>
              <div className={styles.colSm9}>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.title ? styles.isInvalid : ''}`}
                  id="title"
                  name="title"
                  placeholder="Título do seu trabalho"
                  value={formValues.title}
                  onChange={handleChange}
                />
                {submitted && errors.title && (
                  <div className={styles.invalidFeedback}>
                    {errors.title.required && <div>Necessário informar o título do trabalho</div>}
                  </div>
                )}
              </div>
            </div>
            {/* Resumo */}
            {!fullTrackFormat && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label htmlFor="abstract" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Resumo</label>
                <div className={styles.colSm9}>
                  {/* Substitua por um editor React, ex: <ReactQuill /> */}
                  <ReactQuill
                    value={formValues.abstract}
                    onChange={value => handleEditorChange('abstract', value)}
                    style={{ height: '400px' }}
                  />
                  <div className={styles.col12}>
                    <span className={styles.floatRight}>
                      Total: {words} {words > 1 ? 'palavras' : 'palavra'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Arquivo da submissão */}
            {fullTrackFormat && !fileExists && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label htmlFor="submissionFile" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Arquivo da submissão</label>
                <div className={styles.colSm9}>
                  <input
                    type="file"
                    className={`form-control ${submitted && errors.submissionFile ? styles.isInvalid : ''}`}
                    id="submissionFile"
                    name="submissionFile"
                    accept="application/pdf"
                    onChange={onSubmissionFileChange}
                  />
                  {submitted && errors.submissionFile && (
                    <div className={styles.invalidFeedback}>
                      <div>Necessário anexar o arquivo (PDF) da submissão.</div>
                    </div>
                  )}
                  {track?.submissionInstructionsLink && track.format === 'full' && (
                    <a href={track.submissionInstructionsLink} target="_blank" className={styles.mt3}>
                      Instruções para submissão
                    </a>
                  )}
                </div>
              </div>
            )}
            {/* Arquivo já existe */}
            {fileExists && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label htmlFor="keywords" className={`${styles.colSm3} ${styles.textRight} ${styles.alignMiddle} ${styles.controlLabel} ${styles.colFormLabel}`}>Arquivo da submissão</label>
                <div className={`${styles.colSm9} ${styles.row}`}>
                  <div className={styles.colSm3}>
                    <button type="button" className="btn btn-success" onClick={() => downloadSubmissionFile(submission)}>
                      Download
                    </button>
                  </div>
                  <div className={styles.colSm3}>
                    <button type="button" className="btn btn-danger" onClick={changeSubmissionFile}>
                      Substituir arquivo da submissão
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Palavras-chave */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label htmlFor="keywords" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Palavras-chave</label>
              <div className={styles.colSm9}>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.keywords ? styles.isInvalid : ''}`}
                  id="keywords"
                  name="keywords"
                  placeholder="Palavras-chave separadas por vírgula ( , )"
                  value={formValues.keywords}
                  onChange={handleChange}
                />
                {submitted && errors.keywords && (
                  <div className={styles.invalidFeedback}>
                    {(errors.keywords.required || errors.keywords.lessThanOne) && <div>Informe pelo menos uma palavra-chave</div>}
                  </div>
                )}
              </div>
            </div>
            {/* Autores */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label htmlFor="authors" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Autores</label>
              <div className={styles.colSm9}>
                <input
                  type="text"
                  className={`form-control ${submitted && errors.authors ? styles.isInvalid : ''}`}
                  id="authors"
                  name="authors"
                  placeholder="Autores separados por vírgula ( , )"
                  value={formValues.authors}
                  onChange={handleChange}
                />
                {submitted && errors.authors && (
                  <div className={styles.invalidFeedback}>
                    {(errors.authors.required || errors.authors.lessThanOne) && <div>Informe pelo menos um autor</div>}
                    {errors.authors.containsPoint && <div>Não são permitidas abreviações nos nomes dos autores</div>}
                  </div>
                )}
              </div>
            </div>
            {/* Checkbox autores por extenso */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}></label>
              <div className={styles.colSm9}>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className={`custom-control-input ${submitted && errors.extensive ? styles.isInvalid : ''}`}
                    id="extensive_yes"
                    name="extensive"
                    checked={formValues.extensive}
                    onChange={handleChange}
                  />
                  <label className="custom-control-label" htmlFor="extensive_yes">
                    Afirmo que os nomes de todos os autores acima citados estão escritos por extenso e não possuem abreviações
                  </label>
                  {submitted && errors.extensive && (
                    <div className={styles.invalidFeedback}>
                      {errors.extensive.required && <div>Você deve confirmar que os nomes de todos os autores estão escritos por extenso</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Área de conhecimento */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label htmlFor="knowledge_area" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Área</label>
              <div className={styles.colSm9}>
                {/* Substitua por um componente multiselect React */}
                <Select
                  isMulti
                  name="knowledge_area"
                  options={dropdownList}
                  value={selectedItems}
                  onChange={handleKnowledgeAreaChange}
                  classNamePrefix="select"
                  placeholder="Selecione a área de conhecimento"
                />
                {submitted && errors.knowledge_area && (
                  <div className={styles.invalidFeedback}>
                    {errors.knowledge_area.required && <div>Informe a área de conhecimento</div>}
                  </div>
                )}
              </div>
            </div>
            {/* Categoria da submissão */}
            {track?.submissionCategory && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label htmlFor="category" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>{track.submissionCategory}</label>
                <div className={styles.colSm9}>
                  <select
                    className={`select2 form-control font-big ${submitted && errors.category ? styles.isInvalid : ''}`}
                    style={{ width: '100%', height: 36 }}
                    name="category"
                    value={formValues.category}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    {track.submissionCategoryValues.map((categoryValue, i) => (
                      <option key={i} value={categoryValue}>{categoryValue}</option>
                    ))}
                  </select>
                  {submitted && errors.category && (
                    <div className={styles.invalidFeedback}>
                      {errors.category.required && <div>{track.submissionCategory} é uma informação obrigatória</div>}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* CPF do orientador */}
            {track?.advisorReviewRequired && (!editByAdvisor || requestAdvisorCpf) && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label htmlFor="advisor" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>CPF do orientador</label>
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
                      {errors.advisor.required && <div>Necessário informar o CPF do orientador</div>}
                      {errors.advisor.cpfvalidator && <div>CPF inválido</div>}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* E-mail do orientador */}
            {requestEmail && !editByAdvisor && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label htmlFor="advisorEmail" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>E-mail do orientador</label>
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
                      {errors.advisorEmail.required && <div>Necessário informar o e-mail do orientador</div>}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Instituição */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label htmlFor="institution" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Instituição</label>
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
                    {errors.institution.required && <div>Necessário informar instituição a qual você está vinculado</div>}
                  </div>
                )}
              </div>
            </div>
            {/* Centro de ensino */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label htmlFor="center" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Centro de ensino</label>
              <div className={styles.colSm9}>
                <select
                  className="select2 form-control font-big"
                  style={{ width: '100%', height: 36 }}
                  name="center"
                  value={formValues.center}
                  onChange={handleChange}
                >
                  <option value="">Não se aplica</option>
                  {centers.map((ce, i) => (
                    <option key={i} value={ce}>{ce}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Pergunta adicional do autor */}
            {track?.additionalQuestionAuthor && !editByAdvisor && (
              <div className={`${styles.formGroup} ${styles.row} ${styles.alignItemsCenter}`}>
                <label htmlFor="approved" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>{track.additionalQuestionAuthor}</label>
                <div id="approved" className={styles.colSm9}>
                  <div className={`${styles.row} ${styles.justifyContentStart} ${styles.alignItemsCenter}`}>
                    <div className={styles.hPadding}>Não</div>
                    <Switch
                      id="additionalQuestionAnswer"
                      checked={formValues.additionalQuestionAnswer}
                      onChange={handleSwitchChange}
                      className={styles.tpMargin}
                    />
                    <div className={styles.hPadding}>Sim</div>
                  </div>
                </div>
              </div>
            )}
            {/* Fonte de financiamento */}
            <div className={`${styles.formGroup} ${styles.row}`}>
              <label htmlFor="supporting_source" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Fonte de financiamento</label>
              <div className={styles.colSm9}>
                <select
                  className={`select2 form-control font-big ${submitted && errors.supporting_source ? styles.isInvalid : ''}`}
                  style={{ width: '100%', height: 36 }}
                  name="supporting_source"
                  value={formValues.supporting_source}
                  onChange={handleChange}
                >
                  <option value="">Selecione...</option>
                  {supportingSources.map((source, i) => (
                    <option key={i} value={source}>{source}</option>
                  ))}
                </select>
                {submitted && errors.supporting_source && (
                  <div className={styles.invalidFeedback}>
                    {errors.supporting_source.required && <div>Informe a fonte de financiamento</div>}
                  </div>
                )}
              </div>
            </div>
            {/* Instruções para apoio */}
            {event?.supporting_institution_message_instructions &&
              event.supporting_institution_message_instructions.length > 4 &&
              formValues.supporting_source &&
              formValues.supporting_source !== 'Não se aplica' && (
                <div className={`${styles.formGroup} ${styles.row}`}>
                  <label htmlFor="supporting_institution_message" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}></label>
                  <div className={styles.colSm9}>
                    <label className={styles.colSm12}>Instruções para preenchimento do texto no campo Apoio (abaixo):</label>
                    <div className={styles.colSm12} dangerouslySetInnerHTML={{ __html: event.supporting_institution_message_instructions }} />
                  </div>
                </div>
              )}
            {/* Mensagem de apoio */}
            {formValues.supporting_source && formValues.supporting_source !== 'Sem financiamento' && (
              <div className={`${styles.formGroup} ${styles.row}`}>
                <label htmlFor="supporting_institution_message" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Mensagem de apoio</label>
                <div className={styles.colSm9}>
                  <textarea
                    rows={3}
                    className="form-control"
                    id="supporting_institution_message"
                    placeholder="Mensagem de apoio exigida pelo órgão de fomento ou instituição financiadora"
                    name="supporting_institution_message"
                    value={formValues.supporting_institution_message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            )}
            {/* Perguntas extras */}
            {questions && questions.length > 0 && (
              <QuestionMain
                questions={questions}
                submitted={submitted}
                value={formValues.questions}
                onChange={handleQuestionsChange}
              />
            )}
            {/* Declaração de evento virtual */}
            {event?.virtual && !editByAdvisor && (
              <div className={`${styles.formGroup} ${styles.row}`} style={{ marginBottom: 0 }}>
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
                  <span style={{ fontSize: '80%', color: '#da542e', marginRight: 20 }}>
                    Você deve concordar com a declaração acima para finalizar a submissão
                  </span>
                )}
              </div>
            )}
            {/* Atenção */}
            <div className={`${styles.formGroup} ${styles.row} ${styles.textCenter}`} style={{ marginTop: 15 }}>
              <strong>
                ATENÇÃO: verifique atenciosamente as informações desta submissão e também os dados cadastrais da sua conta (especialmente o seu nome completo), pois serão utilizados na geração de certificado e outras finalidades.
              </strong>
            </div>
            {/* Comentários do orientador */}
            {isEdit && track?.advisorReviewRequired && (
              <>
                <div className={`${styles.formGroup} ${styles.row}`}>
                  <label htmlFor="comment" className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>Novo comentário</label>
                  <div className={styles.colSm9}>
                    <textarea
                      type="text"
                      className="form-control"
                      id="comment"
                      placeholder="Insira aqui um comentário"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className={`${styles.row} ${styles.justifyContentEnd}`}>
                  <div className={styles.colSm9}>
                    <h6>Comentários:</h6>
                    <div className={`${styles.border} ${styles.rounded5} ${styles.mt2} ${styles.justifyContentCenter}`} style={{ overflowY: 'auto', height: 250, borderRadius: 3, borderColor: '#e9ecef' }}>
                      {submission.submissionComments && submission.submissionComments.length > 0 ? (
                        submission.submissionComments.map((c, i) => (
                          <div key={i} className="card bg-light mb-2" style={{ margin: 7 }}>
                            <div className="card-header">
                              <strong className="mr-1">{c.author} </strong> em {c.date}
                            </div>
                            <div className="card-body">
                              <p className="card-text">{c.message}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        !loading && <p className={`${styles.mt3} ${styles.ml3}`}>Nenhum comentário cadastrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.borderTop}>
            <div className={styles.cardBody}>
              <button
                type="submit"
                className="btn btn-success"
                disabled={!(submission?.advisorState !== 'advisor_feedback_approved') && editByAdvisor}
              >
                {editByAdvisor ? 'Liberar para revisão do evento' : 'Salvar'}
              </button>
              {submission?.advisorState !== 'advisor_feedback_approved' && editByAdvisor && (
                <a onClick={addSubmissionComment} className="btn btn-danger text-white ml-2">
                  Solicitar correção pelo autor
                </a>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div className={styles.loadingBlock}>
      <span className={styles.spinnerWrapper}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
      </span>
    </div>
  )}
</div>