import { useEffect, useState } from 'react'
import { API_ENDPOINT } from '../constants/api'

interface ApiOptions extends Partial<Request> {}
interface ApiReturn<T> {
  loading: boolean
  error: string | null
  data: T | null
}

export function useApi<T>(path: string, options?: ApiOptions, deps: any[] = []): ApiReturn<T> {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [data, setData] = useState<null | T>(null)

  useEffect(() => {
    setLoading(true)
    const url = new URL(Boolean(API_ENDPOINT) ? API_ENDPOINT : location.origin)
    url.pathname = path
    fetch(
      url,
      !options
        ? { credentials: 'include' }
        : Object.assign(options, { credentials: 'include' }),
    )
      .then((r) => r.json())
      .catch((r) => ({ error: true, info: r.message }))
      .then((r) => {
        setLoading(false)
        if (r.error) setError(r.info)
        else setData(r)
      })
  }, deps)

  return { loading, error, data }
}
