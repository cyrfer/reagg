import { assert } from 'chai'
// import reagg from '../dist'
import reagg from '../src'

const actionTypes = reagg.state.actionTypes
const reducer = reagg.state.reduxReducer
const operationTypes = reagg.operations

const currentState = {
    keywords: {
        fetchStatus: 'off',
        data: {
            all: [],
            byCategory: {},
        }
    },
    titles: {
        fetchStatus: 'off',
        data: {
            lists: [],
            all: [],
            byMpm: {},
        },
    }
}

describe('reducer', () => {
    it('should append array items', () => {
        const action = {
            type: 'STATE_UPDATE',
            stages: [
                {
                    operation: operationTypes.MERGE_ARRAY_ELEMENTS,
                    context: 'titles.data.lists'.split('.'),
                    payload: [{}, {}],
                    target: 'titles.data.lists'.split('.'),
                },
            ]
        }
        assert.equal(currentState.titles.data.lists.length, 0)
        const state = reducer(currentState, action)
        assert.equal(state.titles.data.lists.length, 2)
    })

    it('should update a key in an object', () => {
        const action = {
            type: actionTypes.STATE_UPDATE,
            stages: [
                {
                    operation: operationTypes.MERGE_OBJECT_SHALLOW_CONTEXT_PAYLOAD,
                    context: 'keywords'.split('.'), //'titles'.split('.'),
                    payload: {fetchStatus: 'on'},
                    target: 'keywords'.split('.'), //'titles'.split('.'),
                },
            ]
        }
        const state = reducer(currentState, action)
        assert.equal(state.keywords.fetchStatus, 'on')
    })

    it('should make an index from a scalar property', () => {
        const mpmNumbers = ['001', '002', '003']
        const oldState = {
            titles: {
                data: {
                    all: [
                        {value: 'test01', mpmNumber: mpmNumbers[0]},
                        {value: 'test02', mpmNumber: mpmNumbers[1]},
                        {value: 'test03', mpmNumber: mpmNumbers[2]},
                        {value: 'test04', mpmNumber: mpmNumbers[0]},
                    ],
                    byMpm: {},
                }
            }
        }
        assert.equal(Object.keys(oldState.titles.data.byMpm).length, 0)
        assert.equal(oldState.titles.data.all.length, 4)

        const action = {
            type: actionTypes.STATE_UPDATE,
            stages: [
                {
                    context: 'titles.data.all'.split('.'),
                    operation: operationTypes.INDEX_FROM_ARRAY,
                    payload: 'mpmNumber'.split('.'),
                    target: 'titles.data.byMpm'.split('.'),
                },
            ]
        }
        const newState = reducer(oldState, action)
        assert.equal(Object.keys(newState.titles.data.byMpm).length, mpmNumbers.length)
    })

    it('should make an index from an array property', () => {
        const categories = ['cat01', 'cat02', 'cat03']
        const oldState = {
            keywords: {
                data: {
                    all: [
                        {value: 'test01', categories: [categories[0]]},
                        {value: 'test02', categories: [categories[1], categories[0]]},
                        {value: 'test03', categories: [categories[2], categories[1]]},
                        {value: 'test04', categories: []},
                    ],
                    byCategory: {},
                }
            }
        }
        assert.equal(Object.keys(oldState.keywords.data.byCategory).length, 0)
        assert.equal(oldState.keywords.data.all.length, 4)

        const action = {
            type: actionTypes.STATE_UPDATE,
            stages: [
                {
                    context: 'keywords.data.all'.split('.'),
                    operation: operationTypes.UNWIND_TO_ARRAY,
                    payload: 'categories'.split('.'),
                    target: 'keywords.data.unwind'.split('.'),
                },
                // {
                //     operation: operationTypes.MAP_ARRAY_ITEMS,
                //     payload: 'categories'.split('.'),
                // },
                {
                    operation: operationTypes.INDEX_FROM_ARRAY,
                    payload: 'categories'.split('.'),
                    target: 'keywords.data.byCategory'.split('.'),
                },
            ]
        }
        const newState = reducer(oldState, action)
        assert.equal(newState.keywords.data.unwind.length, 5)
        assert.equal(Object.keys(newState.keywords.data.byCategory).length, categories.length)
    })
})
