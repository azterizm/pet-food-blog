import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../constants/api'
import { getUser } from '../features/auth'
import { AuthUser } from '../types/auth'

interface ApiOptions extends Partial<Request> {
  params?: Record<string, string>
  debounce?: number
  onSuccess?: (response: any) => void
}
interface ApiReturn<T> {
  loading: boolean
  error: string | null
  data: T | null
  refetch: () => void
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
    fetchData()
  }, deps)

  async function fetchData() {
    setLoading(true)
    const url = new URL(Boolean(API_ENDPOINT) ? API_ENDPOINT : location.origin)
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
        setData(r)
        if (r.error) {
          console.error(
            'Fetch request failed on',
            url.href,
            'with info',
            r.info
          )

          setError(r.info)
        } else setError(null)

        if (options?.onSuccess) options.onSuccess(r)
      })
  }

  function refetch() {
    console.log('REFETCH')
    fetchData()
  }

  return { loading, error, data, refetch }
}

export function useAuth() {
  const [user, setUser] = useState<null | AuthUser>(null)
  const navigate = useNavigate()
  useLayoutEffect(() => {
    fetch()
  }, [])

  function changeUser(arg: AuthUser) {
    setUser(arg)
    localStorage.setItem('user', JSON.stringify(arg))
  }

  function fetch(force: boolean = false) {
    getUser(force).then((r) => {
      if (!r) return
      setUser(r)
      if (!r.profile) navigate('/onboard')
    })
  }

  function refetch() {
    fetch(true)
  }

  return [user, changeUser, refetch] as [
    null | AuthUser,
    (arg: AuthUser) => void,
    () => void
  ]
}
