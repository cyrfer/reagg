import { drillDown, indexByKey, unwindByKey, filterByKey, sortByKey/*, ifNotInAddToIndex*/ } from 'deepdown';

const operationTypes = {
    // array operators
    REPLACE_ARRAY_ELEMENT: (arrayOld, { keyMatch, value }) => {
        const matchFn = elem => drillDown(elem, keyMatch) === drillDown(value, keyMatch)
        const foundIndex = arrayOld.findIndex(matchFn);
        if (foundIndex === -1) {
            return [
                ...arrayOld,
                value,
            ];
        }
        return [
            ...arrayOld.slice(0, foundIndex),
            value,
            ...arrayOld.slice(foundIndex + 1),
        ]
    },
    MERGE_ARRAY_ELEMENTS: (arrayOld, arrayNew) => {
        return [
            ...arrayOld,
            ...arrayNew,
        ];
    },
    FILTER_ARRAY: (arrayOld, filter) => {
        return arrayOld.filter(filterByKey(filter))
    },
    SORT_ARRAY: (arrayOld, {key, order}) => {
        return arrayOld.sort(sortByKey({key, order}))
    },
    UNWIND_TO_ARRAY: (arrayOld, keyPath) => {
        return unwindByKey(arrayOld, keyPath)
    },
    // UNIQUE_ARRAY_ITEMS: (arrayContext, keyPathUnique) => {
    //     const uniqueSet = {};
    //     return arrayContext.filter(ifNotInAddToIndex(uniqueSet, keyPathUnique));
    // },
    MAP_ARRAY_ITEMS: (arrayContext, keyPath) => {
        return arrayContext.map(elem => drillDown(elem, keyPath))
    },
    MAP_OBJECT_FROM_KEYS: (keyArray, value) => {
        return keyArray.reduce((accum, elem) => {
            return {
                [elem]: value,
                ...accum
            }
        }, {})
    },
    // array to object
    INDEX_FROM_ARRAY: (arrayContext, keyPathIndex) => {
        return indexByKey(arrayContext, keyPathIndex);
    },
    ARRAY_FROM_INDEX: (indexContext, payload) => {
        const redu = (accum, key) => {
            return [ ...accum, indexContext[key][0], ];
        }
        return Object.keys(indexContext).reduce(redu, []);
    },
    ARRAY_FROM_KEYS: (context, payload) => {
        const keys = Object.keys(context)
        return keys
    },
    // object operators
    MERGE_OBJECT_SHALLOW_PAYLOAD_CONTEXT: (objContext, objPayload) => {
        return {
            ...objPayload,
            ...objContext,
        }
    },
    MERGE_OBJECT_SHALLOW_CONTEXT_PAYLOAD: (objContext, objPayload) => {
        return {
            ...objContext,
            ...objPayload,
        }
    },
    OVERWRITE: (oldData, newData) => newData
};

export default operationTypes;
