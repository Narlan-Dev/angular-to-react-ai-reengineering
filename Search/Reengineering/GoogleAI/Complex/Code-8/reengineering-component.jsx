return (
  <div className="page-wrapper">
    <div className="container-fluid">
      {isAdmin ? (
        <>
          {/* Admin Top-Level Options */}
          <div className={`${styles.row} ${styles.optionsRow}`}>
            <div className="col-md-2">
              <Link to="/home/assign-reviewer" className={styles.cardLink}>
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} bg-warning text-center`}>
                    <h1 className="font-light text-white">
                      <i className="mdi mdi-account-edit"></i>
                    </h1>
                    <h6 className="text-white">
                      Atribuir submissão <br /> ao revisor
                    </h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-2">
              <Link to="/home/panel-reviewer" className={styles.cardLink}>
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} bg-cyan text-center`}>
                    <h1 className="font-light text-white">
                      <i className="mdi mdi-pencil-box-outline"></i>
                    </h1>
                    <h6 className="text-white">
                      Minhas <br /> revisões
                    </h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-2">
              <Link
                to="/home/review-status/approved"
                className={styles.cardLink}
              >
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} bg-success text-center`}>
                    <h1 className="font-light text-white">
                      <i className="mdi mdi-checkbox-marked-outline"></i>
                    </h1>
                    <h6 className="text-white">
                      Trabalhos <br /> aprovados
                    </h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-2">
              <Link
                to="/home/review-status/rejected"
                className={styles.cardLink}
              >
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} bg-danger text-center`}>
                    <h1 className="font-light text-white">
                      <i className="mdi mdi-close-box-outline"></i>
                    </h1>
                    <h6 className="text-white">
                      Trabalhos <br /> reprovados
                    </h6>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Admin Content Area */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <CircularProgress color="primary" size={40} />
            </div>
          ) : (
            <div className={styles.adminContentContainer}>
              <div>
                <label>Revisões por evento</label>
              </div>
              <div>
                <select
                  className={styles.selectControl}
                  value={selectedEvent ? JSON.stringify(selectedEvent) : ''}
                  onChange={(e) => handleEventChange(e.target.value)}
                >
                  <option value=""></option>
                  {events.map((e, i) => (
                    <option key={i} value={JSON.stringify(e)}>
                      {e.short_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && (
                <>
                  {selectedEvent.tracks.length > 0 ? (
                    <>
                      <div className={styles.trackTitle}>
                        <label>Escolha a trilha do evento</label>
                      </div>
                      <div
                        className={`${styles.row} ${styles.tracksContainer}`}
                      >
                        {selectedEvent.tracks.map((t, i) => (
                          <div
                            key={i}
                            className={`${styles.card} ${styles.cardHover} col-md-2 ${styles.margin}`}
                            style={{
                              backgroundColor:
                                t.color !== '#fff' && t.color !== '#ffffff'
                                  ? t.color
                                  : '#000',
                            }}
                            onClick={() => loadSubmissionsByTrack(t)}
                          >
                            <div className={`${styles.box} text-center`}>
                              <h1 className="font-light text-white">
                                <i className="mdi mdi-note-multiple"></i>
                              </h1>
                              <h6 className="text-white">{t.name}</h6>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={styles.emptyBlock}>
                      Não existem trilhas cadastradas para prosseguir com a
                      operação
                    </div>
                  )}
                </>
              )}

              {track && (
                <div>
                  <div className={styles.downloadButtonContainer}>
                    <button
                      onClick={downloadSubmissions}
                      disabled={downloading}
                      className="btn btn-primary btn-md"
                      type="button"
                    >
                      {downloading ? 'Aguarde...' : 'Baixar relatório'}
                    </button>
                  </div>
                  <ReviewerPanel track={track} subPage={true} />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        // Reviewer View
        <ReviewerPanel subPage={true} />
      )}
    </div>
  </div>
);
