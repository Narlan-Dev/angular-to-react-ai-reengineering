<div className={styles.pageWrapper}>
  <div className={styles.pageBreadcrumb}>
    <div className={styles.row}>
      <div className={`${styles.col12} ${styles.dFlex} ${styles.alignItemsCenter}`}>
        <h4 className={styles.pageTitle}>Submissões</h4>
      </div>
    </div>
  </div>
  <div className={styles.containerFluid}>
    {isAdmin && (
      <div className={`${styles.dFlex} ${styles.flexColumn} ${styles.hPadding}`}>
        <div>
          <label>Escolha o evento</label>
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
        {selectedEvent && selectedEvent.tracks.length <= 0 && !loading && (
          <div className={styles.emptyBlock}>
            Não existem trilhas cadastradas para prosseguir com a operação
          </div>
        )}
        {(submissionsAdmin.length > 0 || submissionsAdminForAdvisor.length > 0) && (
          <div className={styles.tabGroup}>
            <div className={styles.tabs}>
              <button
                className={tabIndex === 0 ? styles.activeTab : ''}
                onClick={() => setTabIndex(0)}
              >
                Submissões da trilha
              </button>
              <button
                className={tabIndex === 1 ? styles.activeTab : ''}
                onClick={() => setTabIndex(1)}
              >
                Minhas orientações
              </button>
            </div>
            {tabIndex === 0 && (
              <div className={`${styles.card} ${submissionsAdmin.length <= 0 || loading ? styles.hidden : ''}`}>
                <div className={styles.cardBody}>
                  <form className={styles.row} onSubmit={e => { e.preventDefault(); search(); }}>
                    <div className={styles.col11}>
                      <div style={{ width: '100%' }}>
                        <label>Digite sua busca</label>
                        <input
                          type="text"
                          id="search"
                          name="search"
                          className={`search-input ${errors.search ? styles.isInvalid : ''}`}
                          value={searchValue}
                          onChange={e => setSearchValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && search()}
                        />
                        {errors.search && (
                          <div className={styles.matError}>Nenhuma correspondência obtida</div>
                        )}
                      </div>
                    </div>
                    <div className={`${styles.col1} ${styles.buttonSave}`}>
                      <button
                        onClick={search}
                        disabled={loading}
                        className="btn btn-secondary btn-md"
                        type="button"
                      >
                        {loading ? 'Aguarde...' : 'Buscar'}
                      </button>
                    </div>
                  </form>
                  <div className={`${styles.col12} ${styles.row} ${styles.topSpacing}`} style={{ width: '100%', overflowX: 'scroll' }}>
                    <table className={styles.responsiveTable}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Título</th>
                          <th>CPF</th>
                          <th>Data</th>
                          <th>Apresentação</th>
                          <th>Status</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAdminDataSource.map((element, i) => (
                          <tr key={element.id}>
                            <td>{i + 1 + pageSize * (currentPage - 1)}</td>
                            <td>{element.title}</td>
                            <td>{element.user?.cpf ?? ''}</td>
                            <td>{formatDate(element.created_at)}</td>
                            <td>{element.presentation}</td>
                            <td>{getSubmissionStatus(element.status)}</td>
                            <td onClick={() => navigateToEditSubmission(element)}>
                              <h3>
                                <i className="mdi mdi-pencil" style={{ cursor: 'pointer' }} />
                                <span className={styles.subtitle}> Editar</span>
                              </h3>
                            </td>
                            <td onClick={() => openRemoveDialog(element)}>
                              <h3>
                                <i className="mdi mdi-delete" style={{ cursor: 'pointer' }} />
                                <span className={styles.subtitle}> Deletar</span>
                              </h3>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.textRight}>
                    <PaginationControls
                      previousLabel="Anterior"
                      nextLabel="Próximo"
                      currentPage={currentPage}
                      totalItems={amountUsers}
                      itemsPerPage={pageSize}
                      onPageChange={page => {
                        setCurrentPage(page);
                        paginate(page);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {tabIndex === 1 && (
              <div className={`${styles.card} ${submissionsAdminForAdvisor.length <= 0 || loading ? styles.hidden : ''}`}>
                <div className={styles.cardBody}>
                  <form className={styles.row} onSubmit={e => { e.preventDefault(); searchAdvisor(); }}>
                    <div className={styles.col11}>
                      <div style={{ width: '100%' }}>
                        <label>Digite sua busca</label>
                        <input
                          type="text"
                          id="searchAdvisor"
                          name="searchAdvisor"
                          className={`search-input ${errorsAdvisor.searchAdvisor ? styles.isInvalid : ''}`}
                          value={searchAdvisorValue}
                          onChange={e => setSearchAdvisorValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && searchAdvisor()}
                        />
                        {errorsAdvisor.searchAdvisor && (
                          <div className={styles.matError}>Nenhuma correspondência obtida</div>
                        )}
                      </div>
                    </div>
                    <div className={`${styles.col1} ${styles.buttonSave}`}>
                      <button
                        onClick={searchAdvisor}
                        disabled={loading}
                        className="btn btn-secondary btn-md"
                        type="button"
                      >
                        {loading ? 'Aguarde...' : 'Buscar'}
                      </button>
                    </div>
                  </form>
                  <div className={`${styles.col12} ${styles.row} ${styles.topSpacing}`} style={{ width: '100%', overflowX: 'scroll' }}>
                    <table className={styles.responsiveTable}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Título</th>
                          <th>CPF</th>
                          <th>Data</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAdminDataSourceForAdvisor.map((element, i) => (
                          <tr key={element.id}>
                            <td>{i + 1 + pageSizeForAdvisor * (currentPageForAdvisor - 1)}</td>
                            <td>{element.title}</td>
                            <td>{element.user?.cpf ?? ''}</td>
                            <td>{formatDate(element.created_at)}</td>
                            <td onClick={() => navigateToValidateSubmission(element)}>
                              <h3>
                                <i className="mdi mdi-account-check" style={{ cursor: 'pointer' }} />
                                <span className={styles.subtitle}> Editar</span>
                              </h3>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.textRight}>
                    <PaginationControls
                      previousLabel="Anterior"
                      nextLabel="Próximo"
                      currentPage={currentPageForAdvisor}
                      totalItems={amountOfSubmissions}
                      itemsPerPage={pageSizeForAdvisor}
                      onPageChange={page => {
                        setCurrentPageForAdvisor(page);
                        paginateAdvisor(page);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {isAdmin && (loading || loadingForAdvisorSubmissions) && (
          <div className={styles.emptyBlock}>
            <span className={styles.spinnerWrapper}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
            </span>
          </div>
        )}
        {submissionsAdmin.length === 0 && !loading && loadedFirstTime && (
          <div className={styles.emptyBlock}>
            Não existem submissões enviadas
          </div>
        )}
      </div>
    )}
    {!isAdmin && !loading && (
      <>
        <div className={`${styles.row} ${styles.justifyContentEnd} ${styles.hPadding} ${styles.newButtonPadding}`}>
          <button
            type="button"
            className="btn btn-success btn-md"
            onClick={navigateToNewSubmission}
          >
            Nova submissão
          </button>
        </div>
        {submissions.length > 0 && (
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {submissions.length > 5 && (
                <div style={{ width: '100%' }}>
                  <label>Digite sua busca</label>
                  <input
                    type="text"
                    className="search-input"
                    value={searchValue}
                    onChange={e => applyFilter(e.target.value)}
                  />
                </div>
              )}
              <div className={`${styles.col12} ${styles.row} ${styles.topSpacing}`} style={{ width: '100%', overflowX: 'scroll' }}>
                <table className={styles.responsiveTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Título</th>
                      <th>Data</th>
                      <th>Evento</th>
                      <th>Trilha</th>
                      <th>Status</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDataSource.map((element, i) => (
                      <tr key={element.id}>
                        <td>{i + 1 + pageSize * (currentPage - 1)}</td>
                        <td>{element.title}</td>
                        <td>{formatDate(element.created_at)}</td>
                        <td>{element.event_short_name}</td>
                        <td>{element.event_track_name}</td>
                        <td>{getSubmissionStatus(element.status)}</td>
                        <td>
                          {element.status === 'PENDING_CORRECTION' && (
                            <h3 onClick={() => navigateToEditSubmission(element)}>
                              <i className="mdi mdi-pencil" style={{ cursor: 'pointer' }} />
                              <span className={styles.subtitle}> Editar</span>
                            </h3>
                          )}
                        </td>
                        <td>
                          {element.advisorState !== 'advisor_feedback_approved' && !element.approved && (
                            <h3 onClick={() => openRemoveDialog(element)}>
                              <i className="mdi mdi-delete" style={{ cursor: 'pointer' }} />
                              <span className={styles.subtitle}> Deletar</span>
                            </h3>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {submissions.length === 0 && !loading && (
          <div className={styles.emptyBlock}>
            Não existem submissões enviadas
          </div>
        )}
      </>
    )}
    {!isAdmin && loading && (
      <div className={styles.emptyBlock}>
        <span className={styles.spinnerWrapper}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
        </span>
      </div>
    )}
  </div>
</div>