
import * as React from 'react'
import { DataValue } from 'react-apollo'

import Loader from '@voiceofamerica/voa-shared/components/Loader'

import { errorBoundaryLabels } from 'labels'

interface Props extends React.Props<HTMLDivElement> {
  data: DataValue<any, any>
  hasContent?: boolean
  className?: string
  style?: React.CSSProperties
}

export default class WrappedLoader extends React.Component<Props> {
  render () {
    const { data, children, className, style, hasContent } = this.props
    const { loading, error, refetch, networkStatus } = data

    return (
      <Loader
        loading={loading}
        error={error}
        refetch={refetch}
        networkStatus={networkStatus}
        className={className}
        style={style}
        hasContent={hasContent}
        errorText={errorBoundaryLabels.error}
        retryText={errorBoundaryLabels.retry}
        backgroundImage={require('static/splash.png')}
      >
        {children}
      </Loader>
    )
  }
}
