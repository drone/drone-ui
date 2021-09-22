import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useEffect, useContext, useCallback,
} from 'react';
import {
  NavLink, Route, Switch, useParams,
} from 'react-router-dom';

import Button from 'components/shared/button';
import { AppContext } from 'context';
import { useToast, useCustomTitle } from 'hooks';
import { useRepo } from 'hooks/swr';
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { ReactComponent as NotActiveIcon } from 'svg/not-active.svg';
import { axiosWrapper } from 'utils';

import Badges from './badges';
import Cron from './cron';
import General from './general';
import { Secrets, OrgSecrets } from './secrets';
import styles from './settings.module.scss';
import Templates from './templates';

const cx = classNames.bind(styles);

const SettingsInactive = ({
  showActivationBtn, activationHandler,
}) => (
  <section className={cx('inactive-wrapper')}>
    <div className={cx('inactive-inner')}>
      <NotActiveIcon />
      <h2>This Repository is not Active.</h2>
      {showActivationBtn ? (
        <>
          <p>Please activate your repository to begin executing pipelines.</p>
          <Button
            theme="primary"
            icon={<DemoIcon />}
            onClick={activationHandler}
          >
            Activate Repository
          </Button>
        </>
      ) : (
        <p>Please contact the repository administrator to activate this repository.</p>
      )}
    </div>
  </section>
);

export default function Settings({ user, repo }) {
  const { namespace, name } = useParams();
  const {
    mutate,
  } = useRepo({ namespace, name });
  const [, setContext] = useContext(AppContext);

  const { showError, showSuccess } = useToast();

  const GeneralCallback = useCallback(() => <General repo={repo} user={user} />, [repo, user]);

  useEffect(() => {
    // disable nav links if repo is not active
    if (repo) {
      setContext((prevContext) => ({ ...prevContext, isRepoNavDisabled: !repo?.active }));
    }
    return () => setContext((prevContext) => ({ ...prevContext, isRepoNavDisabled: false }));
  }, [repo, setContext]);

  const handleEnableRepo = useCallback(async () => {
    try {
      const res = await axiosWrapper(`/api/repos/${namespace}/${name}`, { method: 'POST' });
      mutate(res, false);
      showSuccess('Repo has been successfully enabled');
    } catch (e) {
      showError(e.message);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  }, [showError, showSuccess, namespace, name, mutate]);

  useCustomTitle(`Settings - ${namespace}/${name}`);

  return (
    <>
      {repo?.active ? (
        <section className={cx('wrapper')}>
          <aside>
            <nav className={cx('settings-nav')}>
              <NavLink
                className={cx('settings-nav-item')}
                activeClassName={cx('settings-nav-item-active')}
                to={`/${namespace}/${name}/settings`}
                exact
              >
                General
              </NavLink>
              <NavLink
                className={cx('settings-nav-item')}
                activeClassName={cx('settings-nav-item-active')}
                to={`/${namespace}/${name}/settings/secrets`}
                exact
              >
                Secrets
              </NavLink>
              <NavLink
                className={cx('settings-nav-item')}
                activeClassName={cx('settings-nav-item-active')}
                to={`/${namespace}/${name}/settings/cron`}
                exact
              >
                Cron Jobs
              </NavLink>
              <NavLink
                className={cx('settings-nav-item')}
                activeClassName={cx('settings-nav-item-active')}
                to={`/${namespace}/${name}/settings/badges`}
                exact
              >
                Badges
              </NavLink>
              <h3 className={cx('settings-nav-section-header')}>Organization</h3>
              <NavLink
                className={cx('settings-nav-item')}
                activeClassName={cx('settings-nav-item-active')}
                to={`/${namespace}/${name}/settings/org-secrets`}
                exact
              >
                Secrets
              </NavLink>
              <NavLink
                className={cx('settings-nav-item')}
                activeClassName={cx('settings-nav-item-active')}
                to={`/${namespace}/${name}/settings/templates`}
                exact
              >
                Templates
              </NavLink>
            </nav>
          </aside>
          <Switch>
            <Route
              path="/:namespace/:name/settings"
              component={GeneralCallback}
              exact
            />
            <Route path="/:namespace/:name/settings/secrets" component={Secrets} />
            <Route path="/:namespace/:name/settings/cron" component={Cron} />
            <Route path="/:namespace/:name/settings/badges" component={Badges} />
            <Route path="/:namespace/:name/settings/org-secrets" component={OrgSecrets} />
            <Route path="/:namespace/:name/settings/templates" component={Templates} />

          </Switch>
        </section>
      ) : (
        <SettingsInactive
          showActivationBtn={repo?.permissions?.admin ?? false}
          activationHandler={handleEnableRepo}
        />
      )}
    </>
  );
}

SettingsInactive.propTypes = {
  showActivationBtn: PropTypes.bool.isRequired,
  activationHandler: PropTypes.func.isRequired,
};

Settings.propTypes = {
  repo: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    permissions: PropTypes.shape({
      admin: PropTypes.bool,
    }),
  }).isRequired,
  user: PropTypes.shape().isRequired,
};
