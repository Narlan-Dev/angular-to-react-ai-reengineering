return (
  <div className="page-wrapper">
    <div className="page-breadcrumb">
      <div className="row">
        <div className="col-12 d-flex no-block align-items-center">
          <h4 className="page-title">Submissões</h4>
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
              <h4 className="card-title">
                Submeter trabalho para a trilha {track?.name || ''}
              </h4>

              {/* Title */}
              <div className="form-group row">
                <label
                  htmlFor="title"
                  className="col-sm-3 text-right control-label col-form-label"
                >
                  Título
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className={`form-control ${
                      submitted && errors.title ? 'is-invalid' : ''
                    }`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título do seu trabalho"
                  />
                  {submitted && errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.type === 'required' &&
                        'Necessário informar o título do trabalho'}
                    </div>
                  )}
                </div>
              </div>

              {/* Abstract (Rich Text Editor) */}
              {!fullTrackFormat && (
                <div className="form-group row">
                  <label
                    htmlFor="abstract"
                    className="col-sm-3 text-right control-label col-form-label"
                  >
                    Resumo
                  </label>
                  <div className="col-sm-9">
                    {/* Em React, você usaria uma biblioteca como React-Quill ou Editor.js aqui */}
                    {/* <ReactQuill theme="snow" value={formData.abstract} onChange={handleAbstractChange} /> */}
                    <textarea
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleAbstractChange}
                      className="form-control"
                      rows="10"
                    ></textarea>
                    <div className="col-12">
                      <span className="float-right">
                        Total: {words} {words > 1 ? 'palavras' : 'palavra'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission File */}
              {fullTrackFormat && !fileExists && (
                <div className="form-group row">
                  <label
                    htmlFor="submissionFile"
                    className="col-sm-3 text-right control-label col-form-label"
                  >
                    Arquivo da submissão
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="file"
                      className={`form-control ${
                        submitted && errors.submissionFile ? 'is-invalid' : ''
                      }`}
                      id="submissionFile"
                      name="submissionFile"
                      onChange={onSubmissionFileChange}
                      accept="application/pdf"
                    />
                    {submitted && errors.submissionFile && (
                      <div className="invalid-feedback">
                        <div>
                          Necessário anexar o arquivo (PDF) da submissão.
                        </div>
                      </div>
                    )}
                    {track.submissionInstructionsLink &&
                      track.format === 'full' && (
                        <a
                          href={track.submissionInstructionsLink}
                          target="_blank"
                          className="mt-3"
                        >
                          Instruções para submissão
                        </a>
                      )}
                  </div>
                </div>
              )}

              {/* Existing File */}
              {fileExists && (
                <div className="form-group row">
                  <label className="col-sm-3 text-right control-label col-form-label">
                    Arquivo da submissão
                  </label>
                  <div className="col-sm-9 row">
                    <div className="col-sm-3">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => downloadSubmissionFile(submission)}
                      >
                        Download
                      </button>
                    </div>
                    <div className="col-sm-3">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={changeSubmissionFile}
                      >
                        Substituir arquivo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Keywords, Authors, etc. */}
              {/* ... outros campos do formulário convertidos de forma semelhante ... */}

              {/* Comments Section */}
              {isEdit && track?.advisorReviewRequired && (
                <div className="form-group row">
                  <label
                    htmlFor="comment"
                    className="col-sm-3 text-right control-label col-form-label"
                  >
                    Novo comentário
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      id="comment"
                      placeholder="Insira aqui um comentário"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              )}

              {isEdit && track?.advisorReviewRequired && (
                <div className="row justify-content-end">
                  <div className="col-sm-9">
                    <h6>Comentários:</h6>
                    <div className={styles.commentsContainer}>
                      {submission.submissionComments?.length > 0 ? (
                        submission.submissionComments.map((c, index) => (
                          <div
                            key={index}
                            className="card bg-light mb-2"
                            style={{ margin: '7px' }}
                          >
                            <div className="card-header">
                              <strong className="mr-1">{c.author}</strong> em{' '}
                              {c.date}
                            </div>
                            <div className="card-body">
                              <p className="card-text">{c.message}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="mt-3 ml-3">
                          Nenhum comentário cadastrado.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-top">
              <div className="card-body">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    editByAdvisor &&
                    submission?.advisorState === 'advisor_feedback_approved'
                  }
                >
                  {editByAdvisor ? 'Liberar para revisão do evento' : 'Salvar'}
                </button>
                {editByAdvisor &&
                  submission?.advisorState !== 'advisor_feedback_approved' && (
                    <a
                      onClick={addSubmissionComment}
                      className="btn btn-danger text-white ml-2"
                    >
                      Solicitar correção pelo autor
                    </a>
                  )}
              </div>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
