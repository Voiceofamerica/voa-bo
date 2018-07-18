
import { Action } from 'redux'

export const type = 'SET_MEDIA_PLAYBACK_RATE'

interface SetMediaPlaybackRateOptions {
  mediaPlaybackRate: number
}

export type SetMediaPlaybackRateAction = SetMediaPlaybackRateOptions & Action

export default (options: SetMediaPlaybackRateOptions): SetMediaPlaybackRateAction => ({
  ...options,
  type,
})
