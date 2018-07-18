
import * as React from 'react'
import { Subscription } from 'rxjs/Subscription'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import { backButtonObservable } from '@voiceofamerica/voa-shared/helpers/cordovaHelper'

import HomeRoute from 'routes/HomeRoute'
import CategoryRoute from 'routes/CategoryRoute'
import ArticleRoute from 'routes/ArticleRoute'
import Settings from 'routes/Settings'
import EditorsChoice from 'routes/EditorsChoice'
import CategorySettings from 'routes/CategorySettings'
import Search from 'routes/Search'
import FavoritesSettings from 'routes/FavoritesSettings'
import ProgramsScreen from 'routes/ProgramsScreen'

import {
  searchLabels,
  categorySettingsLabels,
  settingsLabels,
  editorsChoiceLabels,
  favoritesSettingsLabels,
} from 'labels'

import BottomOnlyLayout from './layouts/BottomOnlyLayout'
import HeadingLayout from './layouts/HeadingLayout'
import HeadingOnlyLayout from './layouts/HeadingOnlyLayout'
import MainLayout from './layouts/MainLayout'

import history from './history'

export default class Router extends React.Component {
  private historySubscription: Subscription

  componentDidMount () {
    this.historySubscription = backButtonObservable.subscribe(() => {
      history.goBack()
    })
  }

  componentWillUnmount () {
    this.historySubscription.unsubscribe()
  }

  render () {
    return (
      <ConnectedRouter history={history}>
        <Switch>
          <Route path='/article/:id' component={ArticleRoute}/>
          <HeadingOnlyLayout path='/search/:zoneId/:query' component={Search} heading={searchLabels.header}/>
          <HeadingOnlyLayout path='/search/:zoneId' component={Search} heading={searchLabels.header}/>
          <HeadingOnlyLayout path='/search' component={Search} heading={searchLabels.header}/>
          <HeadingOnlyLayout path='/settings/favorites' component={FavoritesSettings} heading={favoritesSettingsLabels.header} />
          <HeadingOnlyLayout path='/settings/categories' component={CategorySettings} heading={categorySettingsLabels.header} />
          <HeadingLayout path='/settings' component={Settings} heading={settingsLabels.header} />
          <HeadingLayout path='/editorsChoice' component={EditorsChoice} heading={editorsChoiceLabels.header} />
          <BottomOnlyLayout path='/programs/:type/:zone' component={ProgramsScreen} />
          <BottomOnlyLayout path='/programs/:type' component={ProgramsScreen} />
          <BottomOnlyLayout path='/programs' component={ProgramsScreen} />
          <MainLayout path='/articles/:category' component={CategoryRoute}/>
          <MainLayout path='/' component={HomeRoute}/>
        </Switch>
      </ConnectedRouter>
    )
  }
}
