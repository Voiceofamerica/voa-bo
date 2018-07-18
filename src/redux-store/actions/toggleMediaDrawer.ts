
import { Action } from 'redux'

export const type = 'TOGGLE_MEDIA_DRAWER'

interface ToggleMediaDrawerOptions {
  open?: boolean
}

export type ToggleMediaDrawerAction = ToggleMediaDrawerOptions & Action

export default (options: ToggleMediaDrawerOptions): ToggleMediaDrawerAction => ({
  ...options,
  type,
})
