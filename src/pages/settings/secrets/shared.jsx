import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import { ReactComponent as TrashIcon } from 'svg/trash.svg';

import styles from './secrets.module.scss';

const cx = classNames.bind(styles);

export const NewSecretForm = ({ handleSubmit, handleCancel }) => {
  const [state, setState] = useState({
    name: '',
    data: '',
    pull_request: false,
  });
  const handleSecretChange = (field) => (event) => {
    switch (field) {
      case 'name':
      case 'data':
        setState((prev) => ({ ...prev, [field]: event.target.value }));
        break;
      case 'pull_request':
        setState((prev) => ({ ...prev, pull_request: event.target.checked }));
        break;
      default:
    }
  };
  const handleAddSecret = () => {
    handleSubmit(state);
    handleCancel();
  };
  return (
    <Form
      className={cx('container')}
    >
      <FormSection className={cx('group', 'group-fields')}>
        <Field.Input
          placeholder="Secret Name"
          value={state.name}
          label="Name"
          name="secret-name"
          width={350}
          autoFocus
          onChange={handleSecretChange('name')}
        />
        <Field.TextArea
          label="Value"
          placeholder="Secret value"
          value={state.data}
          name="secret-value"
          width={350}
          onChange={handleSecretChange('data')}
        />
        <Field.Checkbox
          label="Allow Pull Requests"
          name="pull_request"
          checked={state.pull_request}
          onChange={handleSecretChange('pull_request')}
        />
      </FormSection>
      <FormSection className={cx('controls')}>
        <Button
          onClick={handleAddSecret}
        >
          Create
        </Button>
        <Button
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </FormSection>
    </Form>
  );
};

export const SecretListView = ({ secrets, handleRemove }) => (
  <div className={cx('secret-list-wrapper')}>
    <div className={cx('secret-list-header')}>
      <div>Name</div>
      <div>Pull Requests</div>
      <div />
    </div>
    <div className={cx('secret-list')}>
      {secrets?.map((secret) => (
        <SecretListItem data={secret} key={secret.id} onRemove={handleRemove} />
      ))}
    </div>
  </div>
);

const SecretListItem = ({ data, onRemove }) => (
  <>
    <div className={cx('secret-list-item')}>
      <div>{data.name}</div>
      <div>{data.pull_request ? 'Enabled' : 'Disabled'}</div>
      <div>
        <Button onClick={onRemove(data.name)}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  </>
);

NewSecretForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

SecretListView.propTypes = {
  secrets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })),
  handleRemove: PropTypes.func.isRequired,
};

SecretListItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    pull_request: PropTypes.bool,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

SecretListView.defaultProps = {
  secrets: [],
};
