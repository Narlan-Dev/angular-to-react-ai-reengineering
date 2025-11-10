return (
  <div className={styles.pageWrapper}>
    <div className={styles.pageBreadcrumb}>
      <div className={styles.row}>
        <div className={styles.col12}>
          <h4 className={styles.pageTitle}>Rotinas</h4>
        </div>
      </div>
    </div>
    <div className="container-fluid">
      {isAdmin && (
        <div className={styles.adminContainer}>
          <div>
            <label>Escolha o evento</label>
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
              <div className={styles.routineTitle}>
                <label>Escolha o tipo de rotina</label>
              </div>
              <div className={`${styles.row} ${styles.routineCardsContainer}`}>
                <div className="col-md-2">
                  <a
                    onClick={handleAssignmentReviewers}
                    className={styles.cardLink}
                  >
                    <div className={`${styles.card} ${styles.cardHover}`}>
                      <div className={`${styles.box} ${styles.bgCyan}`}>
                        <h1 className={styles.icon}>
                          <i className="mdi mdi-crosshairs"></i>
                        </h1>
                        <h6 className={styles.cardText}>
                          Atribuição automática <br /> de revisores
                        </h6>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-2">
                  <a
                    onClick={handleGenerateCertificates}
                    className={styles.cardLink}
                  >
                    <div className={`${styles.card} ${styles.cardHover}`}>
                      <div className={`${styles.box} ${styles.bgWarning}`}>
                        <h1 className={styles.icon}>
                          <i className="mdi mdi-account-switch"></i>
                        </h1>
                        <h6 className={styles.cardText}>
                          Gerar <br /> certificados
                        </h6>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-2">
                  <a
                    onClick={handleImportAssignments}
                    className={styles.cardLink}
                  >
                    <div className={`${styles.card} ${styles.cardHover}`}>
                      <div className={`${styles.box} ${styles.bgInfo}`}>
                        <h1 className={styles.icon}>
                          <i className="mdi mdi-crosshairs"></i>
                        </h1>
                        <h6 className={styles.cardText}>
                          Importar <br /> atribuições
                        </h6>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-2">
                  <a
                    onClick={handleImportExemptions}
                    className={styles.cardLink}
                  >
                    <div className={`${styles.card} ${styles.cardHover}`}>
                      <div className={`${styles.box} ${styles.bgSuccess}`}>
                        <h1 className={styles.icon}>
                          <i className="mdi mdi-cash"></i>
                        </h1>
                        <h6 className={styles.cardText}>
                          Importar <br /> participantes isentos
                        </h6>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}

          {routines.length > 0 && (
            <Tabs
              value={tabIndex}
              onChange={(e, newValue) => setTabIndex(newValue)}
            >
              <Tab label="Rotinas solicitadas" />
            </Tabs>
          )}

          {tabIndex === 0 && !loading && routines.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <form onSubmit={search} className={styles.row}>
                  <div className="col-11">
                    <TextField
                      fullWidth
                      label="Digite sua busca"
                      variant="standard"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && search()}
                      error={!!searchError}
                      helperText={searchError}
                    />
                  </div>
                  <div className={`col-1 ${styles.containerButtons}`}>
                    <div className={styles.buttonSave}>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-secondary btn-md"
                      >
                        {loading ? 'Aguarde...' : 'Buscar'}
                      </button>
                    </div>
                    <div className={styles.buttonSave}>
                      <button
                        type="button"
                        onClick={() => loadRoutinesByEvent(selectedEvent)}
                        disabled={loading}
                        className="btn btn-info btn-md"
                      >
                        {loading ? 'Atualizando...' : 'Atualizar Tabela'}
                      </button>
                    </div>
                  </div>
                </form>

                <div className={styles.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Tipo de rotina</TableCell>
                        <TableCell>Criador</TableCell>
                        <TableCell>Iniciada</TableCell>
                        <TableCell>Finalizada</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRoutines.map((element, i) => (
                        <TableRow key={element.id}>
                          <TableCell>
                            {(currentPage - 1) * pageSize + i + 1}
                          </TableCell>
                          <TableCell>{element.type}</TableCell>
                          <TableCell>
                            {element.created_by?.name || ''}
                          </TableCell>
                          <TableCell>
                            {new Date(element.created_at).toLocaleString(
                              'pt-BR'
                            )}
                          </TableCell>
                          <TableCell>
                            {element.finished_at
                              ? new Date(element.finished_at).toLocaleString(
                                  'pt-BR'
                                )
                              : ''}
                          </TableCell>
                          <TableCell>
                            <span style={getStatusStyle(element.status)}>
                              {element.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div
                              onClick={() =>
                                isDetailsEnabled(element) &&
                                openRoutineDetailsDialog(element)
                              }
                              style={{
                                cursor: isDetailsEnabled(element)
                                  ? 'pointer'
                                  : 'not-allowed',
                                opacity: isDetailsEnabled(element) ? 1 : 0.5,
                              }}
                              title="Visualizar detalhes"
                            >
                              <h3>
                                <i className="mdi mdi-eye"></i>
                                <span className={styles.subtitle}>
                                  {' '}
                                  Detalhes
                                </span>
                              </h3>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className={styles.paginationContainer}>
                  <Pagination
                    count={Math.ceil(totalItems / pageSize)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                  />
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className={styles.spinnerContainer}>
              <CircularProgress color="primary" size={40} />
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
