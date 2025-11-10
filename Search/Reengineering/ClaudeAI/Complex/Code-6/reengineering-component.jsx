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
            className="select2 form-control select2-hidden-accessible font-big"
            style={{ width: '100%', height: 36 }}
            value={selectedEvent?._id || ''}
            onChange={(e) => {
              const event = events.find(ev => ev._id === e.target.value);
              setSelectedEvent(event);
            }}
          >
            <option value=""></option>
            {events.map((e, i) => (
              <option key={i} value={e._id}>
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
            {selectedEvent.tracks.map((t) => (
              <div
                key={t._id}
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

        {(submissionsAdmin.length > 0 || submissionsAdminForAdvisor.length > 0) && (
          <div className={styles.tabGroup}>
            <div className={styles.tabHeader}>
              <button 
                className={`${styles.tab} ${tabIndex === 0 ? styles.tabActive : ''}`}
                onClick={() => setTabIndex(0)}
              >
                Submissões da trilha
              </button>
              <button 
                className={`${styles.tab} ${tabIndex === 1 ? styles.tabActive : ''}`}
                onClick={() => setTabIndex(1)}
              >
                Minhas orientações
              </button>
            </div>
            
            {/* Tab: Submissões da trilha */}
            {tabIndex === 0 && submissionsAdmin.length > 0 && !loading && (
              <div className={styles.card}>
                <div className={styles.cardBody}>
                  <form className={styles.row} onSubmit={handleSearchSubmit}>
                    <div className={styles.col11}>
                      <div className={styles.matFormField}>
                        <label>Digite sua busca</label>
                        <input
                          type="text"
                          id="search"
                          name="search"
                          className={`search-input ${errors.search ? styles.isInvalid : ''}`}
                          value={searchForm.search}
                          onChange={handleSearchChange}
                          onKeyUp={(e) => e.key === 'Enter' && search()}
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
                        {loading ? "Aguarde..." : "Buscar"}
                      </button>
                    </div>
                  </form>
                  <div
                    className={`${styles.col12} ${styles.row} ${styles.topSpacing}`}
                    style={{ width: '100%', overflowX: 'scroll' }}
                  >
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th></th>
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
                        {adminDataSource.map((element, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{element.title}</td>
                            <td>{element.user ? element.user.cpf : ""}</td>
                            <td>{formatDate(element.created_at, 'dd/MM/yyyy')}</td>
                            <td>{element.presentation}</td>
                            <td>{getSubmissionStatus(element.status)}</td>
                            <td onClick={() => navigateToEditSubmission(element)}>
                              <h3>
                                <i
                                  title="Editar"
                                  className="mdi mdi-pencil"
                                  style={{ cursor: 'pointer' }}
                                />
                                <span className={styles.subtitle}> Editar</span>
                              </h3>
                            </td>
                            <td onClick={() => openRemoveDialog(element)}>
                              <h3>
                                <i
                                  title="Deletar"
                                  className="mdi mdi-delete"
                                  style={{ cursor: 'pointer' }}
                                />
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
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        paginate(page);
                      }}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      totalItems={amountUsers}
                    />
                  </div>
                </div>
              </div>
            )}

            {tabIndex === 0 && selectedEvent && selectedEvent.tracks.length <= 0 && !loading && (
              <div className={styles.emptyBlock}>
                Não existem trilhas cadastradas para prosseguir com a operação
              </div>
            )}

            {/* Tab: Minhas orientações */}
            {tabIndex === 1 && submissionsAdminForAdvisor.length > 0 && !loading && (
              <div className={styles.card}>
                <div className={styles.cardBody}>
                  <form className={styles.row} onSubmit={handleSearchAdvisorSubmit}>
                    <div className={styles.col11}>
                      <div className={styles.matFormField}>
                        <label>Digite sua busca</label>
                        <input
                          type="text"
                          id="searchAdvisor"
                          name="searchAdvisor"
                          className={`search-input ${errors.searchAdvisor ? styles.isInvalid : ''}`}
                          value={searchForAdvisorForm.searchAdvisor}
                          onChange={handleSearchAdvisorChange}
                          onKeyUp={(e) => e.key === 'Enter' && searchAdvisor()}
                        />
                        {errors.searchAdvisor && (
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
                        {loading ? "Aguarde..." : "Buscar"}
                      </button>
                    </div>
                  </form>
                  <div
                    className={`${styles.col12} ${styles.row} ${styles.topSpacing}`}
                    style={{ width: '100%', overflowX: 'scroll' }}
                  >
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Título</th>
                          <th>CPF</th>
                          <th>Data</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminDataSourceForAdvisor.map((element, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{element.title}</td>
                            <td>{element.user ? element.user.cpf : ""}</td>
                            <td>{formatDate(element.created_at, 'dd/MM/yyyy')}</td>
                            <td onClick={() => navigateToValidateSubmission(element)}>
                              <h3>
                                <i
                                  title="Editar"
                                  className="mdi mdi-account-check"
                                  style={{ cursor: 'pointer' }}
                                />
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
                      onPageChange={(page) => {
                        setCurrentPageForAdvisor(page);
                        paginate(page);
                      }}
                      currentPage={currentPageForAdvisor}
                      pageSize={pageSizeForAdvisor}
                      totalItems={amountOfSubmissions}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isAdmin && (!loading && !loadingForAdvisorSubmissions) && (
          <div className={styles.emptyBlock}>
            <span className={styles.spinnerWrapper}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
            </span>
          </div>
        )}

        {submissionsAdmin.length <= 0 && !loading && loadedFirstTime && (
          <div className={styles.emptyBlock}>
            Não existem submissões enviadas
          </div>
        )}
      </div>
    )}

    {!isAdmin && !loading && (
      <div>
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
                <div className={styles.matFormField}>
                  <div className={`${styles.formGroup} ${styles.row} ${styles.flexColumn} ${styles.hPadding}`}>
                    <div>
                      <label>Digite sua busca</label>
                    </div>
                    <div>
                      <input
                        className="search-input"
                        onKeyUp={(e) => applyFilter(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`${styles.col12} ${styles.row} ${styles.topSpacing}`}
                style={{ width: '100%', overflowX: 'scroll' }}
              >
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th></th>
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
                    {dataSource.map((element, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{element.title}</td>
                        <td>{formatDate(element.created_at, 'dd/MM/yyyy')}</td>
                        <td>{element.event_short_name}</td>
                        <td>{element.event_track_name}</td>
                        <td>{getSubmissionStatus(element.status)}</td>
                        <td onClick={() => navigateToEditSubmission(element)}>
                          {element.status === 'PENDING_CORRECTION' && (
                            <h3>
                              <i
                                title="Editar"
                                className="mdi mdi-pencil"
                                style={{ cursor: 'pointer' }}
                              />
                              <span className={styles.subtitle}> Editar</span>
                            </h3>
                          )}
                        </td>
                        <td>
                          {element.advisorState !== 'advisor_feedback_approved' &&
                            !element.approved && (
                              <h3 onClick={() => openRemoveDialog(element)}>
                                <i
                                  title="Deletar"
                                  className="mdi mdi-delete"
                                  style={{ cursor: 'pointer' }}
                                />
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
        {submissions.length <= 0 && !loading && (
          <div className={styles.emptyBlock}>
            Não existem submissões enviadas
          </div>
        )}
      </div>
    )}

    {!isAdmin && loading && (
      <span className={styles.spinnerWrapper}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
      </span>
    )}
  </div>
</div>