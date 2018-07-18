
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Subscription } from 'rxjs/Subscription'

import MediaPlayer from '@voiceofamerica/voa-shared/components/MediaPlayer'
import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import Drawer from '@voiceofamerica/voa-shared/components/Drawer'

import * as mediaControlHelper from '@voiceofamerica/voa-shared/helpers/mediaControlHelper'
import { appPauseObservable, appClosing } from '@voiceofamerica/voa-shared/helpers/cordovaHelper'
import AppState from 'types/AppState'
import MediaState from 'types/MediaState'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import toggleMediaPlaying from 'redux-store/actions/toggleMediaPlaying'

import { mediaPlayerLabels } from 'labels'

import {
  mediaPlayer,
  playerWrapper,
  player,
  backgroundImage,
  textContent,
  defaultText,
} from './MediaPlayer.scss'

interface StateProps {
  media: MediaState
  mediaPlaybackRate: number
}

interface DispatchProps {
  closeMedia: () => void
  toggleMediaPlaying: (playing?: boolean) => void
}

type Props = StateProps & DispatchProps

interface State {
  defaultTime?: number
  destroying?: boolean
}

class MediaPlayerBase extends React.Component<Props, State> {
  state: State = {}

  private player: MediaPlayer

  private controlsSubscription: Subscription
  private appPauseSubscription: Subscription

  componentDidMount () {
    this.controlsSubscription = mediaControlHelper.eventObservable.subscribe(ev => {
      console.log('recieved:', ev)
      switch (ev) {
        case 'music-controls-pause':
          this.props.toggleMediaPlaying(false)
          return
        case 'music-controls-destroy':
          this.setState({ destroying: true }, () => {
            this.props.toggleMediaPlaying(false)
          })
          return
        case 'music-controls-play':
          this.props.toggleMediaPlaying(true)
          return
        case 'music-controls-media-button':
          this.props.toggleMediaPlaying()
      }
    })
    this.appPauseSubscription = appPauseObservable.subscribe(() => {
      if (this.props.media.isVideo) {
        this.props.toggleMediaPlaying(false)
      }
    })
    appClosing.then(() => {
      this.props.toggleMediaPlaying(false)
    }).catch(() => null)
  }

  componentWillUnmount () {
    this.controlsSubscription.unsubscribe()
    this.appPauseSubscription.unsubscribe()
  }

  componentWillReceiveProps (nextProps: Props) {
    if (this.player) {
      if (this.props.media.playing !== nextProps.media.playing) {
        this.player.togglePlay(nextProps.media.playing)
        if (!this.state.destroying) {
          mediaControlHelper.setPlaying(nextProps.media.playing)
            .catch(() => null)
        }
      }
      if (nextProps.media.keepLocation && this.props.media.originalMediaUrl === this.props.media.originalMediaUrl) {
        this.setState({ defaultTime: this.player.getTime() })
      }
      if (this.state.destroying && !nextProps.media.playing) {
        this.setState({ destroying: false })
      }
    }
  }

  renderDefault () {
    return (
      <div>
        <ResilientImage src={require('../../../static/MediaDefault.png')} />
        <div className={textContent}>
          <div className={defaultText}>
            {mediaPlayerLabels.empty}
          </div>
        </div>
      </div>
    )
  }

  renderPlayer () {
    const { defaultTime } = this.state
    const { media: { mediaUrl, playing, mediaOpen, isVideo }, mediaPlaybackRate, toggleMediaPlaying } = this.props
    if (!mediaUrl) {
      return null
    }

    return (
      <div className={playerWrapper}>
        {this.renderImage()}
        <MediaPlayer
          audio={!isVideo}
          ref={this.setPlayer}
          className={player}
          src={mediaUrl}
          controls={mediaOpen}
          playbackRate={mediaPlaybackRate}
          autoPlay={playing}
          onTogglePlay={toggleMediaPlaying}
          loadingText={mediaPlayerLabels.loading}
          defaultTime={defaultTime}
        />
      </div>
    )
  }

  renderImage () {
    const { media: { imageUrl, isVideo } } = this.props

    if (isVideo) {
      return null
    }

    return (
      <ResilientImage
        src={imageUrl}
        className={backgroundImage}
      />
    )
  }

  renderContent () {
    const { media: { mediaUrl, mediaTitle, mediaDescription } } = this.props
    if (!mediaUrl) {
      return this.renderDefault()
    }

    return (
      <div>
        {this.renderPlayer()}
        <div className={textContent}>
          <h1>{mediaTitle}</h1>
          <div>{mediaDescription}</div>
        </div>
      </div>
    )
  }

  render () {
    const { media: { mediaOpen }, closeMedia } = this.props
    return (
      <Drawer className={mediaPlayer} open={mediaOpen} onClose={closeMedia}>
        {this.renderContent()}
      </Drawer>
    )
  }

  private setPlayer = (player: MediaPlayer) => {
    this.player = player
  }
}

const mapStateToProps = ({ settings: { mediaPlaybackRate }, media }: AppState): StateProps => {
  return {
    media,
    mediaPlaybackRate,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => {
  return {
    closeMedia: () => dispatch(toggleMediaDrawer({ open: false })),
    toggleMediaPlaying: (playing) => dispatch(toggleMediaPlaying({ playing })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerBase)
