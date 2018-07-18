
import * as React from 'react'
import { compose } from 'redux'
import { History } from 'history'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'

import TicketList from '@voiceofamerica/voa-shared/components/TicketList'
import { fromVideoArticleList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'

import Loader from 'components/Loader'
import playMedia from 'redux-store/thunks/playMediaFromPsiphon'

import { ProgramVideosQuery, ProgramVideosQueryVariables } from 'helpers/graphql-types'
import { graphqlAudience, programsScreenLabels } from 'labels'

import * as Query from './Videos.graphql'
import { programContent, emptyContent } from './ProgramsScreen.scss'

interface OwnProps {
  history: History
  zoneId: number
}

interface DispatchProps {
  playMedia: (mediaUrl: string, mediaTitle: string, mediaDescription: string, imageUrl: string) => void
}

type QueryProps = ChildProps<OwnProps, ProgramVideosQuery>
type Props = QueryProps & DispatchProps

class VideoPrograms extends React.Component<Props> {
  render () {
    const { data } = this.props

    return (
      <div className={programContent}>
        <Loader data={data}>
          <TicketList
            items={fromVideoArticleList(data.content)}
            onItemClick={this.playVideo}
            emptyContent={this.renderEmpty()}
          />
        </Loader>
      </div>
    )
  }

  private renderEmpty = () => {
    return (
      <div className={emptyContent}>
        {programsScreenLabels.empty}
      </div>
    )
  }

  private playVideo = (id: number) => {
    const { data: { content } } = this.props
    const article = content.find(item => item.id === id)
    const { url, videoTitle, videoDescription, thumbnailTiny } = article.video
    this.props.playMedia(
      url,
      videoTitle,
      videoDescription,
      thumbnailTiny,
    )
  }
}

const withQuery = graphql<QueryProps, ProgramVideosQuery>(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<ProgramVideosQueryVariables> => ({
      variables: {
        source: graphqlAudience,
        zone: ownProps.zoneId,
      },
    }),
  },
)

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, imageUrl) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo: true, imageUrl })),
  }
}

const withRedux = connect(null, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
)(VideoPrograms)
