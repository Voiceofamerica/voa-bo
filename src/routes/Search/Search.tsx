
import * as React from 'react'
import { compose } from 'redux'
import { throttle } from 'lodash'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import shallowCompare from 'shallow-compare'

import AppState from 'types/AppState'
import Category from 'types/Category'

import analytics, { AnalyticsProps } from '@voiceofamerica/voa-shared/helpers/analyticsHelper'
import { searchLabels } from 'labels'

import SearchArea from './SearchArea'

import { searchScreen, inputs, inputsPill, backButton, dropdownPill, dropdown, dropdownArrow, searchInputContainer, searchInput } from './Search.scss'

interface StateProps {
  categories: Category[]
}

type OwnProps = RouteComponentProps<{ query: string, zoneId: string }>

type Props = OwnProps & StateProps & AnalyticsProps

interface State {
  debouncedQuery: string
}

const THROTTLE_TIMEOUT = 1000

class SearchBase extends React.Component<Props, State> {
  state: State = {
    debouncedQuery: this.props.match.params.query,
  }

  private setDebouncedQuery = throttle(
      (debouncedQuery: string) => {
        this.setState({ debouncedQuery })
      },
      THROTTLE_TIMEOUT,
    )

  componentWillReceiveProps (nextProps: Props) {
    if (!shallowCompare(this, nextProps, this.state)) {
      return false
    }

    const { query } = nextProps.match.params
    this.setDebouncedQuery(query)

    return true
  }

  replace = (route: string) => {
    const { history } = this.props
    history.replace(route)
  }

  goTo = (route: string) => {
    const { history } = this.props
    history.push(route)
  }

  setQuery = (query: string) => {
    const { zoneId = '0' } = this.props.match.params
    this.replace(`/search/${zoneId}/${query}`)
  }

  setZoneId = (zoneId: number) => {
    const { query = '' } = this.props.match.params
    this.replace(`/search/${zoneId}/${query}`)
  }

  renderInputs () {
    const { history, categories } = this.props
    const { query = '', zoneId = '0' } = this.props.match.params

    return (
      <div className={inputs}>
        <div onClick={() => history.goBack()} className={backButton}>{searchLabels.back}</div>
        <div className={inputsPill}>
          <div className={dropdownPill}>
            <select value={parseInt(zoneId, 10)} className={dropdown} onChange={ev => this.setZoneId(parseInt(ev.currentTarget.value, 10))}>
              <option value={0}>{searchLabels.all}</option>
              {
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              }
            </select>
            <span className={dropdownArrow}><i className='mdi mdi-chevron-down' /></span>
          </div>
          <div className={searchInputContainer}>
            <input autoFocus className={searchInput} value={query}
            onChange={ev => this.setQuery(ev.currentTarget.value)}
            placeholder={searchLabels.query} />
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { zoneId = '0' } = this.props.match.params
    const { debouncedQuery = '' } = this.state

    return (
      <div className={searchScreen}>
        <SearchArea goTo={this.goTo} query={debouncedQuery} zoneId={parseInt(zoneId, 10)} />
        {this.renderInputs()}
      </div>
    )
  }
}

const withAnalytics = analytics<Props>({
  state: 'Search Results',
  title: 'Search Results',
})

const mapStateToProps = ({ settings: { categories } }: AppState): StateProps => ({
  categories,
})

const withRedux = connect(mapStateToProps)

export default compose(
  withRedux,
  withAnalytics,
)(SearchBase)
