<div className={styles.pageWrapper}>
  <div className={styles.containerFluid}>
    {isAdmin ? (
      <div className={`${styles.row} ${styles.justifyContentCenter} ${styles.optionsRow}`}>
        <div className={styles.colMd2}>
          <Link to="/home/choose-track?destinationRoute=assign-reviewer&title=Atribuir submissão ao revisor&eventServiceRoute=on_review">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgWarning} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-account-edit"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Atribuir submissão <br />
                  ao revisor
                </h6>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={styles.colMd2}>
          <Link to="/home/panel-reviewer">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgCyan} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-pencil-box-outline"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Minhas <br />
                  revisões
                </h6>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={styles.colMd2}>
          <Link to="/home/choose-track?destinationRoute=review-status&title=Trabalhos aprovados&statusReview=true&eventServiceRoute=no_pagination">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgSuccess} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-checkbox-marked-outline"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Trabalhos <br />
                  aprovados
                </h6>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={styles.colMd2}>
          <Link to="/home/choose-track?destinationRoute=review-status&title=Trabalhos reprovados&statusReview=false&eventServiceRoute=no_pagination">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgDanger} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-close-box-outline"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Trabalhos <br />
                  reprovados
                </h6>
              </div>
            </div>
          </Link>
        </div>
      </div>
    ) : (
      <ReviewerPanel subPage={true} />
    )}

    {isAdmin && !loading && (
      <div className={`${styles.dFlex} ${styles.flexColumn} ${styles.hPadding}`}>
        <div>
          <label>Revisões por evento</label>
        </div>
        <div>
          <select
            className="select2 form-control select2-hidden-accessible font-big"
            style={{ width: '100%', height: 36 }}
            value={selectedEvent?._id || ''}
            onChange={(e) => {
              const event = events.find(ev => ev._id === e.target.value);
              setSelectedEvent(event);
            }}
          >
            <option value=""></option>
            {events.map((e, index) => (
              <option key={index} value={e._id}>
                {e.short_name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedEvent && selectedEvent.tracks.length > 0 && (
          <div className={styles.trackTitle}>
            <label>Escolha a trilha do evento</label>
          </div>
        )}
        
        {selectedEvent && (
          <div className={`${styles.row} ${styles.flexRow} ${styles.justifyContentCenter}`}>
            {selectedEvent.tracks.map((t, index) => (
              <div
                key={index}
                className={`${styles.card} ${styles.cardHover} ${styles.colMd2} ${styles.margin}`}
                style={{
                  backgroundColor: 
                    t.color !== '#fff' && t.color !== '#ffffff' ? t.color : '#000'
                }}
              >
                <a onClick={() => loadSubmissionsByTrack(t)}>
                  <div className={`${styles.box} ${styles.textCenter}`}>
                    <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                      <i className="mdi mdi-note-multiple"></i>
                    </h1>
                    <h6 className={styles.textWhite}>{t.name}</h6>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
        
        {selectedEvent && selectedEvent.tracks.length <= 0 && (
          <div className={styles.emptyBlock}>
            Não existem trilhas cadastradas para prosseguir com a operação
          </div>
        )}
        
        {track !== null && (
          <div>
            <div className={`${styles.row} ${styles.justifyContentEnd} ${styles.hPadding} ${styles.newButtonPadding}`}>
              <button
                onClick={downloadSubmissions}
                disabled={downloading}
                className={`btn btn-primary btn-md ${styles.rightMargin}`}
                type="button"
              >
                {downloading ? "Aguarde..." : "Baixar relatório"}
              </button>
            </div>
            <ReviewerPanel track={track} subPage={true} />
          </div>
        )}
      </div>
    )}
    
    {isAdmin && loading && (
      <span className={styles.spinnerWrapper}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
      </span>
    )}
  </div>
</div>