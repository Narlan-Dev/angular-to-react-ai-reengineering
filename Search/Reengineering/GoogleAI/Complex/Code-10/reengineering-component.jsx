return (
  <div className="page-wrapper">
    <div className="page-breadcrumb">
      <div className="row">
        <div className="col-12 d-flex no-block align-items-center">
          {statusReview ? (
            <h4 className="page-title">Trabalhos aprovados - {track.name}</h4>
          ) : (
            <h4 className="page-title">Trabalhos reprovados - {track.name}</h4>
          )}
        </div>
      </div>
    </div>
    <div className="container-fluid">
      <div className={`${styles.row} ${styles.buttonContainer}`}>
        <button
          onClick={() => sendSubmissionResultByEmail(statusReview)}
          className="btn btn-success btn-md h-margin"
          type="button"
        >
          Notificar por e-mail
        </button>
        <button
          onClick={() => downloadSubmissionsByApprovalStatus(statusReview)}
          disabled={downloading}
          className="btn btn-primary btn-md"
          type="button"
        >
          {downloading ? 'Aguarde...' : 'Baixar relatório'}
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress color="primary" size={40} />
        </div>
      ) : submissions.length > 0 ? (
        <div className={styles.checkProfiles}>
          <div className="card">
            <div className="card-body">
              {submissions.length > 5 && (
                <TextField
                  fullWidth
                  label="Digite sua busca"
                  variant="standard"
                  onChange={(e) => applyFilter(e.target.value)}
                  className={styles.searchInput}
                />
              )}

              <div className={styles.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Área de Conhecimento</TableCell>
                      <TableCell>Autor(es)</TableCell>
                      <TableCell>Revisores</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataSource.map((element, i) => (
                      <TableRow key={element.id || i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{element.title}</TableCell>
                        <TableCell>{element.knowledge_area}</TableCell>
                        <TableCell>
                          {element.authors.length > 1
                            ? `${element.authors[0]} ...`
                            : element.authors}
                        </TableCell>
                        <TableCell>
                          {element.reviews.length > 1
                            ? `${
                                element.reviews[0]?.appraisals[0]
                                  ?.reviewer_name || ''
                              } ...`
                            : element.reviews[0]?.appraisals[0]
                                ?.reviewer_name || ''}
                        </TableCell>
                        <TableCell
                          onClick={() => openDetailsDialog(element)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Tooltip title="Detalhes">
                            <div className={styles.detailsCell}>
                              <i className="mdi mdi-file-outline"></i>
                              <span className={styles.subtitle}> Detalhes</span>
                            </div>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                component="div"
                count={submissions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                showFirstButton
                showLastButton
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.noDataMessage}>
          {statusReview
            ? 'Não existem trabalhos aprovados nesta trilha.'
            : 'Não existem trabalhos reprovados nesta trilha.'}
        </div>
      )}
    </div>
  </div>
);
