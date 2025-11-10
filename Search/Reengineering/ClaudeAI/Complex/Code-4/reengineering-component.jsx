<div className={styles.pageWrapper}>
  <div className={styles.pageBreadcrumb}>
    <div className={styles.row}>
      <div className={`${styles.col12} ${styles.dFlex} ${styles.alignItemsCenter}`}>
        <h4 className={styles.pageTitle}>Rotinas</h4>
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
              loadRoutinesByEvent(event);
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
        {selectedEvent && (
          <div className={styles.routineTitle}>
            <label>Escolha o tipo de rotina</label>
          </div>
        )}
        {selectedEvent && (
          <div className={`${styles.row} ${styles.flexRow} ${styles.justifyContentCenter}`}>
            <div className={styles.colMd2}>
              <a onClick={handleAssignmentReviewers}>
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} ${styles.bgCyan} ${styles.textCenter}`}>
                    <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                      <i className="mdi mdi-crosshairs"></i>
                    </h1>
                    <h6 className={styles.textWhite}>
                      Atribuição automática <br />
                      de revisores
                    </h6>
                  </div>
                </div>
              </a>
            </div>
            <div className={styles.colMd2}>
              <a onClick={handleGenerateCertificates}>
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} ${styles.bgWarning} ${styles.textCenter}`}>
                    <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                      <i className="mdi mdi-account-switch"></i>
                    </h1>
                    <h6 className={styles.textWhite}>
                      Gerar <br />
                      certificados
                    </h6>
                  </div>
                </div>
              </a>
            </div>
            <div className={styles.colMd2}>
              <a onClick={handleImportAssignments}>
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} ${styles.bgInfo} ${styles.textCenter}`}>
                    <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                      <i className="mdi mdi-crosshairs"></i>
                    </h1>
                    <h6 className={styles.textWhite}>
                      Importar <br />
                      atribuições
                    </h6>
                  </div>
                </div>
              </a>
            </div>
            <div className={styles.colMd2}>
              <a onClick={handleImportExemptions}>
                <div className={`${styles.card} ${styles.cardHover}`}>
                  <div className={`${styles.box} ${styles.bgSuccess} ${styles.textCenter}`}>
                    <h1 className={`${styles.fontLight} ${styles.textWhite}`}>
                      <i className="mdi mdi-cash"></i>
                    </h1>
                    <h6 className={styles.textWhite}>
                      Importar <br />
                      participantes isentos
                    </h6>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
        {routines.length > 0 && (
          <div className={styles.tabGroup}>
            <div className={styles.tabHeader}>
              <button 
                className={`${styles.tab} ${tabIndex === 0 ? styles.tabActive : ''}`}
                onClick={() => setTabIndex(0)}
              >
                Rotinas solicitadas
              </button>
            </div>
            {tabIndex === 0 && routines.length > 0 && !loading && (
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
                    <div className={`${styles.col1} ${styles.containerButtons} ${styles.justifyEndSafe}`}>
                      <div className={styles.buttonSave}>
                        <button
                          onClick={search}
                          disabled={loading}
                          className="btn btn-secondary btn-md"
                          type="button"
                        >
                          {loading ? "Aguarde..." : "Buscar"}
                        </button>
                      </div>
                      <div className={styles.buttonSave}>
                        <button
                          onClick={() => loadRoutinesByEvent(selectedEvent)}
                          disabled={loading}
                          className="btn btn-info btn-md"
                          type="button"
                        >
                          {loading ? "Atualizando..." : "Atualizar Tabela"}
                        </button>
                      </div>
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
                          <th className={styles.center}>Tipo de rotina</th>
                          <th className={styles.center}>Criador</th>
                          <th className={styles.center}>Iniciada</th>
                          <th className={styles.center}>Finalizada</th>
                          <th className={styles.center}>Status</th>
                          <th className={styles.center}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminDataSource.map((element, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{element.type}</td>
                            <td>{element.created_by.name || ''}</td>
                            <td>{formatDate(element.created_at, 'dd/MM/yyyy HH:mm')}</td>
                            <td>{formatDate(element.finished_at, 'dd/MM/yyyy HH:mm')}</td>
                            <td>
                              <span
                                style={{
                                  backgroundColor:
                                    element.status === 'Criada'
                                      ? '#fff3cd'
                                      : element.status === 'Em processamento'
                                      ? '#e9ecef'
                                      : element.status === 'Erro'
                                      ? '#f8d7da'
                                      : element.status === 'Sucesso'
                                      ? '#d4edda'
                                      : '',
                                  color:
                                    element.status === 'Criada'
                                      ? '#856404'
                                      : element.status === 'Em processamento'
                                      ? '#383d41'
                                      : element.status === 'Erro'
                                      ? '#721c24'
                                      : element.status === 'Sucesso'
                                      ? '#155724'
                                      : '',
                                  padding: '4px 8px',
                                  borderRadius: '4px'
                                }}
                              >
                                {element.status}
                              </span>
                            </td>
                            <td
                              onClick={() =>
                                element.status !== 'Criada' &&
                                element.status !== 'Em processamento'
                                  ? openRoutineDetailsDialog(element)
                                  : null
                              }
                            >
                              <h3>
                                <i
                                  title="Visualizar detalhes"
                                  className="mdi mdi-eye"
                                  style={{
                                    cursor:
                                      element.status !== 'Criada' &&
                                      element.status !== 'Em processamento'
                                        ? 'pointer'
                                        : 'not-allowed',
                                    opacity:
                                      element.status !== 'Criada' &&
                                      element.status !== 'Em processamento'
                                        ? 1
                                        : 0.5
                                  }}
                                />
                                <span className={styles.subtitle}> Detalhes</span>
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
                      totalItems={totalItems}
                    />
                  </div>
                </div>
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
    )}
  </div>
</div>