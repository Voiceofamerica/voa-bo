
import * as React from 'react'
import { History } from 'history'
import { graphql, ChildProps } from 'react-apollo'

import TicketList from '@voiceofamerica/voa-shared/components/TicketList'
import { fromPhotoGalleryArticleList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'

import Loader from 'components/Loader'

// import { programsScreenLabels } from 'labels'
import { ProgramGalleriesQuery, ProgramGalleriesQueryVariables } from 'helpers/graphql-types'
import { graphqlAudience, programsScreenLabels } from 'labels'
import * as Query from './Galleries.graphql'

import { programContent, emptyContent } from './ProgramsScreen.scss'

interface OwnProps {
  history: History
}

type Props = ChildProps<OwnProps, ProgramGalleriesQuery>

class GalleryPrograms extends React.Component<Props> {

  render () {
    const { data } = this.props

    return (
      <div className={programContent}>
        <Loader data={data}>
          <TicketList
            items={fromPhotoGalleryArticleList(data.content)}
            onItemClick={this.goToArticle}
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

  private goTo = (route: string) => {
    const { history } = this.props
    history.push(route)
  }

  private goToArticle = (id: number) => {
    this.goTo(`/article/${id}`)
  }
}

const withQuery = graphql<Props, ProgramGalleriesQuery>(
  Query,
  {
    options: {
      variables: {
        source: graphqlAudience,
      } as ProgramGalleriesQueryVariables,
    },
  },
)

export default withQuery(GalleryPrograms)
