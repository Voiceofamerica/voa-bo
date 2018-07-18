
import * as React from 'react'
import { Route, RouteProps } from 'react-router'

import TopNav, { CenterText } from '@voiceofamerica/voa-shared/components/TopNav'

import ErrorBoundary from 'components/ErrorBoundary'

import { layout } from '../layout.scss'

interface Props extends RouteProps {
  heading: string
}

function MainLayout ({ component: Component, heading, ...rest }: Props) {
  return (
    <Route {...rest} render={props => {
      return (
        <div className={layout}>
          <TopNav flex>
            <CenterText>
              {heading}
            </CenterText>
          </TopNav>

          <div className={layout}>
            <ErrorBoundary>
              <Component {...props as any} />
            </ErrorBoundary>
          </div>
        </div>
      )
    }} />
  )
}

export default MainLayout
