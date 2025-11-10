{questions.map((question) => (
  <div key={question._id} className={`${styles.formGroup} ${styles.row}`}>
    <label className={`${styles.colSm3} ${styles.textRight} ${styles.controlLabel} ${styles.colFormLabel}`}>
      {question.title}
    </label>

    <div className={styles.colSm9}>
      <div className={`${styles.dFlex} ${styles.flexColumn}`}>
        {/* Container principal com flex-column para empilhar os elementos verticalmente */}
        <div className={`${styles.dFlex} ${styles.alignItemsCenter}`}>
          {(() => {
            switch (question.type) {
              case '0_to_5':
                return (
                  <select
                    className={`form-control ${styles.colSm2}`}
                    value={getQuestionControl(question._id)?.value || ''}
                    onChange={(e) => handleQuestionChange(question._id, e.target.value)}
                    className={`form-control ${styles.colSm2} ${
                      submitted && getQuestionControl(question._id)?.errors ? styles.isInvalid : ''
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                );

              case '0_to_100':
                return (
                  <input
                    type="number"
                    className={`form-control ${styles.colSm2} ${
                      submitted && getQuestionControl(question._id)?.errors ? styles.isInvalid : ''
                    }`}
                    value={getQuestionControl(question._id)?.value || ''}
                    onChange={(e) => handleQuestionChange(question._id, e.target.value)}
                    placeholder={question.description}
                    min="0"
                    max="100"
                  />
                );

              case 'long_text':
                return (
                  <textarea
                    rows={3}
                    className={`form-control ${
                      submitted && getQuestionControl(question._id)?.errors ? styles.isInvalid : ''
                    }`}
                    value={getQuestionControl(question._id)?.value || ''}
                    onChange={(e) => handleQuestionChange(question._id, e.target.value)}
                    placeholder={question.description}
                  />
                );

              default:
                return (
                  <input
                    type="text"
                    className={`form-control ${
                      submitted && getQuestionControl(question._id)?.errors ? styles.isInvalid : ''
                    }`}
                    value={getQuestionControl(question._id)?.value || ''}
                    onChange={(e) => handleQuestionChange(question._id, e.target.value)}
                    placeholder={question.description}
                  />
                );
            }
          })()}

          {/* Ícone de interrogação com tooltip */}
          {question.description &&
            (question.type === '0_to_5' || question.type === '0_to_100') && (
              <div
                className={`${styles.ml2} ${styles.cursorPointer}`}
                title={question.description}
                style={{ color: '#3e5569' }}
              >
                <i className="fas fa-question-circle"></i>
              </div>
            )}
        </div>

        {/* Mensagens de erro agora abaixo do campo */}
        {submitted && getQuestionControl(question._id)?.invalid && (
          <div className={`${styles.invalidFeedback} ${styles.dBlock} ${styles.mt1}`}>
            {getQuestionControl(question._id)?.errors?.required && (
              <div>Esse campo é obrigatório</div>
            )}
            {(getQuestionControl(question._id)?.errors?.min ||
              getQuestionControl(question._id)?.errors?.max) && (
              <div>Valor inválido</div>
            )}
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