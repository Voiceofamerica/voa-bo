
import { Action } from 'redux'

export const type = 'TOGGLE_CIRCUMVENTION_DRAWER'

interface ToggleCircumventionDrawerOptions {
  open?: boolean
}

export type ToggleCircumventionDrawerAction = ToggleCircumventionDrawerOptions & Action

export default (options: ToggleCircumventionDrawerOptions): ToggleCircumventionDrawerAction => ({
  ...options,
  type,
})
