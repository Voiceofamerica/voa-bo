
import { Dispatch } from 'redux'
import AppState from 'types/AppState'
// import { pause, start } from '@voiceofamerica/voa-shared/helpers/psiphonHelper'

import setPsiphonEnabled from '../actions/setPsiphonEnabled'

interface TogglePsiphonOptions {
  psiphonEnabled: boolean
}

export default (options: TogglePsiphonOptions) =>
  async (dispatch: Dispatch<AppState>) => {
    const { psiphonEnabled } = options

    // if (psiphonEnabled) {
    //   await start()
    // } else {
    //   await pause()
    // }
    dispatch(setPsiphonEnabled({ psiphonEnabled }))
  }
