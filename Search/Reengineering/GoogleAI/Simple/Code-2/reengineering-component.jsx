<div className={styles.card}>
  <div className={styles.cardBody}>
    {chart.status.isEmpty ? (
      <div className={styles.message}>
        Não existem dados para o filtro atual
      </div>
    ) : chart.status.hasErrors ? (
      <div className={`${styles.message} ${styles.error}`}>
        Houve um erro ao obter os dados de
        <div className={styles.chartLabelLower}>{chart.label}</div>
      </div>
    ) : chart.status.fetching ? (
      <div className={styles.message}>
        <CircularProgress color="primary" size={40} />
      </div>
    ) : (
      <>
        <h5 className={styles.cardTitle}>{chart.label}</h5>
        <canvas id={chart.ctx || chart.label}></canvas>
      </>
    )}
  </div>
</div>;
