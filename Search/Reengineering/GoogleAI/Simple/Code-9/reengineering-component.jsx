<div className={styles.dialogContainer}>
  <div
    className={styles.content}
    dangerouslySetInnerHTML={{ __html: message }}
  />
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
      onClick={onNoClick}
      className={`${styles.btn} ${styles.btnDanger}`}
    >
      Não
    </button>
    <button
      type="button"
      onClick={onCancelClick}
      className={`${styles.btn} ${styles.btnSecondary}`}
    >
      Cancelar
    </button>
  </div>
</div>;
