
import { Action } from 'redux'

export const type = 'PLAY_MEDIA'

interface PlayMediaOptions {
  mediaUrl?: string
  originalMediaUrl: string
  mediaTitle: string
  mediaDescription: string
  isVideo: boolean
  imageUrl?: string
  keepLocation?: boolean
}

export type PlayMediaAction = PlayMediaOptions & Action

export default (options: PlayMediaOptions): PlayMediaAction => ({
  ...options,
  type,
})
