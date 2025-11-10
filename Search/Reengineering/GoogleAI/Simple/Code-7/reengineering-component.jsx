<div className={styles.card}>
  <div className={styles.cardBody}>
    {chart.status.isEmpty ? (
      <div className={styles.message}>
        Não existem dados para o filtro atual
      </div>
    ) : chart.status.hasErrors ? (
      <div className={`${styles.message} ${styles.error}`}>
        Houve um erro ao obter os dados de
        <div className={styles.textLowercase}>{chart.label}</div>
      </div>
    ) : chart.status.fetching ? (
      <div className={styles.message}>
        <CircularProgress color="primary" size={40} />
      </div>
    ) : (
      <>
        <h5 className={styles.cardTitle}>{chart.label}</h5>
        <table className={`${styles.table} ${styles.tableSm}`}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th scope="col" className={styles.headerCell}></th>
              {chart.columns.map((col, index) => (
                <th key={index} scope="col" className={styles.headerCell}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className={styles.tableScrollContainer}>
          <table className={`${styles.table} ${styles.tableSm}`}>
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
</div>;
