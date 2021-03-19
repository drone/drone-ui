import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from 'components/shared/button';

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
  const handleSubmitMiddleware = (event) => {
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
    <form className={cx('deployment-form')}>
      <div className={cx('deployment-form-row')}>
        <span>Type</span>
        <div className={cx('deployment-form-radio-group')}>
          <div className={cx('deployment-form-radio')}>
            <input
              id="promote"
              type="radio"
              value="promote"
              checked={state.action === 'promote'}
              onChange={handleDeploymentChange('action')}
            />
            <label htmlFor="promote">Promote</label>
          </div>
          <div className={cx('deployment-form-radio')}>
            <input
              id="rollback"
              type="radio"
              value="rollback"
              checked={state.action === 'rollback'}
              onChange={handleDeploymentChange('action')}
            />
            <label htmlFor="rollback">Rollback</label>
          </div>
        </div>
      </div>
      <div>
        <div className={cx('deployment-form-row')}>
          <span>Target</span>
          <input type="text" placeholder="production" value={state.target} onChange={handleDeploymentChange('target')} />
        </div>
        <div className={cx('deployment-form-row')}>
          <span>Parameters</span>
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
            <input type="text" placeholder="key" value={parameterState.key} onChange={handleParameterChange('key')} />
            <input type="text" placeholder="value" value={parameterState.value} onChange={handleParameterChange('value')} />
            <Button type="button" onClick={handleAddParameter}>+ Add</Button>
          </div>
        </div>
        <div className={cx('deployment-form-controls')}>
          <Button type="button" onClick={handleSubmitMiddleware}>Deploy</Button>
          <Button type="button" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </form>
  );
};

DeploymentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default DeploymentForm;
