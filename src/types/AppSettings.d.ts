
import Category from './Category'

export default interface AppSettings {
  categories: Category[]
  mediaPlaybackRate: number
  dailyNotificationOn: boolean
  psiphonEnabled: boolean
  textSize: number
}
