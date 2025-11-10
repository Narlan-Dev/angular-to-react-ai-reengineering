<div className={styles.dialogContent}>
  <button
    className={`${styles.closeButton} mdi mdi-close-circle`}
    onClick={onNoClick}
  ></button>
  <div className="container-fluid">
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className={styles.cardBody}>
          <h4 className={styles.title}>
            Pergunta para{' '}
            {responseData.model === 'submission'
              ? 'o autor da submissão'
              : 'os revisores'}
          </h4>
          <div className={`${styles.formGroup} ${styles.formGap}`}>
            <div
              className={`${styles.formContainer} ${
                formData.type !== '0_to_100' && formData.type !== '0_to_5'
                  ? styles.colSm10
                  : styles.colSm8
              }`}
            >
              <input
                type="text"
                id="title"
                name="title"
                className={`${styles.formControl} ${
                  submitted && errors.title ? styles.isInvalid : ''
                }`}
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={
                  submitted && errors.title
                    ? 'Necessário informar o título'
                    : ''
                }
              />
              <label htmlFor="title">Título</label>
            </div>

            {(formData.type === '0_to_100' || formData.type === '0_to_5') && (
              <div className={`${styles.formContainer} ${styles.colSm2}`}>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className={`${styles.formControl} ${
                    isWeightInvalid() ? styles.isInvalid : ''
                  }`}
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  placeholder={
                    isWeightInvalid() ? 'Necessário informar o peso' : ''
                  }
                  min="0"
                  max="100"
                />
                <label htmlFor="weight">Peso</label>
              </div>
            )}

            <div className={styles.colSm2}>
              <select
                className={`${styles.select2} ${styles.formControl}`}
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Tipo
                </option>
                {types.map((t, index) => (
                  <option key={index} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={`${styles.formContainer} ${styles.colSm12}`}>
              <textarea
                id="description"
                className={styles.formControl}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder=" "
              ></textarea>
              <label htmlFor="description">Descrição</label>
            </div>
          </div>

          <div className={`${styles.colSm12} ${styles.buttonContainer}`}>
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>;
