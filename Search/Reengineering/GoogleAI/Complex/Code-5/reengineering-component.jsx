<div className={styles.dialogContent}>
  <button
    className={`${styles.closeButton} mdi mdi-close-circle`}
    onClick={onNoClick}
  ></button>
  <div className={styles.title}>
    <label>
      Selecione o arquivo com as {responseData.type} a serem importadas
    </label>
  </div>
  <form onSubmit={handleSubmit} className="form-horizontal">
    <div className="form-group row">
      <div className="col-md-12">
        <input
          type="file"
          className={`form-control ${
            errors.uploadAssignment ? 'is-invalid' : ''
          }`}
          id="uploadAssignment"
          onChange={onAssignmentModelFileChange}
          accept=".xls,.xlsx"
        />
        {errors.uploadAssignment && (
          <div className="invalid-feedback">
            <div>Necessário fornecer arquivo de atribuições.</div>
          </div>
        )}
      </div>
    </div>
    <div className="form-group row">
      <div className={styles.buttonContainer}>
        <div className={styles.buttonSave}>
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-danger btn-md"
            type="button"
          >
            {loading ? 'Aguarde...' : 'Cancelar'}
          </button>
        </div>
        <div className={styles.buttonSave}>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-info btn-md"
            type="button"
          >
            {loading ? 'Atualizando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  </form>
</div>;
