
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { psiphonIndicator } from './PsiphonIndicator.scss'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import toggleCircumventionDrawer from 'redux-store/actions/toggleCircumventionDrawer'

interface DispatchProps {
  toggleCircumventionDrawer: () => void
}

interface Props extends React.Props<HTMLImageElement>, DispatchProps {
}

const PsiphonIndicatorBase = ({ ref, toggleCircumventionDrawer }: Props) => {
  return (
    <img ref={ref} className={psiphonIndicator} src={require('./psiphon_on.svg')} onClick={toggleCircumventionDrawer} />
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  toggleCircumventionDrawer: () => {
    dispatch(toggleMediaDrawer({ open: false }))
    dispatch(toggleCircumventionDrawer({}))
  },
})

export default connect(null, mapDispatchToProps)(PsiphonIndicatorBase)
