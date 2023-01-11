import { STATES } from '_constants';

import {
  mayBeExtractTmateLink,
  getNextCompState,
  getNextCompStateFromBuildStatus,
} from './console-manager.utils';
// separate module in order
// to avoid circular dep
export const ACTION_LIST = {
  TOGGLE_LOGS_FOLLOWING: 'toggle_logs_following',
  SET_SHOW_ALL_LOGS: 'set_show_all_logs',
  UPDATE_IS_DATA_LOADING: 'update_is_data_loading',
  UPDATE_BUILD_STATUS: 'update_build_status',
  UPDATE_STAGE_STATUS: 'update_stage_status',
  UPDATE_STAGE_NAME: 'update_stage_name',
  UPDATE_STAGE_ERROR: 'update_stage_error',
  UPDATE_STEP_DATA: 'update_step_data',
  UPDATE_LOGS_HOOK_ERROR: 'update_logs_hook_error',
  UPDATE_LOGS: 'update_logs',
  UPDATE_ARE_LOGS_LOADING: 'update_are_logs_loading',
  UPDATE_HAS_BUILD_DEBUG_MODE: 'update_has_build_debug_mode',
  SET_LOGS: 'set_logs',
  BATCH_UPDATE_LOGS: 'batch_update_logs',
};

// reducer init fn
export const logsInitFn = (props) => {
  const {
    isDataLoading,
    hasBuildDebugMode,
    buildStatus,
    stageStatus,
    stageName,
    stageError,
    stepData = {},
  } = props;
  let initialCompState = STATES.LOADING;
  if (isDataLoading || [buildStatus, stageStatus, stepData.status].includes('pending')) {
    initialCompState = STATES.LOADING;
  } else if (stageStatus === 'error') {
    initialCompState = STATES.ERROR;
  } else if (stepData.status === 'running') {
    initialCompState = STATES.STREAM_ON;
  }
  return {
    compState: initialCompState,
    shouldFollowLogs: false,
    showAllLogs: false,
    logs: [],
    stepData,
    isDataLoading,
    stageName,
    stageStatus,
    stageError,
    buildStatus,
    logsHookError: {},
    tmateLink: '',
    hasBuildDebugMode,
  };
};

export const logsReducer = (state, action) => {
  switch (action.type) {
    case ACTION_LIST.TOGGLE_LOGS_FOLLOWING:
      return { ...state, shouldFollowLogs: !state.shouldFollowLogs };
    case ACTION_LIST.SET_SHOW_ALL_LOGS:
      return { ...state, showAllLogs: true };
    case ACTION_LIST.UPDATE_BUILD_STATUS:
      return {
        ...state,
        buildStatus: action.payload,
        compState: getNextCompStateFromBuildStatus({ buildStatus: action.payload, state }),
      };
    case ACTION_LIST.UPDATE_HAS_BUILD_DEBUG_MODE:
      return { ...state, hasBuildDebugMode: action.payload };
    case ACTION_LIST.UPDATE_STAGE_STATUS:
      return {
        ...state,
        stageStatus: action.payload,
        compState: action.payload === 'error' ? STATES.ERROR : state.compState,
      };
    case ACTION_LIST.UPDATE_STAGE_NAME:
      return { ...state, stageName: action.payload };
    case ACTION_LIST.UPDATE_IS_DATA_LOADING:
      return {
        ...state,
        isDataLoading: action.payload,
        compState: action.payload ? STATES.LOADING
          : getNextCompState(
            {
              stageStatus: state.stageStatus,
              stepStatus: state.stepData.status,
              logsExist: state.logs?.length,
              currentCompState: state.compState,
            },
          ),
      };
    case ACTION_LIST.UPDATE_STEP_DATA:
      return {
        ...state,
        stepData: { ...action.payload },
        compState: getNextCompState({
          stageStatus: state.stageStatus,
          stepStatus: action.payload?.status,
          logsExist: state.logs?.length,
          currentCompState: state.compState,
        }),
      };
    case ACTION_LIST.UPDATE_LOGS_HOOK_ERROR:
      return {
        ...state,
        logsHookError: action.payload,
        compState: action.payload ? STATES.ERROR : state.compState,
      };
    case ACTION_LIST.UPDATE_LOGS:
      return {
        ...state,
        logs: state.logs.concat(action.payload),
        tmateLink: state.tmateLink || mayBeExtractTmateLink(
          action.payload,
          state.stepData.status,
          state.hasBuildDebugMode,
        ),
      };
    case ACTION_LIST.BATCH_UPDATE_LOGS:
      return {
        ...state,
        logs: state.logs.concat(...action.payload),
        tmateLink: state.tmateLink || mayBeExtractTmateLink(
          action.payload,
          state.stepData.status,
          state.hasBuildDebugMode,
        ),
      };
    case ACTION_LIST.SET_LOGS:
      return {
        ...state,
        logs: action.payload,
        compState: !action.payload.length && state.compState !== STATES.LOADING
          ? STATES.NO_LOGS_AVAILABLE : state.compState,
      };
    case ACTION_LIST.UPDATE_ARE_LOGS_LOADING:
      return {
        ...state,
        compState: action.payload ? STATES.LOADING
          : getNextCompState(
            {
              stageStatus: state.stageStatus,
              stepStatus: state.stepData.status,
              logsExist: state.logs?.length,
              currentCompState: state.compState,
            },
          ),
      };
    case ACTION_LIST.UPDATE_STAGE_ERROR:
      return {
        ...state,
        stageError: state.compState === STATES.NO_LOGS_AVAILABLE ? action.payload : undefined,
        compState: !action.payload.length && state.compState !== STATES.LOADING
          ? STATES.NO_LOGS_AVAILABLE : state.compState,
      };
    default:
      return state;
  }
};
