export function showPluralS(arg: number) {
  return arg > 1 ? 's' : ''
}

export function showCompactNumber(arg: number) {
  const formatter = new Intl.NumberFormat('en',{notation: 'compact'})
  return formatter.format(arg)
}

export function showDuration(arg: number | string) {
  const sec_num = parseInt(String(arg)) * 60 // don't forget the second param
  const hours: number | string = Math.floor(sec_num / 3600)
  const minutes: number | string = Math.floor((sec_num - hours * 3600) / 60)
  const seconds: number | string = sec_num - hours * 3600 - minutes * 60

  return `${decideDuration(hours, 'hour')} ${decideDuration(
    minutes,
    'minute'
  )} ${decideDuration(seconds, 'second')}`
}

function decideDuration(arg: number, label: string) {
  return arg > 0 ? `${arg} ${label}${showPluralS(arg)}` : ''
}

export const isFirefox = typeof (window as any).InstallTrigger !== 'undefined'
