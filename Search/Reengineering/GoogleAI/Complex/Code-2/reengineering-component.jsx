<>
  {questions.length > 0 && (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <div className="container-fluid">
          {loading ? (
            <div className={styles.spinnerContainer}>
              <CircularProgress color="primary" size={40} />
            </div>
          ) : (
            <>
              <div className={styles.controlsContainer}>
                <div className={styles.formContainer}>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    className={styles.formControl}
                    placeholder=" "
                    onChange={(e) => applyFilterQuestion(e.target.value)}
                  />
                  <label htmlFor="search">Digite sua busca</label>
                </div>
                <div className={styles.buttonSave}>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-md"
                    onClick={openQuestionSaveDialog}
                    disabled={loading}
                  >
                    Adicionar pergunta
                  </button>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.responsiveTable}>
                  <thead>
                    <tr>
                      {/* Implement sorting logic on header click */}
                      <th className={styles.headerCell}>Descrição</th>
                      <th className={styles.headerCell}>Título</th>
                      <th className={styles.headerCell}>Peso</th>
                      <th
                        className={`${styles.headerCell} ${styles.textAlignRight}`}
                      >
                        Tipo
                      </th>
                      <th className={styles.headerCell}></th>
                      <th className={styles.headerCell}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((element) => (
                      <tr key={element.id}>
                        <td className={styles.descriptionCell}>
                          {element.description ? (
                            <span>{element.description}</span>
                          ) : (
                            <span style={{ opacity: 0.6 }}>
                              Descrição não disponível
                            </span>
                          )}
                        </td>
                        <td>{element.title}</td>
                        <td className={styles.descriptionCell}>
                          {element.weight ? (
                            <span>{element.weight}</span>
                          ) : (
                            <span style={{ opacity: 0.6 }}>
                              Peso não disponível
                            </span>
                          )}
                        </td>
                        <td className={styles.textAlignRight}>
                          {element.type === 'text'
                            ? 'Texto'
                            : element.type === 'long_text'
                            ? 'Texto Longo'
                            : element.type === '0_to_5'
                            ? 'Seleção (0 a 5)'
                            : element.type === '0_to_100'
                            ? 'Números (0 a 100)'
                            : element.type}
                        </td>
                        <td
                          className={styles.actionCell}
                          onClick={() => navigateToEditQuestion(element)}
                        >
                          <h3 title="Editar">
                            <i className="mdi mdi-pencil"></i>
                            <span className={styles.subtitle}>Editar</span>
                          </h3>
                        </td>
                        <td
                          className={styles.actionCell}
                          onClick={() => openRemoveDialog(element)}
                        >
                          <h3 title="Deletar">
                            <i className="mdi mdi-delete"></i>
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
      </div>
    </div>
  )}
  {!loading && questions.length === 0 && (
    <div className={styles.noDataMessage}>
      Não existem perguntas cadastradas
    </div>
  )}
</>;
