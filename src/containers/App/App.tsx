
import * as React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { push } from 'react-router-redux'

import { showControls } from '@voiceofamerica/voa-shared/helpers/mediaControlHelper'
import { setPsiphonConfig, start } from '@voiceofamerica/voa-shared/helpers/psiphonHelper'
import { deviceIsReady } from '@voiceofamerica/voa-shared/helpers/cordovaHelper'
import { initializeNotifications, coldStartSubject, notificationSubject } from '@voiceofamerica/voa-shared/helpers/pushNotificationHelper'
import setNotificationStatus from '@voiceofamerica/voa-shared/redux/actions/setNotificationStatus'
import NotificationToast from '@voiceofamerica/voa-shared/components/NotificationToast'

import store, { renderReady } from 'redux-store'
import PsiphonLoading from 'components/PsiphonLoading'
import PsiphonIndicator from 'containers/PsiphonIndicator'
import Router from 'containers/Router'
import MediaPlayer from 'containers/MediaPlayer'
import CircumventionDrawer from 'containers/CircumventionDrawer'
import Intro from 'containers/Intro'
import client from 'helpers/graphql-client'
import { defaultAppTopic } from 'labels'

import { app } from './App.scss'

interface State {
  appReady: boolean
}

export default class App extends React.Component<{}, State> {
  state: State = {
    appReady: false,
  }

  componentDidMount () {
    deviceIsReady.then(() => {
      const splash = (navigator as any).splashscreen
      splash.hide()
    }).catch(err => {
      console.warn('could not hide splashscreen', err)
    })

    renderReady
      .then(() => {
        const appState = store.getState()

        initializeNotifications(defaultAppTopic)
          .subscribe(status => {
            if (status.initialized && status.subscriptions.length > 0) {
              store.dispatch(setNotificationStatus({ shouldGetPushNotifications: true }))
            }
          })

        notificationSubject.subscribe(notification => {
          console.log('notification', notification)
        })

        coldStartSubject.subscribe(notification => {
          console.log('coldStart', notification)
          if (notification.additionalData.articleId) {
            this.goToArticle(notification.additionalData.articleId)
          }
        })

        console.log('psiphon enabled?', appState.settings.psiphonEnabled)
        if (appState.settings.psiphonEnabled) {
          setPsiphonConfig(require('../../psiphon_config.json'))
          start()
            .then(this.ready)
            .catch(err => {
              console.error('FATAL: psiphon failed to start correctly', err)
            })
        } else if (!__HOST__) {
          deviceIsReady
            .then(this.ready)
            .catch(err => {
              console.error('FATAL: something went wrong during initialization', err)
            })
        } else {
          this.ready()
        }

        if (appState.media.mediaTitle) {
          showControls({
            title: appState.media.mediaTitle,
            playing: false,
          }).catch(() => {
            console.warn('media controls failed to load')
          })
        }
      }).catch(err => {
        console.error('FATAL: redux store failed to hyrate correctly', err)
      })
  }

  render () {
    const { appReady } = this.state
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          {appReady ? (
            <div key='app' className={app}>
              <Intro />
              <NotificationToast goToArticle={this.goToArticle} />
              <PsiphonIndicator />
              <Router />
              <MediaPlayer />
              <CircumventionDrawer />
            </div>
          ) : (
            <div key='app' className={app}>
              <PsiphonLoading />
            </div>
          )}
        </Provider>
      </ApolloProvider>
    )
  }

  private goToArticle = (articleId: string) => {
    store.dispatch(push(`/article/${articleId}`))
  }

  private ready = () => {
    this.setState({ appReady: true }, () => {
      if (typeof StatusBar !== 'undefined') {
        StatusBar.overlaysWebView(false)
        StatusBar.backgroundColorByHexString('#eeeeee')
        StatusBar.styleDefault()
      }
    })
  }
}
