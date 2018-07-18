import * as React from 'react'

import ErrorBoundary from '@voiceofamerica/voa-shared/components/ErrorBoundary'

import { errorBoundaryLabels } from 'labels'

interface Props extends React.Props<any> {
}

export default ({ children }: Props) => (
  <ErrorBoundary error={errorBoundaryLabels.error} retry={errorBoundaryLabels.retry} debug>
    {children}
  </ErrorBoundary>
)
