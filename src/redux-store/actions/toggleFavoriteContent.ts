
import { Action } from 'redux'
import FavoriteContent from 'types/FavoriteContent'

export const type = 'TOGGLE_FAVORITE_CONTENT'

interface ToggleFavoriteContentOptions extends FavoriteContent {
  favorite?: boolean
}

export type ToggleFavoriteContentAction = ToggleFavoriteContentOptions & Action

export default (options: ToggleFavoriteContentOptions): ToggleFavoriteContentAction => ({
  ...options,
  favoriteDate: Date.now(),
  type,
})
