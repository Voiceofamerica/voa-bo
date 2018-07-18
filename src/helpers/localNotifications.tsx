
export function canUseNotifications (): boolean {
  if (typeof device === 'undefined') {
    return false
  }

  const version = device.version.split(/\.|\-/).map(val => parseInt(val, 10))
  return device.platform !== 'Android' || version[0] > 4 || (version[0] === 4 && version[1] > 3)
}

export function schedule (notification: NotificationPlugin.Notification | (NotificationPlugin.Notification[])): Promise<void> {
  if (canUseNotifications() && cordova && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
    return new Promise((resolve, reject) => {
      cordova.plugins.notification.local.schedule(notification, (response) => {
        if (response) {
          resolve()
        } else {
          reject()
        }
      })
    })
  }

  return Promise.resolve()
}

export function cancel (ids: string[]): Promise<string> {
  if (canUseNotifications() && cordova && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
    return new Promise((resolve) => {
      cordova.plugins.notification.local.cancel(ids, resolve)
    })
  }

  return Promise.resolve('ok')
}

export function hasPermission (): Promise<boolean> {
  if (canUseNotifications() && cordova && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
    return new Promise((resolve) => {
      cordova.plugins.notification.local.hasPermission(resolve)
    })
  }

  return Promise.resolve(false)
}

export function requestPermission (): Promise<boolean> {
  if (canUseNotifications() && cordova && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
    return new Promise((resolve) => {
      cordova.plugins.notification.local.requestPermission(resolve)
    })
  }

  return Promise.resolve(false)
}

export const DAILY_NOTIFICATION_ID = 'daily'

export async function scheduleDaily () {
  await cancelDaily()

  const firstAt = new Date()
  firstAt.setDate(firstAt.getDate() + 1)
  firstAt.setHours(9, 0, 0, 0)

  return schedule({
    id: DAILY_NOTIFICATION_ID,
    title: 'Read VoA!',
    trigger: { count: 14, every: 'day', firstAt },
  })
}

export function cancelDaily () {
  return cancel([DAILY_NOTIFICATION_ID])
}
