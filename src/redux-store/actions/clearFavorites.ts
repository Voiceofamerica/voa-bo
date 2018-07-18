
import { Action } from 'redux'

export const type = 'CLEAR_FAVORITES'

export type ClearFavoritesAction = Action

export default (): ClearFavoritesAction => ({
  type,
})
