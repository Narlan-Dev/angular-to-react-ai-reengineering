<div className={styles.dialogContent}>
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
          className={`form-control ${errors.uploadAssignment ? styles.isInvalid : ''}`}
          id="uploadAssignment"
          accept=".xls,.xlsx"
          onChange={onAssignmentModelFileChange}
        />
        {errors.uploadAssignment && (
          <div className={styles.invalidFeedback}>
            <div>Necessário fornecer arquivo de atribuições.</div>
          </div>
        )}
      </div>
    </div>
    <div className={`${styles.formGroup} ${styles.row}`}>
      <div className={`${styles.colMd12} ${styles.row}`} style={{ justifyContent: 'end', gap: '1rem' }}>
        <div className={styles.buttonSave}>
          <button
            type="button"
            className="btn btn-danger btn-md"
            onClick={onCancel}
            disabled={loading}
          >
            {loading ? 'Aguarde...' : 'Cancelar'}
          </button>
        </div>
        <div className={styles.buttonSave}>
          <button
            type="button"
            className="btn btn-info btn-md"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  </form>
</div>