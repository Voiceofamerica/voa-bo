
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'

import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import toggleCircumventionDrawer from 'redux-store/actions/toggleCircumventionDrawer'
import toggleMediaPlaying from 'redux-store/actions/toggleMediaPlaying'
import AppState from 'types/AppState'

import { bottomNav, centerIcon, mediaIsOpen, centerButton, backgroundImage, overlay } from './MainBottomNav.scss'

interface OwnProps {
  left: JSX.Element[]
  right: JSX.Element[]
}

interface StateProps {
  mediaDrawerOpen: boolean
  mediaImageUrl: string
  mediaPlaying: boolean
}

interface DispatchProps {
  toggleMediaPlayer: () => void
  togglePlay: () => void
}

type Props = OwnProps & DispatchProps & StateProps

class MainBottomNavBase extends React.Component<Props> {
  hasImage () {
    const { mediaImageUrl } = this.props
    return !!mediaImageUrl
  }

  renderImage () {
    const { mediaImageUrl } = this.props

    if (!this.hasImage()) {
      return null
    }

    return (
     <div className={backgroundImage}>
       <ResilientImage src={mediaImageUrl} style={{ overflow: 'hidden', borderRadius: 100 }} />
       <div className={overlay} />
      </div>
    )
  }

  renderIcon () {
    const { mediaPlaying } = this.props
    if (mediaPlaying) {
      return <SvgIcon src='pause' className={centerIcon} />
    } else {
      return <SvgIcon src='play' className={centerIcon} style={{marginLeft: '0.2em'}} />
    }
  }

  roundItemAction = () => {
    const { mediaDrawerOpen, togglePlay, toggleMediaPlayer } = this.props

    if (mediaDrawerOpen) {
      togglePlay()
    } else {
      toggleMediaPlayer()
    }
  }

  render () {
    const { left, right, mediaDrawerOpen } = this.props

    let className = mediaDrawerOpen ? `${bottomNav} ${mediaIsOpen}` : bottomNav

    return (
      <BottomNav flex className={className}>
        {left}
        <RoundItem onClick={this.roundItemAction} className={centerButton}>
          { this.renderImage() }
          { this.renderIcon() }
        </RoundItem>
        {right}
      </BottomNav>
    )
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  mediaDrawerOpen: state.media.mediaOpen,
  mediaImageUrl: state.media.imageUrl,
  mediaPlaying: state.media.playing,
})

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
  toggleMediaPlayer: () => {
    dispatch(toggleMediaDrawer({}))
    dispatch(toggleCircumventionDrawer({ open: false }))
  },
  togglePlay: () => dispatch(toggleMediaPlaying({})),
})

const withRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default withRedux(MainBottomNavBase)
