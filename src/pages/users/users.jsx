import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';

import Avatar from 'components/shared/avatar';
import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import Modal, { useModal } from 'components/shared/modal';
import { useCustomTitle, useToast } from 'hooks';
import { useUserList } from 'hooks/swr';
// @TODO: use a proper user icon
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { ReactComponent as EditIcon } from 'svg/edit.svg';
import { ReactComponent as NotAllowedIcon } from 'svg/not-allowed.svg';
import { pick, axiosWrapper } from 'utils';

import css from './users.module.scss';

const cx = classNames.bind(css);

const USERS_CHUNK_SIZE = 1000;

const sortUsersAlphabetically = (users) => users.sort((a, b) => a.login - b.login);

const EditUserForm = ({
  initialValues, handleSubmit, handleDelete, handleCancel,
}) => {
  const [state, setState] = useState(initialValues);

  const handleSubmitMiddleware = (event) => {
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
        <Button className={cx('save')} theme="primary" type="button" onClick={handleSubmitMiddleware}>Save</Button>
        <Button className={cx('cancel')} theme="primary" type="button" onClick={handleCancel}>Cancel</Button>
        <Button
          className={cx('delete')}
          theme="primary"
          type="button"
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
          autoFocus="true"
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
        <Button className={cx('save')} theme="primary" type="submit" onClick={handleSubmitMiddleware}>Create</Button>
        <Button className={cx('cancel')} theme="primary" type="button" onClick={handleCancel}>Cancel</Button>
      </FormSection>
    </Form>
  );
};

NewUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

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
            <UserListView users={users} currentUser={currentUser} handleEditUserClick={handleEditUserClick} />)}
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

function UserListView(props) {
  return (
    <div className={cx('user-list-wrapper')}>
      <div className={cx('user-list-header')}>
        <div />
        <div>Username</div>
        <div>Active</div>
        <div>Type</div>
        <div>Role</div>
        <div>Created</div>
        <div>Last Login</div>
      </div>
      <div className={cx('user-list')}>
        {props?.users?.map((user) => (
          <UserListItem
            data={user}
            key={user.id}
            isCurrentUser={user.id === props.currentUser.id}
            handleEditClick={props.handleEditUserClick(user.id)}
          />
        ))}
      </div>
    </div>
  );
}

function UserListItem({ data, isCurrentUser, handleEditClick }) {
  return (
    <>
      <div className={cx('user-list-item')}>
        <div>
          <Avatar className={cx('avatar')} text={data.login} path={data.avatar} alt={data.login} />
        </div>
        <div>{data.login}</div>
        <div>{data.active ? 'Active' : 'Inactive'}</div>
        <div>{data.machine ? 'Machine' : 'User'}</div>
        <div>{data.admin ? 'Admin' : 'Member'}</div>
        <div>{formatDistanceStrict(new Date(data.created * 1000), new Date(), { addSuffix: true })}</div>
        <div>
          {data.last_login === 0
            ? ''
            : formatDistanceStrict(new Date(data.last_login * 1000), new Date(), { addSuffix: true })}

        </div>
        <div>
          {!isCurrentUser && (

          <Button onClick={handleEditClick}>
            <EditIcon />
          </Button>
          )}
        </div>
      </div>
    </>
  );
}
