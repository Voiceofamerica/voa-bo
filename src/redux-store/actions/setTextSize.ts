
import { Action } from 'redux'

export const type = 'SET_TEXT_SIZE'

interface SetTextSizeOptions {
  textSize: number
}

export type SetTextSizeAction = SetTextSizeOptions & Action

export default (options: SetTextSizeOptions): SetTextSizeAction => ({
  ...options,
  type,
})
