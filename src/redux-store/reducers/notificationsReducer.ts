
import {
  type as toggleNotificationType,
  ToggleNotificationAction,
} from '../actions/toggleNotification'

import { ActorMap, buildReducer } from '../actorMap'
import Notifications from 'types/Notifications'

const actors: ActorMap<Notifications> = {
  [toggleNotificationType]: (prev, { id, on = !prev[id] }: ToggleNotificationAction) => {
    const newState = { ...prev }

    if (on) {
      newState[id] = true
    } else {
      delete newState[id]
    }

    return newState
  },
}

export const INITIAL_STATE: Notifications = {
}

export default buildReducer(INITIAL_STATE, actors)
