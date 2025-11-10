{questions.length > 0 && (
  <div className={styles.card}>
    <div className={`${styles.cardBody} ${styles.questionsContainer}`}>
      <div className={styles.containerFluid}>
        {loading ? (
          <span className={styles.spinnerWrapper}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: 40, color: '#1976d2' }} />
          </span>
        ) : (
          <>
            <div
              className={`${styles.containerFluid} ${styles.col12} ${styles.row}`}
              style={{ justifyContent: 'space-between' }}
            >
              <div className={`${styles.col10} ${styles.formContainer}`}>
                <input
                  type="text"
                  id="search"
                  name="search"
                  className={`form-control ${styles.formQuestionContainer}`}
                  placeholder={submitted ? '' : ''}
                  onKeyUp={(e) => applyFilterQuestion(e.target.value)}
                />
                <label htmlFor="search">Digite sua busca</label>
              </div>
              <div className={styles.buttonSave}>
                <button
                  type="button"
                  className="btn btn-outline-info btn-md"
                  style={{ width: '100%', whiteSpace: 'normal', wordWrap: 'break-word' }}
                  onClick={openQuestionSaveDialog}
                  disabled={loading}
                >
                  Adicionar pergunta
                </button>
              </div>
            </div>
            <div
              className={`${styles.colSm12} ${styles.row} ${styles.topSpacing}`}
              style={{ width: '100%', overflowX: 'auto' }}
            >
              <table className={`${styles.responsiveTable} table`}>
                <thead>
                  <tr>
                    <th className={`${styles.headerColor} ${styles.textAlignLeft}`}>
                      Descrição
                    </th>
                    <th className={`${styles.headerColor} ${styles.textAlignLeft}`}>
                      Título
                    </th>
                    <th className={`${styles.headerColor} ${styles.textAlignLeft}`}>
                      Peso
                    </th>
                    <th className={`${styles.headerColor} ${styles.textAlignRight}`}>
                      Tipo
                    </th>
                    <th className={styles.headerColor}></th>
                    <th className={styles.headerColor}></th>
                  </tr>
                </thead>
                <tbody>
                  {dataSource.map((element, index) => (
                    <tr key={index}>
                      {/* Description column */}
                      <td className={`${styles.descriptionCell} ${styles.textAlignLeft}`}>
                        {!element.description ? (
                          <span style={{ opacity: 0.6 }}>
                            Descrição não disponível
                          </span>
                        ) : (
                          <span>{element.description}</span>
                        )}
                      </td>
                      
                      {/* Title Column */}
                      <td className={styles.textAlignLeft}>
                        {element.title}
                      </td>
                      
                      {/* Weight Column */}
                      <td className={`${styles.descriptionCell} ${styles.textAlignLeft}`}>
                        {!element.weight ? (
                          <span style={{ opacity: 0.6 }}>
                            Peso não disponível
                          </span>
                        ) : (
                          <span>{element.weight}</span>
                        )}
                      </td>
                      
                      {/* Type Column */}
                      <td className={styles.textAlignRight}>
                        {element.type === "text"
                          ? "Texto"
                          : element.type === "long_text"
                          ? "Texto Longo"
                          : element.type === "0_to_5"
                          ? "Seleção (0 a 5)"
                          : element.type === "0_to_100"
                          ? "Números (0 a 100)"
                          : element.type}
                      </td>
                      
                      {/* Edit Button */}
                      <td
                        className={styles.actionCell}
                        onClick={() => navigateToEditQuestion(element)}
                      >
                        <h3>
                          <i
                            title="Editar"
                            className="mdi mdi-pencil"
                            style={{ cursor: 'pointer' }}
                          />
                          <span className={styles.subtitle}>Editar</span>
                        </h3>
                      </td>
                      
                      {/* Delete Button */}
                      <td
                        className={styles.actionCell}
                        onClick={() => openRemoveDialog(element)}
                      >
                        <h3>
                          <i
                            title="Deletar"
                            className="mdi mdi-delete"
                            style={{ cursor: 'pointer', paddingRight: '0.3rem' }}
                          />
                          <span className={styles.subtitle}>Deletar</span>
                        </h3>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {questions.length <= 0 && !loading && (
        <div>Não existem perguntas cadastradas</div>
      )}
    </div>
  </div>
)}