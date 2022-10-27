import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useState,
} from 'react';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';

import css from './new-build-form.module.scss';

const cx = classNames.bind(css);

const NewBuildForm = ({ handleSubmit, handleCancel }) => {
  const [state, setState] = useState({
    target: '',
    commit: '',
    parameters: [],
  });
  const [parameterState, setParameterState] = useState({
    key: '',
    value: '',
  });
  const handleAddParameter = () => {
    if (parameterState.key && parameterState.value) {
      setState(
        (prev) => ({
          ...prev,
          parameters: [...prev.parameters, { ...parameterState, id: Date.now() }],
        }),
      );
      setParameterState({ key: '', value: '' });
    }
  };

  const handleRemoveParameter = (id) => () => setState(
    (prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }),
  );

  const handleParameterChange = (field) => (event) => {
    setParameterState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
  };
  const handleSubmitMiddleware = (event) => {
    event.preventDefault();
    handleSubmit(state);
    handleCancel();
  };

  const handleFieldChange = (field) => (event) => {
    setState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
  };
  return (
    <Form className={cx('new-build-form')}>
      <FormSection className={cx('new-build-form-column')}>
        <Field.Input
          label="Branch"
          placeholder="<default branch name>"
          value={state.target}
          name="branch"
          onChange={handleFieldChange('target')}
        />
      </FormSection>
      <FormSection title="Parameters" className={cx('new-build-form-column')}>
        {state.parameters.length ? (
          <div className={cx('new-build-form-parameters-list')}>
            {state.parameters.map(({ key, value, id }) => (
              <div className={cx('new-build-form-parameters')} key={id}>
                <Field.Input
                  value={key}
                  name={key}
                  readOnly
                />
                <Field.Input
                  name={value}
                  value={value}
                  readOnly
                />
                <Button theme="plain" type="button" onClick={handleRemoveParameter(id)}>Remove</Button>
              </div>
            ))}
          </div>
        ) : null}
        <div className={cx('new-build-form-parameters-fields')}>
          <Field.Input
            name="newKey"
            placeholder="key"
            value={parameterState.key}
            onChange={handleParameterChange('key')}
          />
          <Field.Input
            name="newVal"
            placeholder="value"
            value={parameterState.value}
            onChange={handleParameterChange('value')}
          />
          <Button theme="plain" type="button" onClick={handleAddParameter}>+ Add</Button>
        </div>
      </FormSection>
      <FormSection className={cx('new-build-form-controls')}>
        <Button theme="primary" type="submit" onClick={handleSubmitMiddleware}>Create</Button>
        <Button theme="primary" type="button" onClick={handleCancel}>Cancel</Button>
      </FormSection>
    </Form>
  );
};

NewBuildForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default NewBuildForm;
