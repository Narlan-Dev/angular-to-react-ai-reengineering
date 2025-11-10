{questions.map((question) => (
  <div className={`${styles.formGroup} ${styles.row}`} key={question._id}>
    <label className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>
      {question.title}
    </label>
    <div className={styles.colSm9}>
      <div className={`${styles.dFlex} ${styles.flexColumn}`}>
        <div className={`${styles.dFlex} ${styles.alignItemsCenter}`}>
          {/* Renderização condicional do campo conforme o tipo da questão */}
          {(() => {
            switch (question.type) {
              case '0_to_5':
                return (
                  <select
                    className={`form-control ${styles.colSm2} ${submitted && errors[question._id] ? styles.isInvalid : ''}`}
                    value={formValues[question._id] ?? ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                );
              case '0_to_100':
                return (
                  <input
                    type="number"
                    className={`form-control ${styles.colSm2} ${submitted && errors[question._id] ? styles.isInvalid : ''}`}
                    placeholder={question.description}
                    min={0}
                    max={100}
                    value={formValues[question._id] ?? ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  />
                );
              case 'long_text':
                return (
                  <textarea
                    rows={3}
                    className={`form-control ${submitted && errors[question._id] ? styles.isInvalid : ''}`}
                    placeholder={question.description}
                    value={formValues[question._id] ?? ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  />
                );
              default:
                return (
                  <input
                    type="text"
                    className={`form-control ${submitted && errors[question._id] ? styles.isInvalid : ''}`}
                    placeholder={question.description}
                    value={formValues[question._id] ?? ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                  />
                );
            }
          })()}

          {/* Tooltip de descrição */}
          {question.description &&
            (question.type === '0_to_5' || question.type === '0_to_100') && (
              <span
                className={`${styles.ml2} ${styles.cursorPointer}`}
                title={question.description}
                style={{ color: '#3e5569' }}
              >
                <i className="fas fa-question-circle"></i>
              </span>
            )}
        </div>

        {/* Mensagens de erro */}
        {submitted && errors[question._id] && (
          <div className={`${styles.invalidFeedback} ${styles.dBlock} ${styles.mt1}`}>
            {errors[question._id].required && <div>Esse campo é obrigatório</div>}
            {(errors[question._id].min || errors[question._id].max) && <div>Valor inválido</div>}
          </div>
        )}
      </div>
    </div>
  </div>
))}

{questions[0]?.model === 'reviewer' && hasWeightQuestions() && (
  <div className={`${styles.formGroup} ${styles.row}`}>
    <label className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>
      Total:
    </label>
    <div className={styles.colSm1}>
      <input type="text" className="form-control" value={total} readOnly />
    </div>
  </div>
)}