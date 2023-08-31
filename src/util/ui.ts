import { lazy } from 'react'

export function showPluralS(arg: number) {
  return arg > 1 ? 's' : ''
}

export function showCompactNumber(arg: number) {
  const formatter = new Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(arg)
}

export function showDuration(arg: number | string) {
  const sec_num = parseInt(String(arg)) * 60 // don't forget the second param
  const hours: number | string = Math.floor(sec_num / 3600)
  const minutes: number | string = Math.floor((sec_num - hours * 3600) / 60)
  const seconds: number | string = sec_num - hours * 3600 - minutes * 60

  return `${decideDuration(hours, 'hour')} ${
    decideDuration(
      minutes,
      'minute',
    )
  } ${decideDuration(seconds, 'second')}`
}

function decideDuration(arg: number, label: string) {
  return arg > 0 ? `${arg} ${label}${showPluralS(arg)}` : ''
}
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I,
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  })
}

export const isFirefox = typeof (window as any).InstallTrigger !== 'undefined'

export function calculateEstimatedTimeReading(body: string) {
  const len = body.length
  const min = Math.ceil(len / 183)
  return `${min} min read`
}
