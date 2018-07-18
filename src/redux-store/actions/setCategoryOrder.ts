
import { Action } from 'redux'
import Category from 'types/Category'

export const type = 'SET_CATEGORY_ORDER'

interface SetCategoryOptions {
  categories: Category[]
}

export type SetCategoryAction = SetCategoryOptions & Action

export default (options: SetCategoryOptions): SetCategoryAction => ({
  ...options,
  type,
})
