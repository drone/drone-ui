import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';

import css from './deployment-form.module.scss';

const cx = classNames.bind(css);

const DeploymentForm = ({ handleSubmit, handleCancel }) => {
  const [state, setState] = useState({
    action: 'promote',
    target: '',
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
  const handleSubmitMiddleware = () => {
    handleSubmit(state);
    handleCancel();
  };

  const handleDeploymentChange = (field) => (event) => {
    switch (field) {
      case 'action':
        setState((prev) => ({ ...prev, [field]: event.target.value }));
        break;
      case 'target':
        setState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
        break;
      default:
    }
  };
  return (
    <Form className={cx('deployment-form')}>
      <FormSection
        title="Type"
        className={cx('deployment-form-row')}
      >
        <div className={cx('deployment-form-radio-group')}>
          <Field.Radio
            id="promote"
            name="promote"
            label="Promote"
            value="promote"
            checked={state.action === 'promote'}
            onChange={handleDeploymentChange('action')}
          />
          <Field.Radio
            id="rollback"
            name="rollback"
            label="Rollback"
            value="rollback"
            checked={state.action === 'rollback'}
            onChange={handleDeploymentChange('action')}
          />
        </div>
      </FormSection>
      <FormSection
        className={cx('deployment-form-row')}
        title="Target"
      >
        <Field.Input
          autoFocus="true"
          name="production"
          placeholder="production"
          value={state.target}
          onChange={handleDeploymentChange('target')}
        />
      </FormSection>
      <FormSection title="Parameters" className={cx('deployment-form-row')}>
        {state.parameters.length ? (
          <div className={cx('deployment-form-parameters-list')}>
            {state.parameters.map(({ key, id }) => (
              <div className={cx('deployment-form-parameters')} key={id}>
                <span type="text" placeholder="key">{key}</span>
                <Button type="button" onClick={handleRemoveParameter(id)}>Remove</Button>
              </div>
            ))}
          </div>
        ) : null}
        <div className={cx('deployment-form-parameters-fields')}>
          <Field.Input
            placeholder="key"
            name="key"
            value={parameterState.key}
            onChange={handleParameterChange('key')}
          />
          <Field.Input
            placeholder="value"
            name="value"
            value={parameterState.value}
            onChange={handleParameterChange('value')}
          />
          <Button onClick={handleAddParameter}>+ Add</Button>
        </div>
      </FormSection>
      <FormSection className={cx('deployment-form-controls')}>
        <Button type="button" onClick={handleSubmitMiddleware}>Deploy</Button>
        <Button type="button" onClick={handleCancel}>Cancel</Button>
      </FormSection>
    </Form>
  );
};

DeploymentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default DeploymentForm;
