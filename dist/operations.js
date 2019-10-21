"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _deepdown = require("deepdown");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var operationTypes = {
  // array operators
  REPLACE_ARRAY_ELEMENT: function REPLACE_ARRAY_ELEMENT(arrayOld, _ref) {
    var keyMatch = _ref.keyMatch,
        value = _ref.value;

    var matchFn = function matchFn(elem) {
      return (0, _deepdown.drillDown)(elem, keyMatch) === (0, _deepdown.drillDown)(value, keyMatch);
    };

    var foundIndex = arrayOld.findIndex(matchFn);

    if (foundIndex === -1) {
      return [].concat(_toConsumableArray(arrayOld), [value]);
    }

    return [].concat(_toConsumableArray(arrayOld.slice(0, foundIndex)), [value], _toConsumableArray(arrayOld.slice(foundIndex + 1)));
  },
  MERGE_ARRAY_ELEMENTS: function MERGE_ARRAY_ELEMENTS(arrayOld, arrayNew) {
    return [].concat(_toConsumableArray(arrayOld), _toConsumableArray(arrayNew));
  },
  FILTER_ARRAY: function FILTER_ARRAY(arrayOld, filter) {
    return arrayOld.filter((0, _deepdown.filterByKey)(filter));
  },
  SORT_ARRAY: function SORT_ARRAY(arrayOld, _ref2) {
    var key = _ref2.key,
        order = _ref2.order;
    return arrayOld.sort((0, _deepdown.sortByKey)({
      key: key,
      order: order
    }));
  },
  UNWIND_TO_ARRAY: function UNWIND_TO_ARRAY(arrayOld, keyPath) {
    return (0, _deepdown.unwindByKey)(arrayOld, keyPath);
  },
  // UNIQUE_ARRAY_ITEMS: (arrayContext, keyPathUnique) => {
  //     const uniqueSet = {};
  //     return arrayContext.filter(ifNotInAddToIndex(uniqueSet, keyPathUnique));
  // },
  MAP_ARRAY_ITEMS: function MAP_ARRAY_ITEMS(arrayContext, keyPath) {
    return arrayContext.map(function (elem) {
      return (0, _deepdown.drillDown)(elem, keyPath);
    });
  },
  MAP_OBJECT_FROM_KEYS: function MAP_OBJECT_FROM_KEYS(keyArray, value) {
    return keyArray.reduce(function (accum, elem) {
      return _objectSpread(_defineProperty({}, elem, value), accum);
    }, {});
  },
  // array to object
  INDEX_FROM_ARRAY: function INDEX_FROM_ARRAY(arrayContext, keyPathIndex) {
    return (0, _deepdown.indexByKey)(arrayContext, keyPathIndex);
  },
  ARRAY_FROM_INDEX: function ARRAY_FROM_INDEX(indexContext, payload) {
    var redu = function redu(accum, key) {
      return [].concat(_toConsumableArray(accum), [indexContext[key][0]]);
    };

    return Object.keys(indexContext).reduce(redu, []);
  },
  ARRAY_FROM_KEYS: function ARRAY_FROM_KEYS(context, payload) {
    var keys = Object.keys(context);
    return keys;
  },
  // object operators
  MERGE_OBJECT_SHALLOW_PAYLOAD_CONTEXT: function MERGE_OBJECT_SHALLOW_PAYLOAD_CONTEXT(objContext, objPayload) {
    return _objectSpread({}, objPayload, {}, objContext);
  },
  MERGE_OBJECT_SHALLOW_CONTEXT_PAYLOAD: function MERGE_OBJECT_SHALLOW_CONTEXT_PAYLOAD(objContext, objPayload) {
    return _objectSpread({}, objContext, {}, objPayload);
  },
  OVERWRITE: function OVERWRITE(oldData, newData) {
    return newData;
  }
};
var _default = operationTypes;
exports["default"] = _default;
//# sourceMappingURL=operations.js.map