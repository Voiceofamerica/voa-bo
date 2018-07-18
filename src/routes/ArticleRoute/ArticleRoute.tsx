
import * as React from 'react'
import { compose } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import { fromRelatedArticleList } from '@voiceofamerica/voa-shared/helpers/itemListHelper'
import PhotoGallery from '@voiceofamerica/voa-shared/components/PhotoGallery'
import { StaticTicketList } from '@voiceofamerica/voa-shared/components/TicketList'
import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'

import { ArticleRouteQuery, ArticleRouteQueryVariables } from 'helpers/graphql-types'
import playMedia from 'redux-store/thunks/playMediaFromPsiphon'
import toggleFavoriteContent from 'redux-store/actions/toggleFavoriteContent'

import analytics, { AnalyticsProps } from '@voiceofamerica/voa-shared/helpers/analyticsHelper'
import { generatePDF } from 'helpers/articlePrinter'
import MainBottomNav from 'containers/MainBottomNav'
import ErrorBoundary from 'components/ErrorBoundary'
import Loader from 'components/Loader'
import { graphqlAudience, articleLabels } from 'labels'

import AppState from 'types/AppState'

import {
  articleRoute,
  container,
  heading,
  articleText,
  paragraph,
  relatedArticles,
  relatedContentHeading,
  mediaButtonContainer,
  mediaButton,
  mediaButtonIcon,
  articleAuthors,
  byline,
  icon,
  iconActive,
  heroImage,
} from './ArticleRoute.scss'
import * as Query from './ArticleRoute.graphql'

export interface Params {
  id: string
}

interface StateProps {
  isFavorite: boolean
  textSize: number
}

interface DispatchProps {
  playMedia: (url: string, title: string, description: string, isVideo: boolean, imageUrl?: string) => void
  toggleFavorite: (favorite?: boolean) => void
}

type BaseProps = RouteComponentProps<Params>
type QueryProps = ChildProps<BaseProps, ArticleRouteQuery>
type OwnProps = QueryProps
type Props = QueryProps & DispatchProps & StateProps & AnalyticsProps

interface State {
  detailAnalyticsSent: boolean
}

class ArticleRouteBase extends React.Component<Props, State> {
  state: State = {
    detailAnalyticsSent: false,
  }

  container = React.createRef<HTMLDivElement>()

  componentDidMount () {
    this.sendDetailAnalyticsEvent()
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ detailAnalyticsSent: false }, () => this.sendDetailAnalyticsEvent())
      const containerElement = this.container.current
      if (containerElement) {
        containerElement.scrollTop = 0
      }
    } else {
      this.sendDetailAnalyticsEvent()
    }
  }

  renderBottomNav () {
    const { history, isFavorite } = this.props

    const favoriteIconClass = isFavorite ? `${icon} ${iconActive}` : icon

    return (
      <MainBottomNav
        left={[
          <IconItem key={0} onClick={() => history.goBack()}>
            <SvgIcon src='back' className={icon} />
          </IconItem>,
          <IconItem key={1} onClick={this.share}>
            <SvgIcon src='share' className={icon} />
          </IconItem>,
        ]}
        right={[
          <IconItem key={0} onClick={this.toggleFavorite}>
            <SvgIcon src='favorite' className={favoriteIconClass} />
          </IconItem>,
          <IconItem key={1} onClick={this.download}>
            <SvgIcon src='download' className={icon} />
          </IconItem>,
        ]}
      />
    )
  }

  renderImage () {
    const { image } = this.props.data.content[0]
    if (!image || !image.hero) {
      return null
    }

    return <ResilientImage src={image.hero} className={heroImage} />
  }

  renderHeading () {
    const { title, pubDate, authors } = this.props.data.content[0]
    const authorNames = authors
      .map(auth => auth.name)
      .map(name => `${name.first} ${name.last}`)

    return (
      <div className={heading}>
        <h1>{title}</h1>
        <hr />
        <div className={byline}>
          <div className={articleAuthors}>
          {
            authorNames.map((name, idx) => (
              <h2 key={idx}>{name}</h2>
            ))
          }
          </div>
          <div>
            <h3>{moment(pubDate).format('lll')}</h3>
          </div>
        </div>
      </div>
    )
  }

  renderUpdatedDate () {
    const { lastUpdated, pubDate } = this.props.data.content[0]
    const published = moment(pubDate)
    const updated = moment(lastUpdated)

    if (published.diff(updated) === 0) {
      return null
    }

    return (
      <div style={{ fontWeight: 'bold' }}>
        {articleLabels.updatedOn(updated.format('lll'))}
      </div>
    )
  }

  renderVideo () {
    const { data, playMedia, analytics } = this.props
    const article = data.content[0]
    const { video } = article

    if (!video || !video.url) {
      return null
    }
    const onClick = () => {
      playMedia(video.url, article.title, video.videoDescription, true, video.thumbnailTiny)
      analytics.articleVideoStart({
        articleId: `${article.id}`,
        articleTitle: article.title,
        videoTitle: article.title,
        authors: this.getAuthorsString(),
        pubDate: article.pubDate,
      }).catch()
    }

    return (
      <div
        className={mediaButton}
        onClick={onClick}
      >
        <SvgIcon src='video' className={mediaButtonIcon} />
      </div>
    )
  }

  renderAudio () {
    const { data, playMedia, analytics } = this.props
    const article = data.content[0]
    const { audio } = article

    if (!audio || !audio.url) {
      return null
    }

    const imgUrl = article.image && article.image.hero
    const onClick = () => {
      playMedia(audio.url, audio.audioTitle, audio.audioDescription, false, imgUrl)
      analytics.articleAudioStart({
        articleId: `${article.id}`,
        articleTitle: article.title,
        audioTitle: audio.audioTitle,
        authors: this.getAuthorsString(),
        pubDate: article.pubDate,
      }).catch()
    }

    return (
      <div
        className={mediaButton}
        onClick={onClick}
      >
        <SvgIcon src='audio' className={mediaButtonIcon}/>
      </div>
    )
  }

  renderMedia () {
    return (
      <div className={mediaButtonContainer}>
        {this.renderVideo()}
        {this.renderAudio()}
      </div>
    )
  }

  renderArticle () {
    const { data } = this.props
    if (data.loading || data.error || !(data.content && data.content[0])) {
      return null
    }

    const article = data.content[0]

    const paragraphs = article.content.split(/\n/g)

    return (
      <div className={container} ref={this.container}>
        {this.renderImage()}
        {this.renderHeading()}
        <div className={articleText}>
          {
            paragraphs.map((text, index) => (
              <div key={index} className={paragraph}>
                {index === 0 ? this.renderMedia() : null}
                {text}
              </div>
            ))
          }
          {this.renderUpdatedDate()}
        </div>
        {this.renderGallery()}
        <hr />
        {this.renderRelatedArticles()}
      </div>
    )
  }

  render () {
    const { textSize } = this.props

    return (
      <div className={articleRoute} style={{ fontSize: `${textSize}em` }}>
        <Loader data={this.props.data}>
          <ErrorBoundary>
            { this.renderArticle() }
          </ErrorBoundary>
        </Loader>
        { this.renderBottomNav() }
      </div>
    )
  }

  private renderRelatedArticles = () => {
    const { data } = this.props
    const article = data.content[0]
    if (article.relatedStories.length === 0) {
      return null
    }

    return (
      <div className={relatedArticles}>
        <span className={relatedContentHeading}>
          {articleLabels.relatedContent}
        </span>
        <StaticTicketList
          items={fromRelatedArticleList(article.relatedStories)}
          onItemClick={this.goToArticle}
        />
      </div>
    )
  }

  private renderGallery = () => {
    const { data } = this.props
    const article = data.content[0]
    if (!article.photoGallery) {
      return null
    }

    return (
      article.photoGallery.map(gallery => (
        <PhotoGallery key={gallery.id} gallery={gallery} loadingText={articleLabels.galleryLoading} />
      ))
    )
  }

  private share = () => {
    if (!this.props.data.content || !this.props.data.content[0]) {
      return
    }
    const article = this.props.data.content[0]
    const articleId = this.props.match.params.id
    const authors = article.authors.map(({ name: { first, last } }) => `${first} ${last}`).join('; ')

    const {
      url,
      title: articleTitle,
      pubDate,
    } = article

    window.plugins.socialsharing.shareWithOptions({
      message: articleLabels.shareMessage,
      url,
    }, ({ completed, app }) => {
      console.log('shared with:', app)
      if (completed) {
        this.props.analytics.shareArticle({
          articleId,
          articleTitle,
          authors,
          pubDate,
          shareType: app && app.toString(),
        }).catch()
      }
    })
  }

  private download = () => {
    if (!this.props.data.content || !this.props.data.content[0]) {
      return
    }
    const { title, authors, pubDate, content } = this.props.data.content[0]
    const authorNames = authors
      .map(({ name: { first, last } }) => `${first} ${last}`)

    generatePDF({
      title,
      by: authorNames.join('; '),
      pubDate: moment(pubDate).format('lll'),
      content,
    }).catch(console.error)
  }

  private toggleFavorite = () => {
    if (!this.props.data.content || !this.props.data.content[0]) {
      return
    }

    const article = this.props.data.content[0]
    const articleId = this.props.match.params.id
    const authors = article.authors
      .map(({ name: { first, last } }) => `${first} ${last}`).join('; ')

    const {
      title: articleTitle,
      pubDate,
    } = article

    this.props.analytics.favoriteArticle({
      articleId,
      articleTitle,
      authors,
      pubDate,
    }).catch()
    this.props.toggleFavorite()
  }

  private goToArticle = (id: number) => {
    const { history } = this.props
    history.push(`/article/${id}`)
  }

  private getAuthorsString = () => {
    if (!this.props.data.content || !this.props.data.content[0]) {
      return ''
    }
    const article = this.props.data.content[0]
    return article.authors.map(({ name: { first, last } }) => `${first} ${last}`).join('; ')
  }

  private sendDetailAnalyticsEvent = () => {
    if (!this.state.detailAnalyticsSent) {
      const { loading, content } = this.props.data
      if (!loading && content && content[0]) {
        this.setState({ detailAnalyticsSent: true })
        const article = content[0]
        this.props.analytics.articleDetail({
          articleId: `${article.id}`,
          articleTitle: article.title,
          authors: this.getAuthorsString(),
          pubDate: article.pubDate,
        }).catch()
      }
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => {
  return {
    isFavorite: !!state.favorites[ownProps.match.params.id],
    textSize: state.settings.textSize,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: OwnProps): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl?) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl })),
    toggleFavorite: (favorite?: boolean) => {
      if (!ownProps.data || !ownProps.data.content || !ownProps.data.content[0]) {
        return
      }

      const { id, title, content, pubDate } = ownProps.data.content[0]
      dispatch(toggleFavoriteContent({ id, title, content, pubDate, favorite }))
    },
  }
}

const withAnalytics = analytics<Props>(({ data }) => {
  const {
    id = undefined,
    title = undefined,
    authors = [],
    pubDate = undefined,
  } = data.content && data.content[0] || {}

  return {
    skip: data.loading || !data.content || !data.content[0],
    itemType: 'article',
    state: title,
    title,
    byline: authors.map(({ name: { first, last } }) => `${first} ${last}`).join('; '),
    pubDate,
    articleId: id,
  }
})

const withQuery = graphql(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<ArticleRouteQueryVariables> => ({
      variables: {
        source: graphqlAudience,
        id: parseInt(ownProps.match.params.id, 10),
      },
    }),
  },
)

const withRedux = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
  withAnalytics,
)(ArticleRouteBase)
