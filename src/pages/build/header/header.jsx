import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import SimpleActivity from 'components/shared/activity/simple';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSpacer } from 'components/shared/breadcrumb';
import Button from 'components/shared/button';
import DotsMenu from 'components/shared/dots-menu';
import Elapsed from 'components/shared/elapsed';
import Status from 'components/shared/status';
import { ReactComponent as ArrowIcon } from 'svg/arrow.svg';
import { ReactComponent as CalendarIcon } from 'svg/calendar.svg';
import { getFullDateRepresentation } from 'utils';

import { VIEWS } from '../index';

import css from './header.module.scss';

const cx = classNames.bind(css);

const Header = (props) => {
  const {
    namespace,
    name,
    build,
    data,
    handleCancelClick,
    handleMenuItemSelect,
    handleViewModeClick,
    view,
    userIsAdminOrHasWritePerm,
    showCardHeader,
  } = props;
  let controls = null;
  if (data && data.status !== 'blocked') {
    if (['pending', 'running'].includes(data.status)) {
      controls = (
        <Button
          className={cx('cancel-button', 'controls')}
          onClick={handleCancelClick}
        >
          Cancel
        </Button>
      );
    } else if (userIsAdminOrHasWritePerm) {
      controls = (
        <DotsMenu
          id="build-actions"
          className={cx('controls')}
          menuItems={[{
            value: 'restart',
            content: 'Restart',
          }, {
            value: 'promote',
            content: 'Promote',
          }, {
            value: 'debug',
            content: 'Debug',
          }]}
          menuAlignment="right"
          onMenuItemSelect={handleMenuItemSelect}
        />
      );
    }
  }
  return (
    <header className={cx('header')}>
      <div className={cx('breadcrumbs')}>
        <Breadcrumb className={cx('breadcrumbs-inner')}>
          <BreadcrumbItem href={`/${namespace}/${name}`} text="Builds" />
          <BreadcrumbSpacer />
          <BreadcrumbItem text={`#${build}`} />
          <BreadcrumbSpacer />
        </Breadcrumb>
      </div>
      <div className={cx('togglers')}>
        <Button
          className={cx({ active: view === VIEWS.LOGS_VIEW })}
          onClick={handleViewModeClick(VIEWS.LOGS_VIEW)}
        >
          Log View
        </Button>
        <Button
          className={cx({ active: view === VIEWS.GRAPH_VIEW })}
          onClick={handleViewModeClick(VIEWS.GRAPH_VIEW)}
        >
          Graph View
        </Button>
        {showCardHeader
        && (
        <Button
          className={cx({ active: view === VIEWS.CARDS_VIEW })}
          onClick={handleViewModeClick(VIEWS.CARDS_VIEW)}
        >
          Card View
        </Button>
        )}
      </div>
      {data ? (
        <>
          <div className={cx('meta')}>
            {data.started > 0 && (
            <Elapsed started={data.started} finished={data.finished} withLetters withIcon />
            )}
            <div className={cx('date')}>
              <CalendarIcon />
              {getFullDateRepresentation({ date: data.created })}
            </div>
            {controls}
          </div>
          {controls}
        </>
      ) : null}

      <div className={cx('title')}>
        <h1>
          <Link to={`/${namespace}/${name}`}>
            <ArrowIcon />
          </Link>
          {name}
        </h1>
      </div>
      {data
        ? (
          <div className={cx('activity')}>
            <Status status={data.status} className={cx('status')} />
            <p title={data.title || data.message} className={cx('message')}>
              {data.title || data.message}
            </p>
            <SimpleActivity
              namespace={namespace}
              name={name}
              number={data.number}
              event={data.event}
              action={data.action}
              actor={data.sender}
              avatar={data.author_avatar}
              commit={data.after}
              branch={data.target}
              target={data.deploy_to}
              refs={data.ref}
              cron={data.cron}
              trigger={data.trigger}
              parent={data.parent}
              deeplink
            />
          </div>
        ) : null}
    </header>
  );
};

Header.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  build: PropTypes.string.isRequired,
  data: PropTypes.shape({
    number: PropTypes.number.isRequired,
    event: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    author_avatar: PropTypes.string.isRequired,
    after: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    deploy_to: PropTypes.string,
    ref: PropTypes.string.isRequired,
    cron: PropTypes.string,
    status: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
    started: PropTypes.number.isRequired,
    created: PropTypes.number.isRequired,
    finished: PropTypes.number.isRequired,
    trigger: PropTypes.string,
    parent: PropTypes.number,
  }),
  handleCancelClick: PropTypes.func.isRequired,
  handleMenuItemSelect: PropTypes.func.isRequired,
  userIsAdminOrHasWritePerm: PropTypes.bool,
  handleViewModeClick: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  showCardHeader: PropTypes.bool.isRequired,
};

Header.defaultProps = {
  data: undefined,
  userIsAdminOrHasWritePerm: false,
};

export default Header;
