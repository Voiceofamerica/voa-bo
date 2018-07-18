
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { isWebHost } from '@voiceofamerica/voa-shared/helpers/cordovaHelper'

import './globalStyle.scss'

import App from './containers/App'

isWebHost(__HOST__)

const rootElement = document.getElementById('app')

let render = (Component, cb?) => {
  ReactDOM.render(
    <Component />,
    rootElement,
    cb,
  )
}
if (module.hot) {
  render = Component => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      rootElement,
    )
  }

  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    render(NextApp)
  })
}

render(App)
