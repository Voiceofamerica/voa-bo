
import * as React from 'react'
import { Subscription } from 'rxjs/Subscription'
import { connect, Dispatch } from 'react-redux'

import { startObservable } from '@voiceofamerica/voa-shared/helpers/psiphonHelper'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import toggleCircumventionDrawer from 'redux-store/actions/toggleCircumventionDrawer'

import { psiphonIndicator } from './PsiphonIndicator.scss'

const PSIPHON_ON = require('./psiphon_on.svg')
const PSIPHON_OFF = require('./psiphon_off.svg')

interface DispatchProps {
  toggleCircumventionDrawer: () => void
}

interface Props extends DispatchProps {
}

interface State {
  psiphonOn: boolean
}

class PsiphonIndicatorBase extends React.PureComponent<Props, State> {
  state: State = {
    psiphonOn: startObservable.getValue(),
  }

  private subscription: Subscription

  componentDidMount () {
    this.subscription = startObservable.subscribe(psiphonOn => this.setState({ psiphonOn }))
  }

  componentWillUnmount () {
    this.subscription.unsubscribe()
  }

  render () {
    const { psiphonOn } = this.state
    const { toggleCircumventionDrawer } = this.props

    const srcToUse = psiphonOn ? PSIPHON_ON : PSIPHON_OFF

    return (
      <img className={psiphonIndicator} src={srcToUse} onClick={toggleCircumventionDrawer} />
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  toggleCircumventionDrawer: () => {
    dispatch(toggleMediaDrawer({ open: false }))
    dispatch(toggleCircumventionDrawer({}))
  },
})

export default connect(null, mapDispatchToProps)(PsiphonIndicatorBase)
