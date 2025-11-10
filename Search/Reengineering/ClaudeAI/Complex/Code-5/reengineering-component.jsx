<div className={styles.matDialogContent}>
  <a className={`mdi mdi-close-circle ${styles.close}`} onClick={onNoClick}></a>
  <div className={styles.title}>
    <label>
      Selecione o arquivo com as {responseData.type} a serem importadas
    </label>
  </div>
  <form className={styles.formHorizontal} onSubmit={handleSubmit}>
    <div className={`${styles.formGroup} ${styles.row}`}>
      <div className={styles.colMd12}>
        <input
          type="file"
          className={`form-control ${
            errors.uploadAssignment ? styles.isInvalid : ''
          }`}
          id="uploadAssignment"
          onChange={onAssignmentModelFileChange}
          accept=".xls,.xlsx"
        />
        {errors.uploadAssignment && (
          <div className={styles.invalidFeedback}>
            <div>Necessário fornecer arquivo de atribuições.</div>
          </div>
        )}
      </div>
    </div>
    <div className={`${styles.formGroup} ${styles.row}`}>
      <div
        className={`${styles.colMd12} ${styles.row}`}
        style={{ justifyContent: 'end', gap: '1rem' }}
      >
        <div className={styles.buttonSave}>
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-danger btn-md"
            type="button"
          >
            {loading ? "Aguarde..." : "Cancelar"}
          </button>
        </div>
        <div className={styles.buttonSave}>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-info btn-md"
            type="button"
          >
            {loading ? "Atualizando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  </form>
</div>