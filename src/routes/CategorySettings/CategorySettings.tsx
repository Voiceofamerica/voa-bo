
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps, compose } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import PillManager, { Pill, PillSpacer } from '@voiceofamerica/voa-shared/components/PillManager'
import PopupButtonGroup, { PopupButton } from '@voiceofamerica/voa-shared/components/PopupButtonGroup'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'
import { themed, ThemeProps } from '@voiceofamerica/voa-shared/components/ThemeProvider'

import setCategoryOrder from 'redux-store/actions/setCategoryOrder'
import AppState from 'types/AppState'
import Category from 'types/Category'

import * as Query from './CategorySettings.graphql'
import { CategorySettingsQuery, CategorySettingsQueryVariables } from 'helpers/graphql-types'
import Loader from 'components/Loader'
import { graphqlAudience, categorySettingsLabels, homeLabels } from 'labels'

import { categorySettings, content, icon, headlinesSubtitle, sectionHeader, sectionName } from './CategorySettings.scss'

type OwnProps = RouteComponentProps<void>

interface StateProps {
  categories: Category[]
}

interface DispatchProps {
  changeOrder: (categories: Category[]) => void
}

type Props = ChildProps<OwnProps & StateProps & DispatchProps, CategorySettingsQuery> & ThemeProps

interface LocalState {
  selectedId: number | null
  topButtonPosition: number
  bottomButtonPosition: number
}

class CategorySettingsBase extends React.Component<Props, LocalState> {
  state: LocalState = {
    selectedId: null,
    topButtonPosition: 0,
    bottomButtonPosition: 0,
  }

  render () {
    const { data, history, categories: chosenCategories, theme = {} } = this.props
    const { selectedId, topButtonPosition, bottomButtonPosition } = this.state
    const unChosenCategories = this.filterCategories(chosenCategories, data.zones)

    return (
      <div className={categorySettings}>
        <Loader data={data}>
          <div className={content}>
            <PillManager>
              <Pill>{homeLabels.headlines}</Pill>
            </PillManager>
            <div className={headlinesSubtitle}>
              <div>{categorySettingsLabels.headlinesFirst}</div>
            </div>
            <PillManager>
              <PillSpacer>
                <div className={sectionHeader}>
                  <div className={sectionName}>{categorySettingsLabels.myCategories}</div>
                </div>
              </PillSpacer>
              {
                chosenCategories.map(({ id, name }) => (
                  <Pill key={id} onClick={this.onPillClick(id, true)} selected={id === selectedId}>
                    {name}
                  </Pill>
                ))
              }
              <PillSpacer>
                <div key={'separator'} className={sectionHeader}>
                  <div className={sectionName}>{categorySettingsLabels.allCategories}</div>
                </div>
              </PillSpacer>
              {
                unChosenCategories.map(({ id, name }) => (
                  <Pill key={id} onClick={this.onPillClick(id, false)} selected={id === selectedId}>
                    {name}
                  </Pill>
                ))
              }
            </PillManager>
            <PopupButtonGroup verticalPosition={topButtonPosition} show={selectedId && chosenCategories.some(cat => cat.id === selectedId)}>
              <PopupButton onClick={this.onKillClick}>
                <SvgIcon src='close' style={{ color: theme.red }} />
              </PopupButton>
              <PopupButton onClick={this.onUpClick}>
                <SvgIcon src='chevronUp' />
              </PopupButton>
              <PopupButton onClick={this.onDownClick}>
                <SvgIcon src='chevronDown' />
              </PopupButton>
              <PopupButton onClick={this.onCancelClick} style={{ fontSize: 15, minWidth: 50 }}>
                {categorySettingsLabels.cancel}
              </PopupButton>
            </PopupButtonGroup>
            <PopupButtonGroup verticalPosition={bottomButtonPosition} show={selectedId && unChosenCategories.some(cat => cat.id === selectedId)}>
              <PopupButton onClick={this.onAddClick}>
                <SvgIcon src='plus' style={{ color: theme.accentGreen }} />
              </PopupButton>
              <PopupButton onClick={this.onCancelClick} style={{ fontSize: 15, minWidth: 50 }}>
                {categorySettingsLabels.cancel}
              </PopupButton>
            </PopupButtonGroup>
          </div>
        </Loader>
        <BottomNav flex>
          <IconItem onClick={() => history.goBack()}>
            <SvgIcon src='back' className={icon} />
          </IconItem>
        </BottomNav>
      </div>
    )
  }

  private filterCategories (chosenCategories: Category[], allCategories: Category[] = []) {
    return allCategories
      .filter(zone => chosenCategories.findIndex(category => category.id === zone.id) < 0)
  }

  private onPillClick = (selectedId: number, top: boolean) => (ev: React.MouseEvent<HTMLDivElement>) => {
    const target = ev.currentTarget
    const rect = target.getBoundingClientRect()
    const buttonPosition = rect.top + rect.height + 10
    const positionName: keyof LocalState = top ? 'topButtonPosition' : 'bottomButtonPosition'

    this.setState({ selectedId, [positionName]: buttonPosition } as any)
  }

  private onKillClick = () => {
    const { selectedId } = this.state
    const chosenCategories = this.props.categories.filter(cat => cat.id !== selectedId)

    this.setState({ selectedId: null })
    this.props.changeOrder(chosenCategories)
  }

  private onAddClick = () => {
    const { selectedId } = this.state
    const category = this.props.data.zones.find(cat => cat.id === selectedId)

    const chosenCategories = [
      ...this.props.categories,
      category,
    ]

    this.setState({ selectedId: null })
    this.props.changeOrder(chosenCategories)
  }

  private onUpClick = () => {
    const { selectedId } = this.state
    const newIndex = Math.max(this.props.categories.findIndex(cat => cat.id === selectedId) - 1, 0)

    const chosenCategories = this.jumpCategory(selectedId, newIndex)

    this.props.changeOrder(chosenCategories)
  }

  private onDownClick = () => {
    const { selectedId } = this.state
    const newIndex = Math.min(this.props.categories.findIndex(cat => cat.id === selectedId) + 1, this.props.categories.length - 1)

    const chosenCategories = this.jumpCategory(selectedId, newIndex)

    this.props.changeOrder(chosenCategories)
  }

  private onCancelClick = () => {
    this.setState({ selectedId: null })
  }

  private jumpCategory = (selectedId: number, newIndex: number) => {
    const category = this.props.data.zones.find(cat => cat.id === selectedId)
    const filteredCategories = this.props.categories.filter(cat => cat.id !== selectedId)

    return [
      ...filteredCategories.slice(0, newIndex),
      category,
      ...filteredCategories.slice(newIndex),
    ]
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  categories: state.settings.categories,
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  changeOrder: (categories: Category[]) => dispatch(setCategoryOrder({ categories })),
})

const withQuery = graphql(
  Query,
  {
    options: {
      variables: {
        source: graphqlAudience,
      } as CategorySettingsQueryVariables,
    },
    props: ({ data }) => {
      let outputData = data as (typeof data) & CategorySettingsQuery
      if (!data.loading && !data.error) {
        outputData.zones = outputData.zones || []
      }

      return { data: outputData }
    },
  },
)

export default compose(
  themed,
  connect(mapStateToProps, mapDispatchToProps),
  withQuery,
)(CategorySettingsBase)
