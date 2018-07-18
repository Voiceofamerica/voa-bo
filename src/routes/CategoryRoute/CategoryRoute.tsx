
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'

import { fromArticleList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'
import ArticleCollection from 'containers/ArticleCollection'

import Loader from 'components/Loader'
import PullToRefresh from 'components/PullToRefresh'

import { homeRoute, row, content, searchButton } from './CategoryRoute.scss'
import * as Query from './CategoryRoute.graphql'
import { CategoryRouteQuery, CategoryRouteQueryVariables } from 'helpers/graphql-types'
import analytics, { AnalyticsProps } from '@voiceofamerica/voa-shared/helpers/analyticsHelper'
import { graphqlAudience, homeLabels } from 'labels'

export interface Params {
  category: string
}

export interface State {
  categoryLoaded: boolean
}

type OwnProps = RouteComponentProps<Params>
type QueryProps = ChildProps<RouteComponentProps<void>, CategoryRouteQuery>

type Props = QueryProps & OwnProps & AnalyticsProps

class HomeRouteBase extends React.Component<Props, State> {
  state: State = {
    categoryLoaded: false,
  }

  componentWillReceiveProps (nextProps: Props) {
    const { data: { variables: { category: newCategory }, loading } } = nextProps
    const { data: { variables: { category: oldCategory } } } = this.props
    if (newCategory !== oldCategory) {
      this.setState({ categoryLoaded: false })
    } else if (!loading) {
      this.setState({ categoryLoaded: true })
    }
  }

  render () {
    const { data } = this.props
    const { categoryLoaded } = this.state

    return (
      <div className={homeRoute}>
        <Loader data={data} hasContent={data.content && data.content.length > 0 && categoryLoaded}>
          { this.renderContent() }
        </Loader>
      </div>
    )
  }

  private renderSearchButton = () => {
    const { category } = this.props.match.params
    return (
      <div className={row}>
        <button className={searchButton} onClick={() => this.goTo(`/search/${category}`)}>
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

const withHomeQuery = graphql(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<CategoryRouteQueryVariables> => ({
      variables: {
        source: graphqlAudience,
        category: parseInt(ownProps.match.params.category, 10),
      },
    }),
  },
)

const withAnalytics = analytics<Props>(({ match }, { match: oldMatch }) => ({
  state: 'Category Section',
  title: 'Category Section',
  section: match.params.category,
  skip: match.params.category === (oldMatch && oldMatch.params && oldMatch.params.category),
}))

export default compose(
  withHomeQuery,
  withAnalytics,
)(HomeRouteBase)
