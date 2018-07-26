
import * as React from 'react'
import { push } from 'react-router-redux'
import store from 'redux-store'
import toggleCircumventionDrawer from 'redux-store/actions/toggleCircumventionDrawer'
import * as moment from 'moment'

import { setAnalyticsOptions } from '@voiceofamerica/voa-shared/helpers/analyticsBindings'
import { setDirection } from '@voiceofamerica/voa-shared/helpers/textDirectionHelper'

import { Audience } from 'helpers/graphql-types'

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
  cancel: 'Cancel',
}

export const circumventionDrawerLabels = {
  enabledContent: (
    <div>
      <p>
      བཀོལ་ཆས་འདི་ནི་བདེ་འཇགས་ལྡན་ཞིང་གསང་རྒྱ་དམ་པོ་ཡིན།
      </p>
      <p>
        You can change this in
        <a href='#' onClick={() => {
          store.dispatch(push('/settings'))
          store.dispatch(toggleCircumventionDrawer({ open: false }))
        }}>Settings</a>.
      </p>
    </div>
  ),
  disabledContent: (
    <div>
      <p>
      བཀོལ་ཆས་འདི་ནི་བདེ་འཇགས་ལྡན་ཞིང་གསང་རྒྱ་དམ་པོ་ཡིན།
      </p>
      <p>
        You can change this in
        <a href='#' onClick={() => {
          store.dispatch(push('/settings'))
          store.dispatch(toggleCircumventionDrawer({ open: false }))
        }}>Settings</a>.
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
  search: 'Search',
  manage: '+',
}

export const introLabels = {
  content: 'བོད་སྐད་བརྙན་འཕྲིན་དང་རླུང་འཕྲིན།',
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
  videos: 'པར་རིས།',
  audio: 'མོས་པའི་སྒྲ།',
  empty: 'ད་ལྟའི་ཆར་མེད།',
}

export const psiphonLoadingLabels = {
  bold: 'Please be patient.',
  text: 'This may take a few minutes while we gather the best information for you.',
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
  psiphon: 'Secure VPN',
  psiphonOn: 'On',
  psiphonOff: 'Off',
  takeEffectOnRestart: 'You must restart the app for your changes to take effect.',
  okay: 'Okay',
}

export const textSettingsLabels = {
  textSize: 'ཡི་གེའི་ཆེ་ཆུང་འདེམས།',
  normalSize: '1x',
  largeSize: '1.5x',
  hugeSize: '2x',
}
