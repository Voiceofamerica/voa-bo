
import { Action } from 'redux'

export const type = 'SET_PSIPHON_ENABLED'

interface SetPsiphonEnabledOptions {
  psiphonEnabled: boolean
}

export type SetPsiphonEnabledAction = SetPsiphonEnabledOptions & Action

export default (options: SetPsiphonEnabledOptions): SetPsiphonEnabledAction => ({
  ...options,
  type,
})
