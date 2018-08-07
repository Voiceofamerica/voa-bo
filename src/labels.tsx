
import * as React from 'react'
import { push } from 'react-router-redux'
import store from 'redux-store'
import toggleCircumventionDrawer from 'redux-store/actions/toggleCircumventionDrawer'
import * as moment from 'moment'

import { setAnalyticsOptions } from '@voiceofamerica/voa-shared/helpers/analyticsBindings'
import { setDirection } from '@voiceofamerica/voa-shared/helpers/textDirectionHelper'

import { Audience } from 'helpers/graphql-types'

export const defaultAppTopic = 'bo'

setAnalyticsOptions({
  language: 'tibetan',
  languageService: 'tibetan',
  propertyName: 'voa tibetan news app',
  propertyId: '353',
  rsidAccount: 'bbgvoa.tibetan.streaming.app',
  reportSuite: 'bbgvoa.tibetan.streaming.app',
})
setDirection('ltr')

export const graphqlAudience = Audience.bo

moment.locale('bo')

export const articleLabels = {
  updatedOn: (/*date: string*/) => `གསར་སྣོན་དུས་ཚོད།`,
  relatedContent: 'འབྲེལ་ཡོད་བརྗོད་བྱ།',
  shareMessage: 'གསར་འགྱུར་འདིར་གཟིགས།',
  galleryLoading: 'མཐུད་བཞིན་པ།',
}

export const categorySettingsLabels = {
  header: 'གཙོ་ཆེའི་དཀར་ཆག',
  myCategories: 'ངའི་དཀར་ཆག',
  allCategories: 'དཀར་ཆག་ཁ་ཚང་།',
  dragAndDrop: 'ཁྱེད་ཀྱི་དཀར་ཆག་འདིར་ཞོགས།',
  headlinesFirst: 'འགོ་བརྗོད་དང་པོར་འགོད་པ།',
  cancel: 'བྲིས་སུབ།',
}

export const circumventionDrawerLabels = {
  enabledContent: (
    <div>
      <p>
      འབྲེལ་ཐག་འདི་གསང་བ་དང་སུ་ཡིན་མི་ཤེས།
      </p>
      <p>
        <a href='#' onClick={() => {
          store.dispatch(push('/settings'))
          store.dispatch(toggleCircumventionDrawer({ open: false }))
        }}>ཁྱེད་རང་གིས་སྦར་ཟུམ་བཀོད་སྒྲིག་བྱེད་ཆོག</a>.
      </p>
    </div>
  ),
  disabledContent: (
    <div>
      <p>
      བདེ་འཇགས་མཉེན་ཆས་ཁ་རྒྱོབ།
      </p>
      <p>
        <a href='#' onClick={() => {
          store.dispatch(push('/settings'))
          store.dispatch(toggleCircumventionDrawer({ open: false }))
        }}>ཁྱེད་རང་གིས་སྦར་ཟུམ་བཀོད་སྒྲིག་བྱེད་ཆོག</a>.
      </p>
    </div>
  ),
}

export const editorsChoiceLabels = {
  header: 'རྩོམ་སྒྲིག་པའི་འོས་སྦྱོར།',
}

export const errorBoundaryLabels = {
  error: 'འགག་རྐྱེན་ཞིག་འཕྲད།',
  retry: 'བསྐྱར་མཐུད།',
}

export const favoritesSettingsLabels = {
  header: 'མོས་པའི་ཚན་ཁག',
  removeAll: 'ཚང་མ་སུབས།',
}

export const homeLabels = {
  headlines: 'གསར་འགྱུར་འགོ་བརྗོད།',
  search: 'འཚོལ་ཞིབ།',
  manage: '+',
}

export const introLabels = {
  content: 'ཨ་རིའི་རླུང་འཕྲིན་ཁང་གི་གསར་འགྱུར་ཕབ་ལེན་བྱས་པར་བཀའ་དྲིན་ཆེ། ང་ཚོར་ཁྱེད་རང་གི་བསམ་ཚུལ་བཏང་ནས་བཀོལ་ཆས་འདིར་ལེགས་བཅོས་གནང་བར་ཞུ།',
  continue: 'སྒུག',
}

export const mediaPlayerLabels = {
  empty: (
    <div>
      <p>
      སྒྲ་བརྙན་སོགས་མི་འདུག
      </p>
    </div>
  ),
  loading: 'མཐུད་བཞིན་པ།',
}

export const mediaSettingsLabels = {
  normalSpeed: '1x',
  halfAgainSpeed: '1.5x',
  doubleSpeed: '2x',
  chooseSpeed: 'སྒྲ་བརྙན་དལ་མགྱོགས་ཚད་འདེམས།',
}

export const programsScreenLabels = {
  videos: 'བརྙན་འཕྲིན',
  audio: 'རླུང་འཕྲིན།',
  empty: 'ད་ལྟའི་ཆར་མེད།',
}

export const psiphonLoadingLabels = {
  bold: '',
  text: 'ང་ཚོས་སྐུ་ཉིད་ལ་མཁོ་ངེས་ཀྱི་གནས་ཚུལ་རྣམས་བསྡུ་རུབ་བྱེད་བཞིན་ཡོད།',
}

export const pullToRefreshLabels = {
  pull: 'འཐེན་ནས་བསྐྱར་འཇུག',
  release: 'གློད་ནས་བསྐྱར་འཇུག',
}

export const searchLabels = {
  header: 'རྙེད་འབྲས།',
  back: 'ཕྱིར་ལོག',
  all: 'ཚང་མ།',
  query: 'འཚོལ་ཞིབ།',
  empty: 'བཙལ་བྱ་མ་རྙེད།',
}

export const settingsLabels = {
  header: 'ངའི་བཀོད་རིམ།',
  panic: 'ཤུལ་རྣོག',
  sendToFriends: 'བཀོལ་ཆས་འདི་གཞན་ལ་མཚམས་སྦྱོར་གནང་རོགས།',
  sendFeedback: 'ཨ་རིའི་རླུང་འཕྲིན་ཁང་ལ་དགེ་སྐྱོན་གསུང་རོགས།',
  aboutVoa: 'ཨ་རིའི་རླུང་འཕྲིན་ཁང་གིས་བོད་དང་རྒྱལ་སྤྱིའི་གསར་འགྱུར་གལ་ཆེན་ཁག་བརྙན་འཕྲིན་དང་། རླུང་འཕྲིན། དྲྭ་ལམ་བརྒྱུད་ནས་དུས་ཐོག་ཏུ་རྒྱང་སྲིང་བྱེད།',
  feedbackEmail: 'ttsering@voanews.com',
  feedbackSubject: encodeURIComponent('ཨ་རིའི་རླུང་འཕྲིན་བཀོལ་ཆས་ཀྱི་དགེ་སྐྱོན།'),
  feedbackBody: encodeURIComponent(''),
  shareMessage: 'བཀོལ་ཆས་འདི་ག་འདྲ་ཡོད་པ་གཟིགས་དང་།',
  psiphon: 'བཀོལ་ཆས་བཀོད་སྒྲིག',
  psiphonOn: 'ཁ་ཕྱེ།',
  psiphonOff: 'ཁ་རྒྱབ།',
  takeEffectOnRestart: 'བཅོས་སྒྲིག་ཟིན་རྗེས་བཀོལ་ཆས་ཟུམ་ནས་བསྐྱར་དུ་སྦོར།',
  okay: 'ངེས་གཏན།',
}

export const textSettingsLabels = {
  textSize: 'ཡི་གེའི་ཆེ་ཆུང་འདེམས།',
  normalSize: '1x',
  largeSize: '1.5x',
  hugeSize: '2x',
}
