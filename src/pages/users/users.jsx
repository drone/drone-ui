import classNames from 'classnames/bind';
import React, { useCallback, useMemo, useState } from 'react';

import { EditUserForm, NewUserForm } from 'components/pages/users/user-form';
import UserList from 'components/pages/users/user-list';
import Button from 'components/shared/button';
import Modal, { useModal } from 'components/shared/modal';
import { useCustomTitle, useToast } from 'hooks';
import { useUserList } from 'hooks/swr';
// @TODO: use a proper user icon
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { pick, axiosWrapper } from 'utils';

import css from './users.module.scss';

const cx = classNames.bind(css);

const USERS_CHUNK_SIZE = 1000;

const sortUsersAlphabetically = (users) => users.sort((a, b) => a.login - b.login);

export default function Users({ user: currentUser }) {
  const [showAllUsers, setShowAllUsers] = useState(false);
  useCustomTitle('User Management');
  const { showError, showSuccess } = useToast();
  const { data, isLoading, mutate } = useUserList();
  const [isModalShowing, toggleModal] = useModal();
  const [modalUserId, setModalUserId] = useState('new'); // ['new', `${id}`]
  const users = useMemo(
    () => sortUsersAlphabetically(data?.slice(0, showAllUsers
      ? data?.length : USERS_CHUNK_SIZE) ?? []), [data, showAllUsers],
  );

  const handleShowMoreClick = () => setShowAllUsers(true);
  const handleNewUserClick = () => {
    setModalUserId('new');
    toggleModal();
  };
  const handleEditUserClick = (userId) => () => {
    setModalUserId(userId);
    toggleModal();
  };

  const handleUserFormSubmit = useCallback(async (values) => {
    try {
      await axiosWrapper('/api/users', {
        method: 'POST',
        data: {
          ...values,
        },
      });
      mutate();
      showSuccess('New user has been created successfully');
    } catch (err) {
      showError(`Unable to create new user: ${err.message}`);
      // eslint-disable-next-line no-console
      console.warn(err.message);
    }
  }, [mutate, showError, showSuccess]);

  const handleEditUserFormSubmit = useCallback(async (values) => {
    const { admin, login } = values;
    try {
      await axiosWrapper(`/api/users/${login}`, {
        method: 'PATCH',
        data: {
          admin,
        },
      });
      mutate();
      showSuccess('User settings have been updated');
    } catch (err) {
      showError(`Unable to create new user: ${err.message}`);
      // eslint-disable-next-line no-console
      console.warn(err.message);
    }
  }, [mutate, showError, showSuccess]);

  const handleUserDelete = useCallback(async (login) => {
    const userAgreed = confirm('Are you sure you want to delete this user?');
    if (userAgreed) {
      try {
        await axiosWrapper(`/api/users/${login}`, { method: 'DELETE' });
        setModalUserId('new');
        mutate((prev) => prev.filter((user) => user.login !== login), false);
        showSuccess('User has been deleted successfully');
      } catch (e) {
        showError(`Unable to delete user: ${e.message}`);
        // eslint-disable-next-line
      console.error(e)
      }
    }
  }, [mutate, showError, showSuccess]);

  return (
    <>
      <section className={cx('wrapper')}>
        <div className={cx('card')}>
          <div className={cx('actions')}>
            <Button
              theme="primary"
              className={cx('btn', 'btn-user')}
              icon={<DemoIcon />}
              onClick={handleNewUserClick}
            >
              New User
            </Button>
          </div>
          {isLoading ? <p>Loading...</p> : (
            <UserList
              users={users}
              currentUser={currentUser}
              handleEditUserClick={handleEditUserClick}
            />
          )}
          {!showAllUsers && data?.length > USERS_CHUNK_SIZE && (
          <Button
            className={cx('btn', 'btn-show-more')}
            onClick={handleShowMoreClick}
          >
            Show More &#8595;

          </Button>
          )}
        </div>
      </section>
      <Modal
        title={modalUserId === 'new' ? 'Create a New User' : 'Edit user'}
        isShowing={isModalShowing}
        hide={toggleModal}
      >
        {modalUserId === 'new' ? (

          <NewUserForm
            handleSubmit={handleUserFormSubmit}
            handleCancel={toggleModal}
          />
        ) : (
          <EditUserForm
            handleSubmit={handleEditUserFormSubmit}
            handleDelete={handleUserDelete}
            handleCancel={toggleModal}
            initialValues={pick(users.find((user) => user.id === modalUserId))(['machine', 'admin', 'login'])}
          />
        )}
      </Modal>
    </>
  );
}
