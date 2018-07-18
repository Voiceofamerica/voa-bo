
import { Dispatch } from 'redux'
import AppState from 'types/AppState'

import toggleDailyNotification from '../actions/toggleDailyNotification'
import { scheduleDaily, cancelDaily } from 'helpers/localNotifications'

interface ToggleNotifierOptions {
  on?: boolean
}

export default (options: ToggleNotifierOptions) =>
  async (dispatch: Dispatch<AppState>, getState: () => AppState) => {
    const { on = !getState().settings.dailyNotificationOn } = options

    if (on) {
      await scheduleDaily().then((ret) => {
        console.log(ret)
        dispatch(toggleDailyNotification({ on }))
      })
    } else {
      await cancelDaily().then((ret) => {
        console.log(ret)
        dispatch(toggleDailyNotification({ on }))
      })
    }
  }
