import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import Modal, { useModal } from 'components/shared/modal';
import { useToast } from 'hooks';
import { useCrons } from 'hooks/swr';
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { ReactComponent as TrashIcon } from 'svg/trash.svg';
import { axiosWrapper } from 'utils';

import styles from './cron.module.scss';

const cx = classNames.bind(styles);

const CRON_OPTIONS = ['@hourly', '@daily', '@weekly', '@monthly', '@yearly'].map((opt) => ({ key: opt, value: opt }));

const NewCronForm = ({ handleSubmit, handleCancel }) => {
  const [state, setState] = useState({
    name: '',
    branch: '',
    expr: CRON_OPTIONS[0].value,
  });
  const handleCronChange = (field) => (e) => {
    setState((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleAddCron = () => {
    handleSubmit(state);
    handleCancel();
  };
  return (
    <Form className={cx('container', 'form')}>
      <FormSection className={cx('group', 'group-fields')}>
        <Field.Input
          label="Name"
          value={state.name}
          name="cron-name"
          width={350}
          autoFocus="true"
          onChange={handleCronChange('name')}
        />
        <Field.Input
          label="Branch"
          value={state.branch}
          placeholder="master"
          name="cron-branch"
          width={350}
          onChange={handleCronChange('branch')}
        />
        <Field.Select
          label="Schedule"
          value={state.expr}
          optionsList={CRON_OPTIONS}
          width={350}
          onChange={handleCronChange('expr')}
        />
      </FormSection>
      <FormSection className={cx('controls')}>
        <Button
          onClick={handleAddCron}
        >
          Create
        </Button>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
      </FormSection>
    </Form>
  );
};

NewCronForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default function Secrets() {
  const { namespace, name } = useParams();
  const [isModalShowing, toggleModal] = useModal();
  const { data, isLoading, mutate } = useCrons({ namespace, name });

  const { showSuccess, showError } = useToast();

  const handleAddCron = useCallback(async (values) => {
    try {
      const res = await axiosWrapper(`/api/repos/${namespace}/${name}/cron`, {
        method: 'POST',
        data: { ...values, branch: values.branch || 'master' },
      });
      mutate((prev) => prev.concat(res), false);
      showSuccess('Cron has been added successfully');
    } catch (e) {
      showError(e.message);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  }, [namespace, name, mutate, showSuccess, showError]);

  const handleRemoveCron = (cronName) => async () => {
    const userAgreed = confirm('Are you sure you want to remove cron job?');
    if (userAgreed) {
      try {
        await axiosWrapper(`/api/repos/${namespace}/${name}/cron/${cronName}`, { method: 'DELETE' });
        showSuccess('Cron has been removed successfully');
        mutate(data.filter((cronItem) => cronItem.name !== cronName), false);
      } catch (e) {
        showError(e.message);
        console.warn(e.message); // eslint-disable-line no-console
      }
    }
  };

  let crons = null;
  if (isLoading) {
    crons = null;
  } else if (data.length) {
    crons = (
      <CronListView crons={data} handleRemove={handleRemoveCron} />
    );
  } else {
    crons = (
      <div className={cx('zero')}>
        <h2>No Cron Jobs</h2>
        <p>You can create cron jobs to schedule pipeline executions on a recurring basis.</p>
      </div>
    );
  }
  return (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('card')}>
          {isLoading ? (
            null
          ) : (
            <>
              <div className={cx('actions')}>
                <Button
                  theme="primary"
                  className={cx('btn-new')}
                  icon={<DemoIcon />}
                  onClick={toggleModal}
                >
                  New Cron Job
                </Button>
              </div>
              {crons}
            </>
          )}
        </div>
      </div>
      <Modal
        title="Create a New Cron Job"
        isShowing={isModalShowing}
        hide={toggleModal}
      >
        <NewCronForm
          handleSubmit={handleAddCron}
          handleCancel={toggleModal}
        />
      </Modal>
    </>
  );
}

function CronListView(props) {
  return (
    <div className={cx('cron-list-wrapper')}>
      <div className={cx('cron-list-header')}>
        <div>Name</div>
        <div>Branch</div>
        <div>Schedule</div>
        <div>Next Execution</div>
        <div />
      </div>
      <div className={cx('cron-list')}>
        {props?.crons?.map((cron) => (
          <CronListItem data={cron} key={cron.id} onRemove={props.handleRemove} />
        ))}
      </div>
    </div>
  );
}

function CronListItem({ data, onRemove }) {
  return (
    <>
      <div className={cx('cron-list-item')}>
        <div>{data.name}</div>
        <div>{data.branch}</div>
        <div>{data.expr}</div>
        <div>{data.next && new Date(data.next * 1000).toLocaleString()}</div>
        <div>
          <Button onClick={onRemove(data.name)}>
            <TrashIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
