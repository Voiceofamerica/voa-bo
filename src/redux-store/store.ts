
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { persistStore, autoRehydrate } from 'redux-persist'

import history from 'containers/Router/history'
import AppState from 'types/AppState'
import rootReducer from './rootReducer'

const store = createStore<AppState>(
  rootReducer,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
    ),
    autoRehydrate({}),
  ) as any,
)

export const renderReady = new Promise(resolve => {
  persistStore(store, {
    blacklist: ['media'],
  }, () => {
    resolve()
  })
})

export default store
