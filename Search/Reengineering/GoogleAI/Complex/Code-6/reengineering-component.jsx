const AdminView = () => (
  <div className={styles.adminContainer}>
    <div>
      <label>Escolha o evento</label>
    </div>
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

    {selectedEvent && (
      <>
        {selectedEvent.tracks.length > 0 ? (
          <>
            <div className={styles.trackTitle}>
              <label>Escolha a trilha do evento</label>
            </div>
            <div className={styles.tracksContainer}>
              {selectedEvent.tracks.map((t, i) => (
                <div
                  key={i}
                  className={`${styles.card} ${styles.cardHover} ${styles.trackCard}`}
                  style={{
                    backgroundColor:
                      t.color !== '#fff' && t.color !== '#ffffff'
                        ? t.color
                        : '#000',
                  }}
                  onClick={() => loadSubmissionsByTrack(t)}
                >
                  <div className={styles.box}>
                    <h1 className={styles.icon}>
                      <i className="mdi mdi-note-multiple"></i>
                    </h1>
                    <h6 className={styles.cardText}>{t.name}</h6>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyBlock}>
            Não existem trilhas cadastradas para prosseguir com a operação
          </div>
        )}
      </>
    )}

    {(submissionsAdmin.length > 0 || submissionsAdminForAdvisor.length > 0) && (
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        className={styles.tabs}
      >
        <Tab label="Submissões da trilha" />
        <Tab label="Minhas orientações" />
      </Tabs>
    )}

    {tabIndex === 0 && submissionsAdmin.length > 0 && !loading && (
      <div className={`${styles.card} ${styles.tableCard}`}>
        {/* Search and Table for Admin Submissions */}
      </div>
    )}
    {tabIndex === 1 && submissionsAdminForAdvisor.length > 0 && !loading && (
      <div className={`${styles.card} ${styles.tableCard}`}>
        {/* Search and Table for Advisor Submissions */}
      </div>
    )}

    {loading && (
      <div className={styles.emptyBlock}>
        <CircularProgress />
      </div>
    )}
    {!loading && submissionsAdmin.length === 0 && selectedEvent && (
      <div className={styles.emptyBlock}>Não existem submissões enviadas</div>
    )}
  </div>
);

const UserView = () => (
  <div>
    <div className={styles.userHeader}>
      <button
        type="button"
        className="btn btn-success btn-md"
        onClick={navigateToNewSubmission}
      >
        Nova submissão
      </button>
    </div>
    {submissions.length > 0 ? (
      <div className={styles.card}>
        <div className={styles.cardBody}>
          {/* User's submissions table */}
          <div className={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Evento</TableCell>
                  <TableCell>Trilha</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((element, i) => (
                  <TableRow key={element.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{element.title}</TableCell>
                    <TableCell>
                      {new Date(element.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{element.event_short_name}</TableCell>
                    <TableCell>{element.event_track_name}</TableCell>
                    <TableCell>{getSubmissionStatus(element.status)}</TableCell>
                    <TableCell>
                      {element.status === 'PENDING_CORRECTION' && (
                        <Tooltip title="Editar">
                          <h3
                            onClick={() => navigateToEditSubmission(element)}
                            className={styles.actionIcon}
                          >
                            <i className="mdi mdi-pencil"></i>
                            <span className={styles.subtitle}> Editar</span>
                          </h3>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      {element.advisorState !== 'advisor_feedback_approved' &&
                        !element.approved && (
                          <Tooltip title="Deletar">
                            <h3
                              onClick={() => openRemoveDialog(element)}
                              className={styles.actionIcon}
                            >
                              <i className="mdi mdi-delete"></i>
                              <span className={styles.subtitle}> Deletar</span>
                            </h3>
                          </Tooltip>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    ) : (
      !loading && (
        <div className={styles.emptyBlock}>Não existem submissões enviadas</div>
      )
    )}
    {loading && (
      <div className={styles.emptyBlock}>
        <CircularProgress />
      </div>
    )}
  </div>
);

return (
  <div className={styles.pageWrapper}>
    <div className={styles.pageBreadcrumb}>
      <div className={styles.row}>
        <div className={styles.col12}>
          <h4 className={styles.pageTitle}>Submissões</h4>
        </div>
      </div>
    </div>
    <div className="container-fluid">
      {isAdmin ? <AdminView /> : <UserView />}
    </div>
  </div>
);
