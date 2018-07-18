
import {
  type as markIntroDoneType,
} from '../actions/markIntroDone'

import { ActorMap, buildReducer } from '../actorMap'
import ProgressState from 'types/ProgressState'

const actors: ActorMap<ProgressState> = {
  [markIntroDoneType]: (prev) => ({
    ...prev,
    introDone: true,
  }),
}

export const INITIAL_STATE: ProgressState = {
  introDone: false,
}

export default buildReducer(INITIAL_STATE, actors)
