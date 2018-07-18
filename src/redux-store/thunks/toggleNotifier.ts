
import { Dispatch } from 'redux'
import { Moment } from 'moment'
import AppState from 'types/AppState'

import toggleNotification from '../actions/toggleNotification'
import { schedule, cancel } from 'helpers/localNotifications'

interface ToggleNotifierOptions {
  id: string
  title?: string
  time?: Moment
  on?: boolean
}

export default (options: ToggleNotifierOptions) =>
  async (dispatch: Dispatch<AppState>, getState: () => AppState) => {
    const { id, on = !getState().notifications[id], title, time } = options

    const trigger = time ? {
      at: time.toDate(),
    } : undefined

    if (on) {
      await schedule({
        id,
        title,
        trigger,
      }).then((ret) => {
        console.log(ret)
        dispatch(toggleNotification({ id, on }))
      })
    } else {
      await cancel([id]).then((ret) => {
        console.log(ret)
        dispatch(toggleNotification({ id, on }))
      })
    }
  }
