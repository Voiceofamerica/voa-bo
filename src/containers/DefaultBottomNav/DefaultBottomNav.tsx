
import * as React from 'react'
import { History } from 'history'

import { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'

import MainBottomNav from 'containers/MainBottomNav'

import { icon, iconActive } from './DefaultBottomNav.scss'

interface Props {
  history: History
}

const DEFAULT_RGX = /index\.html/
const EMPTY_RGX = /^$/
const HOME_RGX = /^\/$/
const CATEGORY_RGX = /^\/articles/

const EDITORS_CHOICE_RGX = /^\/editorsChoice/
const PROGRAMS_RGX = /^\/programs/
const SETTINGS_RGX = /^\/settings/

function determineIconClass (isActive: boolean) {
  return isActive ? `${icon} ${iconActive}` : icon
}

export default class DefaultBottomNav extends React.Component<Props> {
  checkHome (path: string) {
    return DEFAULT_RGX.test(path) || EMPTY_RGX.test(path) || HOME_RGX.test(path) || CATEGORY_RGX.test(path)
  }

  renderLeft () {
    const { history } = this.props

    const path = history.location.pathname
    const homeActive = this.checkHome(path)
    const editorsChoiceActive = EDITORS_CHOICE_RGX.test(path)

    const homeIconClass = determineIconClass(homeActive)
    const editorsChoiceIconClass = determineIconClass(editorsChoiceActive)

    return [
      <IconItem key={0} active={homeActive} onClick={() => history.replace('/')}>
        <SvgIcon src='home' className={homeIconClass} />
      </IconItem>,
      <IconItem key={1} active={editorsChoiceActive} onClick={() => history.replace('/editorsChoice')}>
        <SvgIcon src='editorsChoice' className={editorsChoiceIconClass} />
      </IconItem>,
    ]
  }

  renderRight () {
    const { history } = this.props

    const path = history.location.pathname
    const programsActive = PROGRAMS_RGX.test(path)
    const settingsActive = SETTINGS_RGX.test(path)

    const programsIconClass = determineIconClass(programsActive)
    const settingsIconClass = determineIconClass(settingsActive)

    return [
      <IconItem key={0} active={programsActive} onClick={() => history.replace('/programs')}>
        <SvgIcon src='programs' className={programsIconClass} />
      </IconItem>,
      <IconItem key={1} active={settingsActive} onClick={() => history.replace('/settings')}>
        <SvgIcon src='settings' className={settingsIconClass} />
      </IconItem>,
    ]
  }

  render () {
    return (
      <MainBottomNav
        left={this.renderLeft()}
        right={this.renderRight()}
      />
    )
  }
}
