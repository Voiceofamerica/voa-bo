
import * as React from 'react'
import * as YouTubePlayer from 'youtube-player'
import 'whatwg-fetch'

import Loader from '@voiceofamerica/voa-shared/components/Loader'
import TicketList, { ListItem } from '@voiceofamerica/voa-shared/components/TicketList'

import { errorBoundaryLabels, programsScreenLabels } from 'labels'

import { emptyContent, programContent, ytp } from './ProgramsScreen.scss'

interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

interface YouTubeVideoItem {
  id: {
    kind: string,
    videoId: string,
  }
  snippet: {
    title: string,
    description: string,
    thumbnails: {
      default: YouTubeThumbnail,
      medium: YouTubeThumbnail,
      high: YouTubeThumbnail,
    },
  }
}

interface YouTubeResponse {
  items: YouTubeVideoItem[]
}

interface State {
  playingVideo: any | null
  videos: YouTubeVideoItem[] | null,
  error: any | null,
}

const API_KEY = 'AIzaSyBizwzamIRGj6mPOwPaGkqVcQAmTJYmPR0'
const CHANNEL_ID = 'UC8d0ZgFEl4AUdyAKGE8O3yg'

class YouTubePrograms extends React.Component<{}, State> {
  state: State = {
    playingVideo: null,
    videos: null,
    error: null,
  }

  player: any | null = null

  componentDidMount () {
    this.fetch()
  }

  render () {
    const { videos, error } = this.state

    const loading = videos === null && error === null

    const ticketListItems = this.getListItems()

    return (
      <div className={programContent}>
        <Loader
          loading={loading}
          error={error}
          refetch={this.fetch}
          networkStatus={1}
          hasContent={videos !== null}
          errorText={errorBoundaryLabels.error}
          retryText={errorBoundaryLabels.retry}
          backgroundImage={require('static/splash.png')}
        >
          <div id={ytp} />
          <TicketList
            items={ticketListItems}
            onItemClick={this.playVideo}
            emptyContent={this.renderEmpty()}
          />
        </Loader>
      </div>
    )
  }

  private playVideo = (id) => {
    if (this.state.playingVideo === id) {
      return
    }

    this.setState({ playingVideo: id })
    if (id !== null) {
      const player = this.getPlayer()
      player.loadVideoById(id)
      player.playVideo()
    }
  }

  private getPlayer = () => {
    if (this.player === null) {
      this.player = YouTubePlayer(ytp)
    }

    return this.player
  }

  private renderEmpty = () => {
    return (
      <div className={emptyContent}>
        {programsScreenLabels.empty}
      </div>
    )
  }

  private getListItems = () => {
    const { videos } = this.state
    if (videos === null) {
      return []
    }

    return videos.map<ListItem>(({ id, snippet }) => {
      const { videoId } = id
      const { title, thumbnails } = snippet

      return {
        id: videoId as any,
        title,
        // minorText: description,
        image: {
          tiny: thumbnails.default.url,
          thumb: thumbnails.medium.url,
          hero: thumbnails.high.url,
        },
        icon: 'video',
      }
    })
  }

  private fetch = () => {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50`)
      .then<YouTubeResponse>(res => {
        if (res.status >= 400) {
          throw res.json()
        } else {
          return res.json()
        }
      })
      .then(content => {
        this.setState({ videos: content.items, error: null })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }
}

export default YouTubePrograms
