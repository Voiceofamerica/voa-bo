
import {
  type as toggleCircumventionDrawerType,
  ToggleCircumventionDrawerAction,
} from '../actions/toggleCircumventionDrawer'

import { ActorMap, buildReducer } from '../actorMap'
import CircumventionDrawerState from 'types/CircumventionDrawerState'

const actors: ActorMap<CircumventionDrawerState> = {
  [toggleCircumventionDrawerType]: (prev, { open = !prev.open }: ToggleCircumventionDrawerAction) => ({
    ...prev,
    open,
  }),
}

export const INITIAL_STATE: CircumventionDrawerState = {
  open: false,
}

export default buildReducer(INITIAL_STATE, actors)
