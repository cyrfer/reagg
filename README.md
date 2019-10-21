# reagg
State management inspired by the Mongodb Aggregation Framework.

This is possibly another saga implementation in the Redux community, but it's my favorite.

The main difference from all other Redux libraries is that you write more declarative than imperative. With `reagg`, you're not supposed to modify the reducer function. Instead, you enhance the payload on your Actions to inform the reducer how to manage the state. Redux developers will be amused that only a single action type is necessary.

You can gradually integrate `reagg` with your existing Redux reducer and actions. Over time, I suspect you will write more of your Actions with the payload requirements for `reagg` than your other reducer implementations.

## Install
`npm i -S reagg`

## Usage - Define Redux Actions
tl;dr

```javascript
{
  type: "STATE_UPDATE",
  stages: [
    {operation, context, payload, target}
  ]
}
```

Some rules to follow:
- For Redux compatibility, each action object should have a `type` field. For the `reagg` reducer to use the action, a type value of `STATE_UPDATE` is required.
- `operation` and `payload` fields are required for all `stages` elements.
- `context` and `target` fields are optional in `stages` elements, depending on the persistence you are going for.

Here is a working example
```javascript
// file: myapp/src/actions.js
// you will never need to change the reducer.
// you will only define new actions and describe what is needed by the reducer in `stages`.

import reagg from 'reagg'
const operationTypes = reagg.operations;

// const newData = [
//   {title: 'scary movie', releases: [{country: 'usa', rating: 'PG-13'}]},
//   {title: 'sad movie', releases: [{country: 'usa', rating: 'R'}]}
// ]

export updateMovies = (newData) => {
  return {
    type: reagg.state.actionTypes.STATE_UPDATE, //"STATE_UPDATE",
    stages: [
      // update state object with the new list of movie entities
      {
        context: 'movies.list'.split('.'),  // existing state array to merge with
        payload: newData, // new state to be merged with existing state
        // mini-reducer that merges new and old
        operation: operationTypes.MERGE_ARRAY_ELEMENTS,
        // save the result in the same place the old state existed
        target: 'movies.list'.split('.'),
      },
      // make intermediate structure for next stage of processing
      {
        // context: // use output from above for this stage
        payload: 'releases'.split('.'), // the path to the array to be unwound
        // mini-reducer that expands elements within a nested array to another array where elements also carry info from parent object
        operation: operationTypes.UNWIND_TO_ARRAY,
        // target: // no need to save this form of the data
      },
      // update a specialized state structure
      {
        // context:  // use output from above for this stage
        // now `rating` is a top-level field, and field paths are always specified as an array
        payload: 'rating'.split('.'),
        // mini-reducer that makes an inverted index on the (deeply nested) field specified by `payload`
        operation: operationTypes.INDEX_FROM_ARRAY,
        // save the result where the app can read from for O(1) access time
        target: 'movies.byRating'.split('.'),
      }
    ]
  }
}
```

## Usage - Dispatch Redux Actions
Simply invoke the action creator function you defined previously by passing the data from a network call.

```
import React from 'react'
import { useDispatch } from 'react-redux'
import Button from './components/Button'
import { updateMovies } from './actions'

const MyComponent = () => {
  const dispatch = useDispatch()
  return (
<Button onClick={() => fetch('/movies').then(data => dispatch(updateMovies(data))}>GET MOVIES</Button>
  )
}
```

## Usage - Setup Redux Store Reducer

```javascript
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import reagg from 'reagg'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

// alteratively you can call the reagg reducer from your reducer.
const store = createStore(reagg.state.reduxReducer, {})

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
```

## Operations
Operations must conform to the interface usage:
```
const next = stage.operation(context, stage.payload);
```
Custom operations can be used in your actions. Please submit a PR if you have an operation that will be generally useful to the community.

The operations that are currently distributed is found in `./src/operations.js`. The following operations are considered part of the interface of `reagg`:

- REPLACE_ARRAY_ELEMENT
- MERGE_ARRAY_ELEMENTS
- FILTER_ARRAY
- SORT_ARRAY
- UNWIND_TO_ARRAY
- MAP_ARRAY_ITEMS
- MAP_OBJECT_FROM_KEYS
- INDEX_FROM_ARRAY
- ARRAY_FROM_INDEX
- ARRAY_FROM_KEYS
- MERGE_OBJECT_SHALLOW_PAYLOAD_CONTEXT
- MERGE_OBJECT_SHALLOW_CONTEXT_PAYLOAD
- OVERWRITE