
import { Action, Reducer } from 'redux'
import FlatMap from 'types/FlatMap'

export interface ActorMap<S> {
  [name: string]: Reducer<S>
}

export function buildReducer<S> (initialState: S, map: ActorMap<S>): Reducer<S> {
  return (prev: S = initialState, action: Action): S => {
    let actor = map[action.type]
    return typeof actor === 'function' ? actor(prev, action) : prev
  }
}

export function buildArrayReducer<S, I> (idSelector: (item: S) => I, childReducer: Reducer<S>): Reducer<S[]> {
  return (prev, action: Action & { id: I }) => {
    return prev.map(item => {
      if (idSelector(item) === action.id) {
        return childReducer(item, action)
      } else {
        return item
      }
    })
  }
}

function getNewState<S> (prevState: FlatMap<S>, action: Action, defaultReducer?: Reducer<FlatMap<S>>): FlatMap<S> {
  if (typeof defaultReducer === 'function') {
    return defaultReducer(prevState, action)
  } else {
    return {
      ...prevState,
    }
  }
}

export function buildFlatMapReducer<S> (childReducer: Reducer<S>): Reducer<FlatMap<S>> {
  return (prevState, action: Action & { id: number }) => {
    const newState = getNewState(prevState, action)

    const prevItem = newState[action.id]
    const newItem = childReducer(prevItem, action)

    if (newItem === null || newItem === undefined) {
      delete newState[action.id]
    } else {
      newState[action.id] = newItem
    }

    return newState
  }
}
