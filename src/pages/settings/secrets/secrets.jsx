import classNames from 'classnames/bind';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'components/shared/button';
import Modal, { useModal } from 'components/shared/modal';
import { useToast } from 'hooks';
import { useSecrets } from 'hooks/swr';
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { axiosWrapper } from 'utils';

import styles from './secrets.module.scss';
import { NewSecretForm, SecretListView } from './shared';

const cx = classNames.bind(styles);

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
    // eslint-disable-next-line no-alert
    const userAgreed = window.confirm('Are you sure you want to delete this secret?');
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
