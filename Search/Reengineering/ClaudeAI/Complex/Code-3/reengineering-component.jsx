<div className={styles.matDialogContent}>
  <a className={`mdi mdi-close-circle ${styles.close}`} onClick={onNoClick}></a>
  <div className={styles.containerFluid}>
    <div className={styles.card}>
      <form className={styles.formHorizontal} onSubmit={handleSubmit}>
        <div className={`${styles.cardBody} ${styles.paddingNull}`}>
          <h4 className={styles.title}>
            Pergunta para
            {responseData.model === "submission"
              ? " o autor da submissão"
              : " os revisores"}
          </h4>
          <div
            className={`${styles.formGroup} ${styles.row} ${styles.dFlex} ${styles.alignItemsCenter} ${styles.justifyContentBetween} ${styles.formGap}`}
          >
            <div
              className={`${
                formValues.type !== '0_to_100' && formValues.type !== '0_to_5'
                  ? styles.colSm10
                  : styles.colSm8
              } ${styles.formContainer}`}
            >
              <input
                type="text"
                id="title"
                name="title"
                className={`form-control ${styles.formQuestionContainer} ${
                  submitted && errors.title ? styles.isInvalid : ''
                }`}
                value={formValues.title}
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
            {(formValues.type === '0_to_100' || formValues.type === '0_to_5') && (
              <div className={`${styles.colSm2} ${styles.formContainer}`}>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className={`form-control ${styles.formQuestionContainer} ${
                    isWeightInvalid() ? styles.isInvalid : ''
                  }`}
                  value={formValues.weight}
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
                className={`select2 form-control select2-hidden-accessible font-big ${styles.formQuestionContainer}`}
                style={{ width: '100%', height: 36 }}
                name="type"
                value={formValues.type}
                onChange={handleChange}
                aria-placeholder="Tipo"
              >
                <option value="" disabled>Tipo</option>
                {types.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            className={`${styles.formGroup} ${styles.row} ${styles.dFlex} ${styles.alignItemsCenter} ${styles.justifyContentBetween}`}
          >
            <div className={`${styles.colSm12} ${styles.formContainer}`}>
              <textarea
                className="form-control"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                rows={5}
                placeholder=""
              />
              <label htmlFor="description">Descrição</label>
            </div>
          </div>
          <div className={`${styles.colSm12} ${styles.dFlex} ${styles.justifyContentEnd}`}>
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>