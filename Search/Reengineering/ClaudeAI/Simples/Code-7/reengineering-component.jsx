<div className={styles.card}>
  <div
    className={`${styles.cardBody} ${styles.dFlex} ${styles.textCenter} ${styles.justifyContentCenter}`}
    style={{ minHeight: 350, userSelect: 'none', flexDirection: 'column' }}
  >
    {chart.status.isEmpty ? (
      <div className={styles.myAuto}>
        Não existem dados para o filtro atual
      </div>
    ) : chart.status.hasErrors ? (
      <div className={styles.myAuto} style={{ color: 'red' }}>
        Houve um erro ao obter os dados de
        <div className={styles.textLowercase}>{chart.label}</div>
        {/* TODO: Adicione um botão de tentar novamente */}
      </div>
    ) : chart.status.fetching ? (
      <div className={styles.myAuto} style={{ color: 'red' }}>
        <span className={styles.spinnerWrapper}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
        </span>
      </div>
    ) : (
      <>
        <h5 className={styles.cardTitle}>{chart.label}</h5>
        <table className="table table-sm">
          <thead>
            <tr className={`${styles.dFlex} ${styles.justifyContentAround}`}>
              <th scope="col" className={styles.w100}></th>
              {chart.columns.map((col, idx) => (
                <th key={idx} scope="col" className={styles.w100}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div style={{ width: '100%', overflow: 'auto', maxHeight: 300 }}>
          <table className="table table-sm">
            <tbody>
              {chart.data.map((dt, i) => (
                <tr key={i}>
                  <th scope="row">{i}</th>
                  <td>{dt.name}</td>
                  <td>{dt.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
</div>