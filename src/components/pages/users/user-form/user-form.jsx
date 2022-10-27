import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import { ReactComponent as NotAllowedIcon } from 'svg/not-allowed.svg';

import css from './user-form.module.scss';

const cx = classNames.bind(css);

const EditUserForm = ({
  initialValues, handleSubmit, handleDelete, handleCancel,
}) => {
  const [state, setState] = useState(initialValues);

  const handleSubmitMiddleware = () => {
    handleSubmit(state);
    handleCancel();
  };

  const handleDeleteMiddleware = () => {
    handleDelete(state.login);
    handleCancel();
  };

  const handleFieldChange = (field) => (event) => {
    setState((prev) => ({ ...prev, [field]: event.target.checked }));
  };
  return (
    <Form className={cx('new-user-form')}>
      <FormSection className={cx('new-user-form-column')}>
        <Field.Checkbox
          label="Admin User"
          name="admin"
          checked={state.admin}
          onChange={handleFieldChange('admin')}
        />
      </FormSection>
      <FormSection className={cx('new-user-form-column')}>
        <Field.Checkbox
          label="Machine User"
          name="machine"
          checked={state.machine}
          disabled
          onChange={handleFieldChange('machine')}
        />
      </FormSection>
      <FormSection className={cx('new-user-form-controls')}>
        <Button
          className={cx('save')}
          theme="primary"
          type="button"
          onClick={handleSubmitMiddleware}
        >
          Save
        </Button>
        <Button
          className={cx('cancel')}
          theme="primary"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          className={cx('delete')}
          theme="primary"
          icon={<NotAllowedIcon />}
          onClick={handleDeleteMiddleware}
        >
          Delete
        </Button>
      </FormSection>
    </Form>
  );
};

EditUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    machine: PropTypes.bool,
    admin: PropTypes.bool,
    login: PropTypes.string,
  }).isRequired,
};

const NewUserForm = ({ handleSubmit, handleCancel }) => {
  const [state, setState] = useState({
    login: '',
    email: '',
    admin: false,
    machine: false,
  });

  const handleSubmitMiddleware = (event) => {
    event.preventDefault();
    handleSubmit(state);
    handleCancel();
  };

  const handleFieldChange = (field) => (event) => {
    switch (field) {
      case 'admin':
      case 'machine':
        setState((prev) => ({ ...prev, [field]: event.target.checked }));
        break;
      default:
        setState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
    }
  };
  return (
    <Form className={cx('new-user-form')}>
      <FormSection className={cx('new-user-form-column')}>
        <Field.Input
          label="Login"
          placeholder="userlogin"
          value={state.login}
          name="login"
          width={400}
          required
          onChange={handleFieldChange('login')}
        />
      </FormSection>
      <FormSection className={cx('new-user-form-column')}>
        <Field.Input
          label="Email"
          type="email"
          placeholder="example@mail.com"
          value={state.email}
          name="email"
          width={400}
          required
          onChange={handleFieldChange('email')}
        />
      </FormSection>
      <FormSection className={cx('new-user-form-column')}>
        <Field.Checkbox
          label="Admin User"
          name="admin"
          checked={state.admin}
          onChange={handleFieldChange('admin')}
        />
      </FormSection>
      <FormSection className={cx('new-user-form-column')}>
        <Field.Checkbox
          label="Machine User"
          name="machine"
          checked={state.machine}
          onChange={handleFieldChange('machine')}
        />
      </FormSection>
      <FormSection className={cx('new-user-form-controls')}>
        <Button
          className={cx('save')}
          theme="primary"
          onClick={handleSubmitMiddleware}
        >
          Create
        </Button>
        <Button
          className={cx('cancel')}
          theme="primary"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </FormSection>
    </Form>
  );
};

NewUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export { NewUserForm, EditUserForm };
