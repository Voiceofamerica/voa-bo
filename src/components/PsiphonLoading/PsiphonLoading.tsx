
import * as React from 'react'

import Spinner from '@voiceofamerica/voa-shared/components/Spinner'
import { ThemeConsumer } from '@voiceofamerica/voa-shared/components/ThemeProvider'

import { psiphonLoadingLabels } from 'labels'

import { psiphonLoading, text, bold, spinner } from './PsiphonLoading.scss'

interface Props {
}

export default class PsiphonLoading extends React.Component<Props> {
  render () {
    return (
      <ThemeConsumer>
        {(theme) => (
          <div className={psiphonLoading} style={{ color: theme.blue, background: theme.lightGrey }}>
            <div className={text}>
              <div className={bold}>
                {psiphonLoadingLabels.bold}
              </div>
              {psiphonLoadingLabels.text}
            </div>
            <Spinner className={spinner} />
          </div>
        )}
      </ThemeConsumer>
    )
  }
}
