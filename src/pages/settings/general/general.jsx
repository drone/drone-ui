import classNames from 'classnames/bind';
import React, { useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

import { TIMEOUTS } from '_constants';
import Form, { FormSection, Field } from 'components/shared/form';
import Switch from 'components/shared/switch';
import { useToast } from 'hooks';
import { useRepo } from 'hooks/swr';
import { ReactComponent as NotAllowedIcon } from 'svg/not-allowed.svg';
import { axiosWrapper, pick } from 'utils';

import styles from './general.module.scss';

const cx = classNames.bind(styles);

const buildTimeoutsOptions = (timeouts) => timeouts.map((timeout) => ({
  value: timeout,
  key: timeout > 90 ? `${timeout / 60} hours` : `${timeout} minutes`,
}));

export default function General({ repo }) {
  const { namespace, name } = useParams();
  const {
    mutate,
  } = useRepo({ namespace, name });

  const { showError, showSuccess } = useToast();

  /* States */
  const [settings, setSettings] = useState(null);

  useLayoutEffect(() => {
    if (repo) {
      setSettings(
        pick(repo)(['ignore_pull_requests', 'ignore_forks', 'protected', 'trusted', 'visibility', 'timeout', 'config_path']),
      );
    }
  }, [repo]);

  const handleDisableRepo = async () => {
    // eslint-disable-next-line
    const userAgreed = confirm('Are you sure you want to disable this repo?');
    if (userAgreed) {
      try {
        await axiosWrapper(`/api/repos/${namespace}/${name}`, { method: 'DELETE' });
        mutate();
        showSuccess('Repo has been disabled');
      } catch (e) {
        showError(`Unable to disable repo: ${e.message}`);
        // eslint-disable-next-line no-console
        console.warn(e.message);
      }
    }
  };

  const handleSettingsSubmit = async (event) => {
    try {
      const res = await axiosWrapper(`/api/repos/${namespace}/${name}`, { method: 'PATCH', data: { ...settings, timeout: +settings.timeout } });
      mutate(res);
      showSuccess('Changes have been saved');
    } catch (e) {
      showError(`Unable to save changes: ${e.message}`);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  };

  const handleSettingsChange = (field) => (event) => {
    switch (field) {
      case 'ignore_pull_requests':
      case 'ignore_forks':
      case 'protected':
      case 'trusted':
        setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
        break;
      case 'visibility':
      case 'config_path':
      case 'timeout':
        setSettings((prev) => ({ ...prev, [field]: event.target.value }));
        break;
      default:
    }
  };
  if (settings === null) return null;
  return (
    <div className={cx('wrapper')}>
      <div className={cx('inner')}>
        <Form className={cx('form')}>
          <FormSection className={cx('form-section-row')} title="Project Webhooks">
            <div className={cx('switch-row')}>

              <Switch
                id="ignore_pull_requests"
                checked={settings.ignore_pull_requests}
                onChange={handleSettingsChange('ignore_pull_requests')}
              >
                Disable Pull Requests
              </Switch>
            </div>
            <div className={cx('switch-row')}>

              <Switch
                id="ignore_forks"
                checked={settings.ignore_forks}
                onChange={handleSettingsChange('ignore_forks')}
              >
                Disable forks

              </Switch>
            </div>
          </FormSection>
          <FormSection className={cx('form-section-row')} title="Project Settings">
            <div className={cx('switch-row')}>

              <Switch
                id="protected"
                checked={settings.protected}
                onChange={handleSettingsChange('protected')}
              >
                Protected

              </Switch>
              <p className={cx('note')}>
                Blocks a pipeline if the yaml signature cannot be verified.
              </p>
            </div>
            <div className={cx('switch-row')}>

              <Switch
                id="trusted"
                checked={settings.trusted}
                onChange={handleSettingsChange('trusted')}
              >
                Trusted

              </Switch>
              <p className={cx('note')}>
                Enables privileged container settings.
              </p>
            </div>
          </FormSection>
          <FormSection className={cx('form-section-row')} title="Project Visibility">
            <ul className={cx('visibility-container')}>
              <li className={cx('visibility-card-wrapper')}>
                <div className={cx('visibility-card')}>
                  <h4>Private</h4>
                  <p>Private repositories are only accessible to people you explicitly share access with.</p>
                </div>
                <Field.Radio
                  name="private"
                  checked={settings.visibility === 'private'}
                  value="private"
                  appearance="checkmark"
                  onChange={handleSettingsChange('visibility')}
                />
              </li>
              <li className={cx('visibility-card-wrapper')}>
                <div className={cx('visibility-card')}>
                  <h4>Public</h4>
                  <p>Public repositories are accessible to everyone on the internet.</p>
                </div>
                <Field.Radio
                  name="public"
                  value="public"
                  appearance="checkmark"
                  checked={settings.visibility === 'public'}
                  onChange={handleSettingsChange('visibility')}
                />
              </li>

              <li className={cx('visibility-card-wrapper')}>
                <div className={cx('visibility-card')}>
                  <h4>Internal</h4>
                  <p>Internal repositories are only accessible to authenticated user.</p>
                </div>
                <Field.Radio
                  name="internal"
                  checked={settings.visibility === 'internal'}
                  value="internal"
                  appearance="checkmark"
                  onChange={handleSettingsChange('visibility')}
                />
              </li>
            </ul>
          </FormSection>
          <FormSection className={cx('form-section-row', 'form-section-row-is-last')}>
            <Field.Select
              label="Timeout"
              value={settings.timeout}
              optionsList={buildTimeoutsOptions(TIMEOUTS)}
              width={200}
              className={cx('timeout')}
              onChange={handleSettingsChange('timeout')}
            />
            <Field.Input
              label="Configuration"
              name="configuration"
              value={settings.config_path}
              width={372}
              className={cx('config')}
              onChange={handleSettingsChange('config_path')}
            />
          </FormSection>
          <div className={cx('controls')}>

            <button
              className={cx('btn', 'btn-save')}
              type="button"
              onClick={handleSettingsSubmit}
            >
              Save Changes
            </button>
            <button
              className={cx('btn', 'btn-disable')}
              type="button"
              onClick={handleDisableRepo}
            >
              <NotAllowedIcon />
              Disable
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
