import classNames from 'classnames/bind';
import React, {
  useCallback, useState, useLayoutEffect,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { instance } from '_constants';
import CardsView from 'components/pages/build/cards-view';
import GraphView from 'components/pages/build/graph-view';
import LogView from 'components/pages/build/log-view';
import { NonLogsContainer } from 'components/pages/build/log-view/console-manager';
import Button from 'components/shared/button';
import Modal, { useModal } from 'components/shared/modal';
import SystemMessage from 'components/shared/system-message';
import { useLocalStorage, useCustomTitle, useToast } from 'hooks';
import { useBuild, useCards } from 'hooks/swr';
import NotFound from 'pages/not-found';
import { axiosWrapper } from 'utils';

import styles from './build.module.scss';
import DeploymentForm from './deployment-form';
import Header from './header';

const cx = classNames.bind(styles);

const ERROR = 'error';
const RESOLVED = 'resolved';
const RESOLVED_BLOCKED = 'resolved_blocked';

const LOGS_VIEW = 'logs';
const GRAPH_VIEW = 'graph';
const CARDS_VIEW = 'cards';

export const VIEWS = { LOGS_VIEW, GRAPH_VIEW, CARDS_VIEW };

const getContent = (view, data, isLoading, cardsData, cardsIsLoading, cardsIsError, namespace, name, build) => {
  switch (view) {
    case GRAPH_VIEW:
      return (
        <GraphView
          data={data}
          isDataLoading={isLoading}
        />
      );
    case CARDS_VIEW:
      return (
        <CardsView
          data={cardsData}
          isDataLoading={cardsIsLoading}
          isError={cardsIsError}
          namespace={namespace}
          name={name}
          build={build}
        />
      );
    default:
      return (
        <LogView
          data={data}
          isDataLoading={isLoading}
        />
      );
  }
};

export default function Build({ user, userIsAdminOrHasWritePerm }) {
  const params = useParams();
  const {
    namespace, name, build, stage = 1, step = 1,
  } = params;
  useCustomTitle(`Build #${build}.${stage}.${step} - ${namespace}/${name}`);

  const history = useHistory();
  const {
    data, mutate, isError, isLoading,
  } = useBuild({ namespace, name, build });
  const {
    data: cardsData, isError: cardsIsError, isLoading: cardsIsLoading,
    // TODO build here probably has to be build number as opposed to build ID - my test data matches these numbers by fluke
  } = useCards({ namespace, name, build });
  const [state, setState] = useState(RESOLVED);
  const [view, setView] = useLocalStorage('buildPageView', LOGS_VIEW);

  const [isModalShowing, toggleModal] = useModal();

  const { showError } = useToast();

  useLayoutEffect(() => {
    // set state to error if request threw an error, build threw an error
    // or user has manually entered url with invalid stage count
    if (isError || data?.error || (data && (data?.stages?.length ?? 0) < stage)) {
      setState(ERROR);
    } else if (isLoading || data) {
      if (data?.status === 'pending' && data.stages?.[stage - 1]?.status === 'blocked') {
        setState(RESOLVED_BLOCKED);
      } else {
        setState(RESOLVED);
      }
    }
  }, [data, isError, isLoading, stage]);

  const stepMap = data?.stages?.reduce((stageAcc, stageData) => ({
    [stageData?.id]: stageData?.steps?.reduce((stepAcc, stepData) => ({
      [stepData?.id]: { stageNum: stageData.number, stepNum: stepData.number },
      ...stepAcc,
    }), {}),
    ...stageAcc,
  }),
  {});

  const enhancedCardsData = cardsData?.map((cardData) => {
    const stepMapData = stepMap?.[cardData?.stage]?.[cardData?.step];
    return { ...cardData, stageNum: stepMapData?.stageNum, stepNum: stepMapData?.stepNum };
  });

  const handleViewModeClick = (mode) => () => setView(mode);

  const handleDeploySubmit = useCallback(async ({ action, target, parameters }) => {
    const queryParams = parameters
      .map(({ key, value }) => ({ key, value }))
      .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
    queryParams.target = target || 'production';
    const encode = encodeURIComponent;
    const queryString = Object.entries(queryParams).map(([key, value]) => `${encode(key)}=${encode(value)}`).join('&');
    try {
      const res = await axiosWrapper(`${instance}/api/repos/${namespace}/${name}/builds/${build}/${action}?${queryString}`, {
        method: 'POST',
      });
      if (res) {
        history.push(`/${namespace}/${name}/${res.number}`);
      } else {
        showError('Unable to create new deploy in this repo');
      }
    } catch (e) {
      showError(`Unable to create new deploy: ${e.message}`);
      // eslint-disable-next-line
      console.warn(e);
    }
  }, [namespace, name, build, history, showError]);

  const handleCancelClick = useCallback(async () => {
    try {
      const res = await axiosWrapper(`/api/repos/${namespace}/${name}/builds/${build}`, { method: 'DELETE' });
      await mutate(res, false);
      history.push(`/${namespace}/${name}/${res.number}`);
    } catch (e) {
      showError(`Unable to cancel build: ${e.message}`);
      // eslint-disable-next-line
      console.warn(e.message);
    }
  }, [namespace, name, build, history, mutate, showError]);

  const handleRestartClick = useCallback(async () => {
    try {
      const res = await axiosWrapper(`/api/repos/${namespace}/${name}/builds/${build}`, { method: 'POST' });
      history.push(`/${namespace}/${name}/${res.number}/1/1`);
    } catch (e) {
      showError(`Unable to restart build: ${e.message}`);
      // eslint-disable-next-line
      console.warn(e.message);
    }
  }, [namespace, name, build, history, showError]);

  const handleDebugClick = useCallback(async () => {
    try {
      const res = await axiosWrapper(`/api/repos/${namespace}/${name}/builds/${build}?debug=true`, { method: 'POST' });
      history.push(`/${namespace}/${name}/${res.number}`);
    } catch (e) {
      showError(`Unable to restart in debug mode: ${e.message}`);
      // eslint-disable-next-line
      console.warn(e.message);
    }
  }, [name, namespace, build, history, showError]);

  const handleApproveClick = useCallback(async () => {
    try {
      await axiosWrapper(`/api/repos/${namespace}/${name}/builds/${build}/approve/${stage}`, {
        method: 'POST',
      });
      await mutate();
    } catch (e) {
      showError(`Unable to approve build: ${e.message}`);
      // eslint-disable-next-line
      console.warn(e.message);
    }
  }, [namespace, name, build, stage, mutate, showError]);

  const handleDeclineClick = useCallback(async () => {
    try {
      await axiosWrapper(`/api/repos/${namespace}/${name}/builds/${build}/decline/${stage}`, {
        method: 'POST',
      });
      await mutate();
    } catch (e) {
      showError(`Unable to decline build: ${e.message}`);
      // eslint-disable-next-line
      console.warn(e.message);
    }
  }, [namespace, name, build, stage, mutate, showError]);

  const handleMenuItemSelect = useCallback((value) => {
    switch (value) {
      case 'promote':
        toggleModal();
        break;
      case 'debug':
        handleDebugClick();
        break;
      case 'restart':
        handleRestartClick();
        break;
      default:
    }
  }, [handleRestartClick, handleDebugClick, toggleModal]);

  const headerHandlers = {
    handleRestartClick,
    handleCancelClick,
    handleMenuItemSelect,
    handleApproveClick,
    handleDeclineClick,
    handleViewModeClick,
  };

  let content;

  switch (state) {
    case ERROR:
      if (isError?.message === 'Not Found' || isError?.message === 'sql: no rows in result set') {
        content = (<NotFound user={user} />);
        return content;
      }
      content = (
        <NonLogsContainer className={cx('no-logs')}>
          <SystemMessage intent="danger">
            {data?.error
             || isError?.message
             || 'Something went wrong. It is highly likely that this page does not exist'}
          </SystemMessage>
        </NonLogsContainer>
      );
      break;
    case RESOLVED_BLOCKED:
      content = (
        <NonLogsContainer className={cx('blocked')}>
          {userIsAdminOrHasWritePerm ? (
            <>
              <Button
                className={cx('controls-button', 'controls-button-approve')}
                onClick={handleApproveClick}
              >
                Approve Build
              </Button>
              <Button
                className={cx('controls-button', 'controls-button-decline')}
                onClick={handleDeclineClick}
              >
                Decline Build
              </Button>
            </>
          ) : (
            <p>Build is blocked, please, contact repo admin in order to proceed</p>
          )}
        </NonLogsContainer>
      );
      break;
    case RESOLVED:
    default:
      content = getContent(view, data, isLoading, enhancedCardsData, cardsIsLoading, cardsIsError, namespace, name, build);
  }
  return (
    <>
      <Header
        data={data}
        userIsAdminOrHasWritePerm={userIsAdminOrHasWritePerm}
        view={view}
        {...headerHandlers}
        {...params}
      />
      {content}
      <Modal
        title="Create deployment"
        isShowing={isModalShowing}
        hide={toggleModal}
      >
        <DeploymentForm handleSubmit={handleDeploySubmit} handleCancel={toggleModal} />
      </Modal>
    </>
  );
}
