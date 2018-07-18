
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import Drawer from '@voiceofamerica/voa-shared/components/Drawer'

import AppState from 'types/AppState'
import toggleCircumventionDrawer from 'redux-store/actions/toggleCircumventionDrawer'

import { circumventionDrawerLabels } from 'labels'

import { content } from './CircumventionDrawer.scss'

interface StateProps {
  open: boolean
  psiphonEnabled: boolean
}

interface DispatchProps {
  close: () => void
}

type Props = StateProps & DispatchProps

class CircumventionDrawerBase extends React.Component<Props> {
  render () {
    const { open, close, psiphonEnabled } = this.props
    return (
      <Drawer open={open} onClose={close} className={content}>
        {
          psiphonEnabled
          ? circumventionDrawerLabels.enabledContent
          : circumventionDrawerLabels.disabledContent
        }
      </Drawer>
    )
  }
}

const mapStateToProps = ({ circumventionDrawer: { open }, settings: { psiphonEnabled } }: AppState): StateProps => {
  return {
    open,
    psiphonEnabled,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => {
  return {
    close: () => dispatch(toggleCircumventionDrawer({})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CircumventionDrawerBase)
