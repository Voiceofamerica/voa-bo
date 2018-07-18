
import * as React from 'react'
import { compose } from 'redux'
import { History } from 'history'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'

import TicketList from '@voiceofamerica/voa-shared/components/TicketList'
import { fromAudioArticleList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'

import Loader from 'components/Loader'
import playMedia from 'redux-store/thunks/playMediaFromPsiphon'

import { ProgramAudioQuery, ProgramAudioQueryVariables } from 'helpers/graphql-types'
import { graphqlAudience, programsScreenLabels } from 'labels'

import * as Query from './Audio.graphql'
import { programContent, emptyContent } from './ProgramsScreen.scss'

interface OwnProps {
  history: History
  zoneId: number
}

interface DispatchProps {
  playMedia: (mediaUrl: string, mediaTitle: string, mediaDescription: string, imageUrl: string) => void
}

type QueryProps = ChildProps<OwnProps, ProgramAudioQuery>
type Props = QueryProps & DispatchProps

class AudioPrograms extends React.Component<Props> {
  render () {
    const { data } = this.props

    return (
      <div className={programContent}>
        <Loader data={data}>
          <TicketList
            items={fromAudioArticleList(data.content)}
            onItemClick={this.playAudio}
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

  private playAudio = (id: number) => {
    const { data: { content } } = this.props
    const article = content.find(item => item.id === id)
    const { url, audioTitle, audioDescription } = article.audio
    this.props.playMedia(
      url,
      audioTitle,
      audioDescription,
      article.image && article.image.hero,
    )
  }
}

const withQuery = graphql<QueryProps, ProgramAudioQuery>(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<ProgramAudioQueryVariables> => ({
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
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo: false, imageUrl })),
  }
}

const withRedux = connect(null, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
)(AudioPrograms)
