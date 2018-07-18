
import { Action } from 'redux'

export const type = 'MARK_INTRO_DONE'

export type MarkIntroDoneAction = Action

export default (): MarkIntroDoneAction => ({
  type,
})
