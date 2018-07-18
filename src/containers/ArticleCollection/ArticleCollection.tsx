
import * as React from 'react'
import { ApolloClient } from 'apollo-client'
import { ApolloConsumer } from 'react-apollo'
import { push } from 'react-router-redux'
import { connect, Dispatch } from 'react-redux'
import * as moment from 'moment'

import { ThemeConsumer, FullTheme } from '@voiceofamerica/voa-shared/components/ThemeProvider'
import { StaticLargeCardList } from '@voiceofamerica/voa-shared/components/LargeCardList'
import { ListItem } from '@voiceofamerica/voa-shared/helpers/itemListHelper'
import { GetArticleQuery } from 'helpers/graphql-types'
import { generatePDF } from 'helpers/articlePrinter'

import toggleFavoriteContent from 'redux-store/actions/toggleFavoriteContent'
import AppState from 'types/AppState'
import { articleLabels, graphqlAudience } from 'labels'

import * as GetArticle from './GetArticle.graphql'

interface OwnProps {
  items: ListItem[]
}

type Props = OwnProps & StateProps & DispatchProps

class ArticleCollection extends React.Component<Props> {
  render () {
    const { items } = this.props

    return (
      <ThemeConsumer>
        {
          (theme) => (
            <ApolloConsumer>
              {
                (client) => {
                  return (
                    <StaticLargeCardList
                      items={items}
                      onItemClick={this.goToArticle}
                      iconButtons={[
                        {
                          icon: 'share',
                          onPress: this.shareArticle(client),
                        },
                        {
                          icon: 'favorite',
                          onPress: this.favoriteArticle(client),
                          getStyle: this.getFavoriteStyle(theme),
                        },
                        {
                          icon: 'download',
                          onPress: this.downloadArticle(client),
                        },
                      ]}
                    />
                  )
                }
              }
            </ApolloConsumer>
          )
        }
      </ThemeConsumer>
    )
  }

  private goToArticle = (id: number) => {
    this.props.goTo(`/article/${id}`)
  }

  private shareArticle = (client: ApolloClient<any>) => async (id: number) => {
    const { url } = await this.fetchArticle(client, id)
    return new Promise<any>((resolve, reject) => {
      window.plugins.socialsharing.shareWithOptions({
        message: articleLabels.shareMessage,
        url,
      }, resolve, reject)
    })
  }

  private favoriteArticle = (client: ApolloClient<any>) => async (id: number) => {
    const { toggleFavorite } = this.props
    const { title, content, pubDate } = await this.fetchArticle(client, id)
    toggleFavorite(id, title, content, pubDate)
  }

  private getFavoriteStyle = (theme: FullTheme) => (id: number) => {
    const { favoriteIds } = this.props
    if (favoriteIds.some(favId => favId === `${id}`)) {
      return {
        color: theme.secondaryColor,
      }
    } else {
      return {}
    }
  }

  private downloadArticle = (client: ApolloClient<any>) => async (id: number) => {
    const { title, authors, pubDate, content } = await this.fetchArticle(client, id)
    const authorNames = authors
      .map(auth => auth.name)
      .map(name => `${name.first} ${name.last}`)

    return generatePDF({
      title,
      by: authorNames.join('; '),
      pubDate: moment(pubDate).format('L'),
      content,
    })
  }

  private fetchArticle = async (client: ApolloClient<any>, id: number) => {
    console.log('fetching', id, client)
    try {
      const result = await client.query<GetArticleQuery>({
        query: GetArticle,
        variables: {
          source: graphqlAudience,
          id,
        },
        notifyOnNetworkStatusChange: undefined,
        fetchPolicy: 'network-only',
      })

      if (result.errors && result.errors.length || !result.data.content) {
        throw result.errors
      }

      const [article] = result.data.content
      if (!article) {
        throw new Error('Article not found')
      }

      return article
    } catch (err) {
      console.warn('An error occurred while fetching the article', err)
      throw err
    }
  }
}

interface StateProps {
  favoriteIds: string[]
}

const withState = (state: AppState): StateProps => ({
  favoriteIds: Object.keys(state.favorites),
})

interface DispatchProps {
  goTo: (route: string) => void
  toggleFavorite: (id: number, title: string, content: string, pubDate: string) => void
}

const withDispatch = (dispatch: Dispatch<AppState>): DispatchProps => ({
  goTo: (route) => dispatch(push(route)),
  toggleFavorite: (id, title, content, pubDate) => dispatch(toggleFavoriteContent({
    id,
    title,
    content,
    pubDate,
  })),
})

const withRedux = connect(withState, withDispatch)

export default withRedux(ArticleCollection)
