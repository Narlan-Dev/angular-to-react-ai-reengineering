<div className="{styles.matDialogContent}">
  <a
    className="{`mdi"
    mdi-close-circle
    ${styles.close}`}
    onClick="{onNoClick}"
  ></a>
  <div className="{styles.title}">{routine.event.name}</div>

  {routine.status === 'Erro' && (
  <div className="{styles.errorMessage}">
    <div className="{styles.roleLabel}">{routine.details.error}</div>
  </div>
  )} {routine.status !== 'Erro' && routine.type === 'Geração de certificados' &&
  (
  <div className="{styles.information}">
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Certificados Gerados
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.total}
      </div>
    </div>
    {routine.details.participate && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Participação no evento
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.participate}
      </div>
    </div>
    )} {routine.details.session && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Grupo de sessão
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.session}
      </div>
    </div>
    )} {routine.details.presentation && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Apresentação
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.presentation}
      </div>
    </div>
    )} {routine.details.revision && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Revisão
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.revision}
      </div>
    </div>
    )} {routine.details.revisionPresentation && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Revisão de apresentação
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.revisionPresentation}
      </div>
    </div>
    )}
  </div>
  )} {routine.status !== 'Erro' && routine.type === 'Importações' && (
  <div className="{styles.information}">
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Avaliadores importados
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.appraisers}/{routine.details.total_appraisers}
      </div>
    </div>
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Avaliadores não encontrados
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.appraisers_not_found}
      </div>
    </div>
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Atribuições importadas
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.assignments}/{routine.details.total_assignments}
      </div>
    </div>
    {routine.details.warnings && routine.details.warnings.length > 0 && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Avisos
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        <ul className="{styles.warningsList}">
          {routine.details.warnings.map((warning, i) => (
          <li key="{i}">{warning.message}</li>
          ))}
        </ul>
      </div>
    </div>
    )}
  </div>
  )} {routine.status !== 'Erro' && routine.type === 'Importação de isentos' && (
  <div className="{styles.information}">
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Isentos importados
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.cpf_exemptions}/{routine.details.total_cpf_exemptions}
      </div>
    </div>
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Isentos não encontrados
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.cpf_exemptions_not_found}
      </div>
    </div>
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Isentos repetidos
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.cpf_exemptions_repeated}
      </div>
    </div>
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Importações com sucesso
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details.success_rate}
      </div>
    </div>
    {routine.details.warnings && routine.details.warnings.length > 0 && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Avisos
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        <ul className="{styles.warningsList}">
          {routine.details.warnings.map((warning, i) => (
          <li key="{i}">{warning.message}</li>
          ))}
        </ul>
      </div>
    </div>
    )}
  </div>
  )} {routine.status !== 'Erro' && routine.type === 'Atribuição de revisores' &&
  (
  <div className="{styles.information}">
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Submissões com revisores atribuídos:
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {(routine.details?.submissionsReviewersSet?.length ?? 0)}/
        {(routine.details?.submissionsReviewersSet?.length ?? 0) +
        (routine.details?.submissionsNoReviewersSet?.length ?? 0)}
      </div>
    </div>
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Áreas de conhecimento sem revisores:
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details?.knowledgeAreaWithNoReviewer?.length ?? 0}
      </div>
    </div>
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Revisores com quantidade máxima de atribuições atingida:
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        {routine.details?.reviewerWithMaxReviews?.length ?? 0}
      </div>
    </div>
    {routine.details.warnings && routine.details.warnings.length > 0 && (
    <div className="{styles.row}">
      <div
        className="{`${styles.roleLabel}"
        ${styles.col4}
        ${styles.lineTitle}`}
      >
        Avisos
      </div>
      <div className="{`${styles.roleLabel}" ${styles.col8}`}>
        <ul className="{styles.warningsList}">
          {routine.details.warnings.map((warning, i) => (
          <li key="{i}">{warning}</li>
          ))}
        </ul>
      </div>
    </div>
    )}
  </div>
  )}
</div>
