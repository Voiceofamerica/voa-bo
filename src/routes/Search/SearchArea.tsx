
import * as React from 'react'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'

import TicketList from '@voiceofamerica/voa-shared/components/TicketList'
import { fromArticleList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'

import Loader from 'components/Loader'

import { SearchQuery, SearchQueryVariables } from 'helpers/graphql-types'

import { graphqlAudience, searchLabels } from 'labels'

import * as Query from './Search.graphql'

import { searchArea, emptyText } from './Search.scss'

interface OwnProps {
  goTo: (route: string) => void
  query: string
  zoneId?: number | null
}

type Props = ChildProps<OwnProps, SearchQuery>

class SearchAreaBase extends React.Component<Props> {
  render () {
    const { data } = this.props
    return (
      <div className={searchArea}>
        <Loader data={this.props.data}>
          <TicketList
            items={fromArticleList(data.search)}
            onItemClick={this.goToArticle}
            emptyContent={this.renderEmpty()}
          />
        </Loader>
      </div>
    )
  }

  private renderEmpty = () => {
    return (
      <div className={emptyText}>
        {searchLabels.empty}
      </div>
    )
  }

  private goToArticle = (id: number) => {
    this.props.goTo(`/article/${id}`)
  }
}

const withSearchQuery = graphql<Props, SearchQuery>(
  Query,
  {
    options: (props: OwnProps): QueryOpts<SearchQueryVariables> => ({
      variables: {
        source: graphqlAudience,
        query: props.query,
        zoneId: props.zoneId,
      },
      fetchPolicy: 'cache-and-network',
    }),
  },
)

export default withSearchQuery(SearchAreaBase)
