
import {
  type as toggleFavoriteContentType,
  ToggleFavoriteContentAction,
} from '../actions/toggleFavoriteContent'

import {
  type as clearFavoritesType,
} from '../actions/clearFavorites'

import { ActorMap, buildReducer } from '../actorMap'
import FlatMap from 'types/FlatMap'
import FavoriteContent from 'types/FavoriteContent'

const actors: ActorMap<FlatMap<FavoriteContent>> = {
  [toggleFavoriteContentType]: (prev, { id, title, content, pubDate, favorite = !prev[id] }: ToggleFavoriteContentAction) => {
    const newState = {
      ...prev,
    }

    if (favorite) {
      newState[id] = {
        id,
        title,
        content,
        pubDate,
      }
    } else {
      delete newState[id]
    }

    return newState
  },
  [clearFavoritesType]: () => ({}),
}

export const INITIAL_STATE: FlatMap<FavoriteContent> = {}

export default buildReducer(INITIAL_STATE, actors)
