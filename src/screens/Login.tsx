import { ReactElement, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthTypeSelector } from '../components/AuthTypeSelector'
import { Loader } from '../components/Loader'
import { TwoColumnLayout } from '../components/TwoColumnLayout'
import { API_ENDPOINT } from '../constants/api'
import { AuthType } from '../types/auth'

export function Login(): ReactElement {
  const [input, setInput] = useState('')
  const [type, setType] = useState<AuthType>('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.localStorage.removeItem('user')
  }, [])

  async function handleSubmit() {
    setError('')
    if (!input) return setError('Input is needed to login.')
    setLoading(true)
    const data = await fetch(API_ENDPOINT + '/auth/login', {
      body: JSON.stringify({ input, type, password: 'placeholder' }),
      headers: { 'content-type': 'application/json' },
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return setError(data.info)
    window.location.href = '/'
  }

  return (
    <TwoColumnLayout
      image='/images/auth.avif'
      subTitle={[
        'Sign in',
        'Login',
        'Sign into your account to get all good stuff!',
      ]}
      title='Welcome back!'
    >
      {loading ? (
        <div className='absolute top-10 left-50% translate-x--50%'>
          <Loader />
        </div>
      ) : (
        <>
          <input
            type='text'
            name='input'
            id='input'
            placeholder='Username or email address'
            className='focus:border-primary focus:outline-none mt-10 mb-5 p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element w-60% text-center'
            value={input}
            data-lpignore='true'
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key.toLowerCase() == 'enter' && handleSubmit()}
          />
          <AuthTypeSelector
            type={type}
            onChange={setType}
            containerClass='mb-10 gap-5'
          />
          <button
            onClick={handleSubmit}
            className='mb-10 font-bold c-primary px-5 py-3 rounded-full text-md border-none cursor-pointer focus:brightness-75'
          >
            Send login link
          </button>
          {error ? (
            <p className='c-red-500 text-center mt--5 mb-10 text-lg font-medium'>
              {error}
            </p>
          ) : null}
          <p>
            Don't have account yet?{' '}
            <Link
              className='c-primary decoration-none font-bold'
              to='/register'
            >
              Sign Up
            </Link>
          </p>
        </>
      )}
    </TwoColumnLayout>
  )
}
