import { useEffect } from 'react'

export function useUndefinedParam(...arg: any[]) {
  useEffect(() => {
    const available = arg.find((r) => typeof r === 'undefined' || r === null)
    if (available) window.location.href = '/'
  }, [])
}
