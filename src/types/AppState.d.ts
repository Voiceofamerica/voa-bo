
import { RouterState } from 'react-router-redux'
import AppSettings from './AppSettings'
import MediaState from './MediaState'
import FlatMap from './FlatMap'
import FavoriteContent from './FavoriteContent'
import Notifications from './Notifications'
import CircumventionDrawerState from './CircumventionDrawerState';
import ProgressState from './ProgressState';

export default interface AppState {
  settings: AppSettings
  media: MediaState
  favorites: FlatMap<FavoriteContent>
  router: RouterState
  notifications: Notifications
  circumventionDrawer: CircumventionDrawerState
  progress: ProgressState
}
