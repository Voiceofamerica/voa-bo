
import * as React from 'react'
import { Route, RouteProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'

import TopNav, { CenterText } from '@voiceofamerica/voa-shared/components/TopNav'

import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import ErrorBoundary from 'components/ErrorBoundary'
import DefaultBottomNav from 'containers/DefaultBottomNav'

import { layout } from '../layout.scss'

interface OwnProps extends RouteProps {
  heading: string
}

interface StateProps {
}

interface DispatchProps {
  toggleMediaPlayer: () => void
}

type Props = StateProps & OwnProps & DispatchProps

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

          <DefaultBottomNav history={props.history} />
        </div>
      )
    }} />
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  toggleMediaPlayer: () => dispatch(toggleMediaDrawer({})),
})

const withRedux = connect(
  null,
  mapDispatchToProps,
)

export default withRedux(MainLayout)
