<div className={`${styles.card} ${styles.textCenter} ${styles.mt0}`}>
  <div
    className={`${styles.cardBody} ${styles.dFlex} ${styles.textCenter} ${styles.justifyContentCenter}`}
    style={{ height: 60, userSelect: 'none', flexDirection: 'column' }}
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
      <div className={`${styles.row} ${styles.justifyContentAround}`}>
        {labels.map((lbl, i) => (
          <div key={i} className={styles.pt10}>
            <h3 className={`${styles.mb0} ${styles.fontWeightBold}`}>
              {chart.data[i]}
            </h3>
            <span className={styles.textMuted}>
              {chart.columns?.[i] ?? lbl}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>