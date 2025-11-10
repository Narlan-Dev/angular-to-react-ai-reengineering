<div className={styles.pageWrapper}>
  <div className={styles.pageBreadcrumb}>
    <div className={styles.row}>
      <div className={`${styles.col12} ${styles.dFlex} ${styles.alignItemsCenter}`}>
        {statusReview ? (
          <h4 className={styles.pageTitle}>Trabalhos aprovados - {track.name}</h4>
        ) : (
          <h4 className={styles.pageTitle}>Trabalhos reprovados - {track.name}</h4>
        )}
      </div>
    </div>
  </div>
  <div className={styles.containerFluid}>
    <div className={`${styles.row} ${styles.justifyContentEnd} ${styles.hPadding} ${styles.newButtonPadding}`}>
      <button 
        onClick={() => sendSubmissionResultByEmail(statusReview)} 
        className={`btn btn-success btn-md ${styles.hMargin}`} 
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
    
    {loading && (
      <span className={styles.spinnerWrapper}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
      </span>
    )}
    
    {submissions.length > 0 && !loading && (
      <div className={styles.checkProfiles}>
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
                    <th>Área de Conhecimento</th>
                    <th>Autor(es)</th>
                    <th>Revisores</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dataSource.map((element, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{element.title}</td>
                      <td>{element.knowledge_area}</td>
                      <td>
                        {element.authors.length <= 1 ? (
                          <div>{element.authors}</div>
                        ) : (
                          <div>{element.authors[0]} ....</div>
                        )}
                      </td>
                      <td>
                        {element.reviews.length <= 1 ? (
                          <div>
                            {element.reviews.length > 0 
                              ? element.reviews[0].appraisals[0].reviewer_name 
                              : ''}
                          </div>
                        ) : (
                          <div>
                            {element.reviews.length > 0 
                              ? element.reviews[0].appraisals[0].reviewer_name 
                              : ''} ...
                          </div>
                        )}
                      </td>
                      <td onClick={() => openDetailsDialog(element)}>
                        <h3>
                          <i
                            title="Detalhes"
                            className="mdi mdi-file-outline"
                            style={{ cursor: 'pointer' }}
                          />
                          <span className={styles.subtitle}> Detalhes</span>
                        </h3>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginator 
              pageSize={10} 
              showFirstLastButtons={true}
              totalItems={submissions.length}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    )}
    
    {submissions.length <= 0 && !loading && (
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