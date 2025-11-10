<div className={styles.pageWrapper}>
      <div className={styles.pageBreadcrumb}>
        <div className={styles.row}>
          <div className={`${styles.col12} ${styles.dFlex} ${styles.alignItemsCenter}`}>
            <h4 className={styles.pageTitle}>{pageTitle}</h4>
          </div>
        </div>
      </div>
      <div className={styles.containerFluid}>
        <div className={`${styles.row} ${styles.justifyContentEnd} ${styles.newButtonPadding}`}>
          <Button
            variant="contained"
            color="success"
            className={styles.hMargin}
            onClick={() => sendSubmissionResultByEmail(statusReview)}
          >
            Notificar por e-mail
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={downloading}
            className={styles.hMargin}
            onClick={() => downloadSubmissionsByApprovalStatus(statusReview)}
          >
            {downloading ? 'Aguarde...' : 'Baixar relatório'}
          </Button>
        </div>
        {loading && (
          <div>
            <CircularProgress size={40} color="primary" />
          </div>
        )}
        {!loading && submissions.length > 0 && (
          <div className={styles.checkProfiles}>
            <Card>
              <CardContent>
                {submissions.length > 5 && (
                  <div className={styles.formGroup}>
                    <TextField
                      label="Digite sua busca"
                      variant="outlined"
                      fullWidth
                      value={filter}
                      onChange={handleFilterChange}
                      className={styles.searchInput}
                    />
                  </div>
                )}
                <div className={styles.tableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Título</TableCell>
                        <TableCell>Área de Conhecimento</TableCell>
                        <TableCell>Autor(es)</TableCell>
                        <TableCell>Revisores</TableCell>
                        <TableCell>Detalhes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedSubmissions.map((element, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1 + page * rowsPerPage}</TableCell>
                          <TableCell>{element.title}</TableCell>
                          <TableCell>{element.knowledge_area}</TableCell>
                          <TableCell>
                            {element.authors.length === 1
                              ? element.authors[0]
                              : `${element.authors[0]} ...`}
                          </TableCell>
                          <TableCell>
                            {element.reviews.length > 0
                              ? element.reviews[0].appraisals[0].reviewer_name +
                                (element.reviews.length === 1 ? '' : ' ...')
                              : ''}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Detalhes">
                              <span
                                style={{ cursor: 'pointer' }}
                                onClick={() => openDetailsDialog(element)}
                              >
                                <FileOutlined />
                                <span className={styles.subtitle}> Detalhes</span>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredSubmissions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {!loading && submissions.length === 0 && (
          <div>
            {!statusReview ? (
              <div>Não existem trabalhos reprovados nesta trilha.</div>
            ) : (
              <div>Não existem trabalhos aprovados nesta trilha.</div>
            )}
          </div>
        )}
      </div>
    </div>