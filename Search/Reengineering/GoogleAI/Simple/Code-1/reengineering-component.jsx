<div className={styles.dialogContainer}>
  <div className={styles.content}>{message}</div>
  <div className={styles.actions}>
    <button
      type="button"
      onClick={onConfirm}
      className={`${styles.btn} ${styles.btnPrimary}`}
    >
      Sim
    </button>
    <button
      type="button"
      onClick={onCancel}
      className={`${styles.btn} ${styles.btnDanger}`}
    >
      Não
    </button>
  </div>
</div>;
