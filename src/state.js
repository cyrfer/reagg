import { drillDown } from 'deepdown'
import CustomError from './custom-error'

export const actionTypes = {
  STATE_UPDATE: 'STATE_UPDATE',
}

const errorTypes = {
  INCOMPLETE_IMPLEMENTATION: 'INCOMPLETE_IMPLEMENTATION',
}

const updateState = (targetPath, targetStore, value) => {
  // could be < 1, assuming drillDown can handle empty array and return store
  if (targetPath.length < 1) {
    throw new CustomError({
      type: errorTypes.INCOMPLETE_IMPLEMENTATION,
      exception: {
        message: `cannot currently write targets with length less than 2 [${targetPath}]`
      }
    })
  }

  // assumes `targetPath` is an array with length >= 2
  const targetPathParent = targetPath.slice(0, -1);
  const targetPathChild = targetPath.slice(-1)[0];
  const targetStoreParent = (targetPath.length === 1) ? targetStore : drillDown(targetStore, targetPathParent);
  targetStoreParent[targetPathChild] = value;
}

export const stateReducer = (state, action) => {
  const stash = {'$stash': {}};
  // TODO: maybe passing `state` directly will result in less re-renders?
  const newState = {...state};

  const stageReducer = (accum, stage) => {
    const context = (stage.context && drillDown(stage.context[0] === '$stash' ? stash : state, stage.context)) || accum;
    const next = stage.operation(context, stage.payload);
    stage.target && updateState(stage.target, newState, next);
    stage.stash && updateState(stage.stash, stash, next)
    return next;
  };

  /*const finalContext = */action.stages.reduce(stageReducer, newState);
  return newState;
}

export const reduxReducer = (state, action) => {
  if (!state || (action && action.type !== actionTypes.STATE_UPDATE)) {
    return state;
  }

  return {
  ...state,
  ...(stateReducer(state, action))
  }
}
