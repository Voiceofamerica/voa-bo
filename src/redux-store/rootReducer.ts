
import { combineReducers, Reducer, Action } from 'redux'
import { routerReducer } from 'react-router-redux'

import AppState from 'types/AppState'

import { type as clearAllType } from './actions/clearAll'

import appSettingsReducer from './reducers/appSettingsReducer'
import mediaStateReducer from './reducers/mediaStateReducer'
import favoriteContentsReducer from './reducers/favoriteContentsReducer'
import notificationsReducer from './reducers/notificationsReducer'
import circumventionDrawerReducer from './reducers/circumventionDrawerReducer'
import progressStateReducer from './reducers/progressStateReducer'

const baseRootReducer: Reducer<AppState> = combineReducers({
  settings: appSettingsReducer,
  media: mediaStateReducer,
  favorites: favoriteContentsReducer,
  router: routerReducer,
  notifications: notificationsReducer,
  circumventionDrawer: circumventionDrawerReducer,
  progress: progressStateReducer,
})

function rootReducer (prev: AppState, action: Action): AppState {
  if (action.type === clearAllType) {
    return baseRootReducer(undefined, { type: 'initialize' })
  } else {
    return baseRootReducer(prev, action)
  }
}

export default rootReducer
