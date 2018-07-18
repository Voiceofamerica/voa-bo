
import * as React from 'react'
import { compose } from 'redux'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps } from 'react-apollo'

import { fromArticleList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'
import ArticleCollection from 'containers/ArticleCollection'

import { editorsChoice, row, content, searchButton } from './EditorsChoice.scss'
import * as Query from './EditorsChoiceRoute.graphql'
import { EditorsChoiceRouteQuery, EditorsChoiceRouteQueryVariables } from 'helpers/graphql-types'
import analytics, { AnalyticsProps } from '@voiceofamerica/voa-shared/helpers/analyticsHelper'

import Loader from 'components/Loader'
import PullToRefresh from 'components/PullToRefresh'
import { graphqlAudience, homeLabels } from 'labels'

type QueryProps = ChildProps<RouteComponentProps<void>, EditorsChoiceRouteQuery>

type Props = QueryProps & AnalyticsProps

interface State {
}

class EditorsChoiceBase extends React.Component<Props, State> {
  state: State = {
  }

  render () {
    const { data } = this.props

    return (
      <div className={editorsChoice}>
        <Loader data={data} hasContent={data.content && data.content.length > 0}>
          { this.renderContent() }
        </Loader>
      </div>
    )
  }

  private renderSearchButton = () => {
    return (
      <div className={row}>
        <button className={searchButton} onClick={() => this.goTo('/search')}>
          {homeLabels.search}
        </button>
      </div>
    )
  }

  private renderContent = () => {
    const { data } = this.props

    return (
      <div className={content}>
        <PullToRefresh data={data}>
          { this.renderSearchButton() }
          <ArticleCollection
            items={fromArticleList(data.content)}
          />
        </PullToRefresh>
      </div>
    )
  }

  private goTo = (route: string) => {
    const { history } = this.props
    history.push(route)
  }
}

const withAnalytics = analytics<QueryProps>(({ data }) => ({
  state: 'Editor\'s Coice',
  title: 'Editor\'s Coice',
  skip: data.loading,
}))

const withEditorsChoiceQuery = graphql(
  Query,
  {
    options: {
      variables: {
        source: graphqlAudience,
      } as EditorsChoiceRouteQueryVariables,
    },
  },
)

export default compose(
  withEditorsChoiceQuery,
  withAnalytics,
)(EditorsChoiceBase)
