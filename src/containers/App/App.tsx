
import * as React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import store, { renderReady } from 'redux-store'
import PsiphonIndicator from 'containers/PsiphonIndicator'
import Router from 'containers/Router'
import MediaPlayer from 'containers/MediaPlayer'
import CircumventionDrawer from 'containers/CircumventionDrawer'
import Intro from 'containers/Intro'
import client from 'helpers/graphql-client'
import { showControls } from '@voiceofamerica/voa-shared/helpers/mediaControlHelper'
import { scheduleDaily } from 'helpers/localNotifications'
import { setPsiphonConfig, start } from '@voiceofamerica/voa-shared/helpers/psiphonHelper'
import { deviceIsReady } from '@voiceofamerica/voa-shared/helpers/cordovaHelper'

import { app } from './App.scss'

interface State {
  appReady: boolean
}

export default class App extends React.Component<{}, State> {
  state: State = {
    appReady: false,
  }

  componentDidMount () {
    renderReady
    .then(() => {
      if (__HOST__) {
        return null
      } else {
        return deviceIsReady
      }
    })
    .then(() => {
      const appState = store.getState()
      if (appState.settings.dailyNotificationOn) {
        scheduleDaily().catch(err => console.error(err))
      }

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
          {
            appReady
            ? <div key='app' className={app}>
                <Intro />
                <PsiphonIndicator />
                <Router />
                <MediaPlayer />
                <CircumventionDrawer />
              </div>
            : <div key='app' />
          }
        </Provider>
      </ApolloProvider>
    )
  }

  private ready = () => {
    console.log('app ready')
    this.setState({ appReady: true }, () => {
      const splash = (navigator as any).splashscreen
      if (splash) {
        splash.hide()
      }
      if (typeof StatusBar !== 'undefined') {
        StatusBar.overlaysWebView(false)
        StatusBar.backgroundColorByHexString('#eeeeee')
        StatusBar.styleDefault()
      }
    })
  }
}
