
import {
  type as playMediaType,
  PlayMediaAction,
} from '../actions/playMedia'

import {
  type as toggleMediaDrawerType,
  ToggleMediaDrawerAction,
} from '../actions/toggleMediaDrawer'

import {
  type as toggleMediaPlayingType,
  ToggleMediaPlayingAction,
} from '../actions/toggleMediaPlaying'

import { ActorMap, buildReducer } from '../actorMap'
import MediaState from 'types/MediaState'

const actors: ActorMap<MediaState> = {
  [playMediaType]: (prev, { mediaUrl, originalMediaUrl, mediaTitle, mediaDescription, imageUrl = null, isVideo, keepLocation }: PlayMediaAction) => ({
    ...prev,
    mediaUrl,
    originalMediaUrl,
    mediaTitle,
    mediaDescription,
    imageUrl,
    isVideo,
    keepLocation,
    playing: true,
    mediaOpen: true,
  }),
  [toggleMediaDrawerType]: (prev, { open: mediaOpen = !prev.mediaOpen }: ToggleMediaDrawerAction) => ({
    ...prev,
    mediaOpen,
  }),
  [toggleMediaPlayingType]: (prev, { playing = !prev.playing }: ToggleMediaPlayingAction) => ({
    ...prev,
    playing: prev.mediaUrl && playing,
  }),
}

export const INITIAL_STATE: MediaState = {
  mediaOpen: false,
  playing: false,
}

export default buildReducer(INITIAL_STATE, actors)
