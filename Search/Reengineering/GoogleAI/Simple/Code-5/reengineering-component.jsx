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
      <div className={styles.row}>
        {labels.map((label, i) => (
          <div key={i} className={styles.dataColumn}>
            <h3 className={styles.dataValue}>{chart.data[i]}</h3>
            <span className={styles.dataLabel}>
              {chart.columns[i] ?? label}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>;
