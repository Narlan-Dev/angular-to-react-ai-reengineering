<>
  {questions.map((question) => {
    const isInvalid = submitted && errors[question._id];
    const error = errors[question._id];

    const renderInput = () => {
      switch (question.type) {
        case '0_to_5':
          return (
            <select
              className={`form-control col-sm-2 ${
                isInvalid ? 'is-invalid' : ''
              }`}
              value={formValues[question._id] || ''}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
            >
              <option value="" disabled>
                Selecione
              </option>
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
              className={`form-control col-sm-2 ${
                isInvalid ? 'is-invalid' : ''
              }`}
              value={formValues[question._id] || ''}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
              placeholder={question.description}
              min="0"
              max="100"
            />
          );
        case 'long_text':
          return (
            <textarea
              rows="3"
              className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
              value={formValues[question._id] || ''}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
              placeholder={question.description}
            ></textarea>
          );
        default:
          return (
            <input
              type="text"
              className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
              value={formValues[question._id] || ''}
              onChange={(e) => handleInputChange(question._id, e.target.value)}
              placeholder={question.description}
            />
          );
      }
    };

    return (
      <div key={question._id} className="form-group row">
        <label className="col-sm-3 text-right control-label col-form-label">
          {question.title}
        </label>
        <div className="col-sm-9">
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              {renderInput()}
              {question.description &&
                (question.type === '0_to_5' ||
                  question.type === '0_to_100') && (
                  <div
                    className="ml-2 cursor-pointer"
                    title={question.description}
                    style={{ color: '#3e5569' }}
                  >
                    <i className="fas fa-question-circle"></i>
                  </div>
                )}
            </div>
            {isInvalid && (
              <div className="invalid-feedback d-block mt-1">
                {error?.type === 'required' && 'Esse campo é obrigatório'}
                {(error?.type === 'min' || error?.type === 'max') &&
                  'Valor inválido'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })}

  {questions[0]?.model === 'reviewer' && hasWeightQuestions() && (
    <div className="form-group row">
      <label className="col-sm-3 text-right control-label col-form-label">
        Total:
      </label>
      <div className="col-sm-1">
        <input type="text" className="form-control" value={total} readOnly />
      </div>
    </div>
  )}
</>;
