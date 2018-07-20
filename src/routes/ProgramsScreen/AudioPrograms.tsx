
import * as React from 'react'
import { compose } from 'redux'
import { History } from 'history'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'
import * as moment from 'moment'

import TicketList from '@voiceofamerica/voa-shared/components/TicketList'
import { fromProgramList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'

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
            items={fromProgramList(data.audioProgram, d => moment(d).format('L'))}
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
    const { data: { audioProgram } } = this.props
    const program = audioProgram.find(item => item.id === id)
    const { url, programTitle, programDescription, image } = program
    this.props.playMedia(
      url,
      programTitle,
      programDescription,
      image && image.hero,
    )
  }
}

const withQuery = graphql<QueryProps, ProgramAudioQuery>(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<ProgramAudioQueryVariables> => ({
      variables: {
        source: graphqlAudience,
        category: ownProps.zoneId,
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
