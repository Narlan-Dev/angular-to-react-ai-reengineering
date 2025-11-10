<div
  className="{styles.content}"
  dangerouslySetInnerHTML="{{"
  __html:
  message
  }}
/>
<button type="button" onClick="{confirm}" className="btn btn-primary">
  Sim
</button>
<button type="button" onClick="{onNoClick}" className="btn btn-danger">
  Não
</button>
<button type="button" onClick="{cancelClick}" className="btn btn-secondary">
  Cancelar
</button>
