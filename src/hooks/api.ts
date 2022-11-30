import { useEffect, useState } from 'react'
import { API_ENDPOINT } from '../constants/api'

interface ApiOptions extends Partial<Request> {
  params?: Record<string, string>
  debounce?: number
}
interface ApiReturn<T> {
  loading: boolean
  error: string | null
  data: T | null
}

export function useApi<T>(
  path: string,
  options?: ApiOptions,
  deps: any[] = []
): ApiReturn<T> {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [data, setData] = useState<null | T>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const url = new URL(
        Boolean(API_ENDPOINT) ? API_ENDPOINT : location.origin
      )
      url.pathname = path
      if (options && options.params)
        Object.keys(options.params).map((r) =>
          url.searchParams.append(r, options.params![r])
        )

      if (options && options.debounce) {
        localStorage.setItem('debounce', '1')
        await new Promise<void>((r) => {
          setTimeout(() => {
            r()
          }, options.debounce)
        })
        localStorage.setItem('debounce', '0')
      }

      fetch(
        url,
        !options
          ? { credentials: 'include' }
          : Object.assign(options, { credentials: 'include' })
      )
        .then((r) => r.json())
        .catch((r) => ({ error: true, info: r.message }))
        .then((r) => {
          setLoading(false)
          if (r.error) {
            console.error(
              'Fetch request failed on',
              url.href,
              'with info',
              r.info
            )

            setError(r.info)
          } else setData(r)
        })
    })()
  }, deps)

  return { loading, error, data }
}
