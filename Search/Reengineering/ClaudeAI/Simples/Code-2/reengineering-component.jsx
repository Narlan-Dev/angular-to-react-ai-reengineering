<div className={styles.card}>
  <div
    className={`${styles.cardBody} ${styles.dFlex} ${styles.textCenter} ${styles.justifyContentCenter} ${styles.p8}`}
    style={{ height: 450, userSelect: 'none', flexDirection: 'column' }}
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
        <canvas id={chart.ctx || chart.label}></canvas>
      </>
    )}
  </div>
</div>