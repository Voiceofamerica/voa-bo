
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { compose } from 'redux'

import markIntroDone from 'redux-store/actions/markIntroDone'
import AppState from 'types/AppState'

import {
  introLabels,
} from 'labels'

import { introRoute, content, continueButton } from './Intro.scss'

interface StateProps {
  introDone: boolean
}

interface DispatchProps {
  onContinue: () => void
}

type Props = StateProps & DispatchProps

class SettingsRoute extends React.Component<Props> {
  render () {
    const { introDone, onContinue } = this.props

    if (introDone) {
      return null
    }

    return (
      <div className={introRoute}>
        <div className={content}>
          {introLabels.content}
        </div>
        <div className={continueButton} onClick={onContinue}>{introLabels.continue}</div>
      </div>
    )
  }
}

const mapStateToProps = ({ progress: { introDone } }: AppState): StateProps => ({
  introDone,
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  onContinue: () => dispatch(markIntroDone()),
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withRedux,
)(SettingsRoute)
