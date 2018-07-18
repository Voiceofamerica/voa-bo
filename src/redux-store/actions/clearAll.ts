
import { Action } from 'redux'

export const type = 'CLEAR_ALL'

export type ClearAllAction = Action

export default (): ClearAllAction => ({
  type,
})
