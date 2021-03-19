import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import Modal, { useModal } from 'components/shared/modal';
import { useToast } from 'hooks';
import { useSecrets } from 'hooks/swr';
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { ReactComponent as TrashIcon } from 'svg/trash.svg';
import { axiosWrapper } from 'utils';

import styles from './secrets.module.scss';

const cx = classNames.bind(styles);

const NewSecretForm = ({ handleSubmit, handleCancel }) => {
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
  const handleAddSecret = (e) => {
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

NewSecretForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default function Secrets() {
  const { namespace, name } = useParams();
  const { data, isLoading, mutate } = useSecrets({ namespace, name });
  const [isModalShowing, toggleModal] = useModal();
  const { showError, showSuccess } = useToast();

  const handleAddSecret = useCallback(async (values) => {
    try {
      const res = await axiosWrapper(`/api/repos/${namespace}/${name}/secrets`,
        {
          method: 'POST',
          data: values,
        });
      mutate((prev) => prev.concat(res), false);
      showSuccess('Secret has been added successfully');
    } catch (e) {
      showError(`Unable to add secret: ${e.message}`);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  }, [mutate, namespace, name, showSuccess, showError]);

  const handleRemoveSecret = (secretName) => async () => {
    const userAgreed = confirm('Are you sure you want to delete this secret?');
    if (userAgreed) {
      try {
        await axiosWrapper(`/api/repos/${namespace}/${name}/secrets/${secretName}`, {
          method: 'DELETE',
        });
        mutate(data.filter((secretItem) => secretItem.name !== secretName), false);
        showSuccess('Secret has been removed successfully');
      } catch (e) {
        showError(`Unable to remove secret: ${e.message}`);
        // eslint-disable-next-line no-console
        console.warn(e.message);
      }
    }
  };

  let secrets = null;
  if (isLoading) {
    secrets = null;
  } else if (data.length) {
    secrets = (
      <SecretListView secrets={data} handleRemove={handleRemoveSecret} />
    );
  } else {
    secrets = (
      <div className={cx('zero')}>
        <h2>No Secrets</h2>
        <p>Manage sensitive configuration parameters, such as passwords, tokens, and ssh keys.</p>
      </div>
    );
  }
  return (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('card')}>
          <div className={cx('actions')}>
            <Button
              theme="primary"
              className={cx('btn-new')}
              icon={<DemoIcon />}
              onClick={toggleModal}
            >
              New Secret
            </Button>
          </div>
          {secrets}
        </div>
      </div>
      <Modal
        title="Create a New Secret"
        isShowing={isModalShowing}
        hide={toggleModal}
      >
        <NewSecretForm
          handleSubmit={handleAddSecret}
          handleCancel={toggleModal}
        />
      </Modal>
    </>
  );
}

function SecretListView(props) {
  return (
    <div className={cx('secret-list-wrapper')}>
      <div className={cx('secret-list-header')}>
        <div>Name</div>
        <div>Pull Requests</div>
        <div />
      </div>
      <div className={cx('secret-list')}>
        {props?.secrets?.map((secret) => (
          <SecretListItem data={secret} key={secret.id} onRemove={props.handleRemove} />
        ))}
      </div>
    </div>
  );
}

function SecretListItem({ data, onRemove }) {
  return (
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
}
