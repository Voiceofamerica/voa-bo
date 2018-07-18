
import * as React from 'react'
import { DataValue } from 'react-apollo'
import Refresher from 'react-refresher'

import Spinner from '@voiceofamerica/voa-shared/components/Spinner'
import { ThemeConsumer } from '@voiceofamerica/voa-shared/components/ThemeProvider'

import { pullToRefreshLabels } from 'labels'

import { pullIcon, upsideDown, loadGap } from './PullToRefresh.scss'

interface Props {
  data: DataValue<any, any>
}

const LOADING_HEIGHT = 30

export default class PullToRefresh extends React.Component<Props> {
  render () {
    const { data, children } = this.props

    return (
      <ThemeConsumer>
        {(theme) => (
          <Refresher
            onRefresh={data.refetch}
            spinner={<Spinner style={{ height: LOADING_HEIGHT }} />}
            refreshColor={theme.blue}
            downArrow={<div className={loadGap}><i className={`mdi mdi-arrow-down ${pullIcon}`} /> {pullToRefreshLabels.pull}</div>}
            upArrow={<div className={loadGap}><i className={`mdi mdi-arrow-down ${pullIcon} ${upsideDown}`} /> {pullToRefreshLabels.release}</div>}
            successIcon={<i className='mdi mdi-check' />}
            errorIcon={<i className='mdi mdi-close' />}
          >
            {children}
          </Refresher>
        )}
      </ThemeConsumer>
    )
  }
}
