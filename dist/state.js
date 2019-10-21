"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxReducer = exports.stateReducer = exports.actionTypes = void 0;

var _deepdown = require("deepdown");

var _customError = _interopRequireDefault(require("./custom-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var actionTypes = {
  STATE_UPDATE: 'STATE_UPDATE'
};
exports.actionTypes = actionTypes;
var errorTypes = {
  INCOMPLETE_IMPLEMENTATION: 'INCOMPLETE_IMPLEMENTATION'
};

var updateState = function updateState(targetPath, targetStore, value) {
  // could be < 1, assuming drillDown can handle empty array and return store
  if (targetPath.length < 1) {
    throw new _customError["default"]({
      type: errorTypes.INCOMPLETE_IMPLEMENTATION,
      exception: {
        message: "cannot currently write targets with length less than 2 [".concat(targetPath, "]")
      }
    });
  } // assumes `targetPath` is an array with length >= 2


  var targetPathParent = targetPath.slice(0, -1);
  var targetPathChild = targetPath.slice(-1)[0];
  var targetStoreParent = targetPath.length === 1 ? targetStore : (0, _deepdown.drillDown)(targetStore, targetPathParent);
  targetStoreParent[targetPathChild] = value;
};

var stateReducer = function stateReducer(state, action) {
  var stash = {
    '$stash': {}
  }; // TODO: maybe passing `state` directly will result in less re-renders?

  var newState = _objectSpread({}, state);

  var stageReducer = function stageReducer(accum, stage) {
    var context = stage.context && (0, _deepdown.drillDown)(stage.context[0] === '$stash' ? stash : state, stage.context) || accum;
    var next = stage.operation(context, stage.payload);
    stage.target && updateState(stage.target, newState, next);
    stage.stash && updateState(stage.stash, stash, next);
    return next;
  };
  /*const finalContext = */


  action.stages.reduce(stageReducer, newState);
  return newState;
};

exports.stateReducer = stateReducer;

var reduxReducer = function reduxReducer(state, action) {
  if (!state || action && action.type !== actionTypes.STATE_UPDATE) {
    return state;
  }

  return _objectSpread({}, state, {}, stateReducer(state, action));
};

exports.reduxReducer = reduxReducer;
//# sourceMappingURL=state.js.map