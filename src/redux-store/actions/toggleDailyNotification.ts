
import { Action } from 'redux'

export const type = 'TOGGLE_DAILY_NOTIFICATION'

interface ToggleDailyNotificationOptions {
  on?: boolean
}

export type ToggleDailyNotificationAction = ToggleDailyNotificationOptions & Action

export default (options: ToggleDailyNotificationOptions): ToggleDailyNotificationAction => ({
  ...options,
  type,
})
