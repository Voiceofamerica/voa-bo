
import { Dispatch } from 'redux'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import AppState from 'types/AppState'

import { showControls } from '@voiceofamerica/voa-shared/helpers/mediaControlHelper'
import { port, toggleObservable } from '@voiceofamerica/voa-shared/helpers/psiphonHelper'
import playMedia from '../actions/playMedia'
import toggleMediaDrawer from '../actions/toggleMediaDrawer'

let psiphonStartSubscription: Subscription

interface PlayMediaOptions {
  mediaUrl: string
  mediaTitle: string
  mediaDescription: string
  isVideo: boolean
  imageUrl?: string
}

export default (options: PlayMediaOptions) =>
  (dispatch: Dispatch<AppState>, getState: () => AppState) => {
    dispatch(toggleMediaDrawer({ open: true }))
    let playing = false

    const {
      mediaUrl: originalMediaUrl,
    } = options

    const state = getState()
    if (state.media.originalMediaUrl === originalMediaUrl) {
      return
    }

    if (psiphonStartSubscription) {
      psiphonStartSubscription.unsubscribe()
    }

    showControls({
      title: options.mediaTitle,
      playing: true,
    })
    .catch(() => {
      console.warn('failed to show media controls')
    })

    psiphonStartSubscription = toggleObservable.subscribe(psiphonRunning => {
      if (typeof device === 'undefined' || device.platform !== 'iOS' || !psiphonRunning) {
        dispatch(playMedia({
          ...options,
          originalMediaUrl,
          keepLocation: playing,
        }))
        playing = true
        return
      }

      const encodedUrl = encodeURIComponent(originalMediaUrl)

      port()
        .then(portNum => `http://127.0.0.1:${portNum}/tunneled-rewrite/${encodedUrl}?m3u8=true`)
        .then(mediaUrl => {
          dispatch(playMedia({
            ...options,
            mediaUrl,
            originalMediaUrl,
            keepLocation: playing,
          }))
          playing = true
        })
        .catch(err => {
          console.error('something went wrong trying to play media', originalMediaUrl)
          console.error(err)
        })
    })
  }
