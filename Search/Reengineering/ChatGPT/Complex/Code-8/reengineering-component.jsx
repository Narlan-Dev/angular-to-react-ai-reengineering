<div className={styles.pageWrapper}>
  <div className={styles.containerFluid}>
    {isAdmin ? (
      <div className={`${styles.row} ${styles.justifyContentCenter} ${styles.optionsRow}`}>
        {/* Card: Atribuir submissão ao revisor */}
        <div className={styles.colMd2}>
          <a href="/home/choose-track?destinationRoute=assign-reviewer&title=Atribuir submissão ao revisor&eventServiceRoute=on_review">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgWarning} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-account-edit"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Atribuir submissão <br /> ao revisor
                </h6>
              </div>
            </div>
          </a>
        </div>
        {/* Card: Minhas revisões */}
        <div className={styles.colMd2}>
          <a href="/home/panel-reviewer">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgCyan} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-pencil-box-outline"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Minhas <br /> revisões
                </h6>
              </div>
            </div>
          </a>
        </div>
        {/* Card: Trabalhos aprovados */}
        <div className={styles.colMd2}>
          <a href="/home/choose-track?destinationRoute=review-status&title=Trabalhos aprovados&statusReview=true&eventServiceRoute=no_pagination">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgSuccess} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-checkbox-marked-outline"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Trabalhos <br /> aprovados
                </h6>
              </div>
            </div>
          </a>
        </div>
        {/* Card: Trabalhos reprovados */}
        <div className={styles.colMd2}>
          <a href="/home/choose-track?destinationRoute=review-status&title=Trabalhos reprovados&statusReview=false&eventServiceRoute=no_pagination">
            <div className={`${styles.card} ${styles.cardHover}`}>
              <div className={`${styles.box} ${styles.bgDanger} ${styles.textCenter}`}>
                <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                  <i className="mdi mdi-close-box-outline"></i>
                </h1>
                <h6 className={styles.textWhite}>
                  Trabalhos <br /> reprovados
                </h6>
              </div>
            </div>
          </a>
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
            className={`select2 form-control font-big`}
            style={{ width: '100%', height: 36 }}
            value={selectedEvent?.id ?? ''}
            onChange={e => setSelectedEvent(events.find(ev => ev.id === e.target.value) ?? null)}
          >
            <option value="">Selecione...</option>
            {events.map((e, i) => (
              <option key={i} value={e.id}>
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
            {selectedEvent.tracks.map((t, i) => (
              <div
                key={t.id || i}
                className={`card card-hover ${styles.colMd2} ${styles.margin}`}
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
        {track && (
          <>
            <div className={`${styles.row} ${styles.justifyContentEnd} ${styles.hPadding} ${styles.newButtonPadding}`}>
              <button
                onClick={downloadSubmissions}
                disabled={downloading}
                className="btn btn-primary btn-md right-margin"
                type="button"
              >
                {downloading ? 'Aguarde...' : 'Baixar relatório'}
              </button>
            </div>
            <ReviewerPanel track={track} subPage={true} />
          </>
        )}
      </div>
    )}
    {isAdmin && loading && (
      <div className={styles.spinnerWrapper}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
      </div>
    )}
  </div>
</div>