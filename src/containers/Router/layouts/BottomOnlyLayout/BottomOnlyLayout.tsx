
import * as React from 'react'
import { Route, RouteProps } from 'react-router'

import ErrorBoundary from 'components/ErrorBoundary'
import DefaultBottomNav from 'containers/DefaultBottomNav'

import { layout } from '../layout.scss'

type Props = RouteProps

function BottomOnlyLayout ({ component: Component, ...rest }: Props) {
  return (
    <Route {...rest} render={props => {
      return (
        <div className={layout}>
          <div className={layout}>
            <ErrorBoundary>
              <Component {...props as any} />
            </ErrorBoundary>
          </div>

          <DefaultBottomNav history={props.history} />
        </div>
      )
    }} />
  )
}

export default BottomOnlyLayout
