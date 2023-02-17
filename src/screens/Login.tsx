import _, { isObject } from 'lodash'
import { ReactElement, useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AuthTypeSelector } from '../components/AuthTypeSelector'
import { Loader } from '../components/Loader'
import { TwoColumnLayout } from '../components/TwoColumnLayout'
import { VerificationCodeInput } from '../components/VerificationCodeInput'
import { API_ENDPOINT } from '../constants/api'
import { ApiProcess } from '../types/api'
import { AuthType } from '../types/auth'

enum Stage {
  Info,
  Verify,
}

export function Login(): ReactElement {
  const [input, setInput] = useState('')
  const [type, setType] = useState<AuthType>('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<Stage>(Stage.Info)
  const [query] = useSearchParams()
  const [code, setCode] = useState('')
  const { state } = useLocation()

  useEffect(() => {
    window.localStorage.removeItem('user')
  }, [])

  async function handleSendCode() {
    setError('')
    setLoading(true)
    const data = await fetch(`${API_ENDPOINT}/auth/send_code`, {
      body: JSON.stringify({
        type,
        input,
      }),
      headers: { 'content-type': 'application/json' },
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    console.log(data)
    setLoading(false)
    if (data.error) return setError(data.info)
    setStage(Stage.Verify)
  }

  async function handleVerify() {
    setLoading(true)

    const data: ApiProcess = await fetch(`${API_ENDPOINT}/auth/login`, {
      body: JSON.stringify({
        code,
        type,
        input,
        password: 'placeholder',
      }),
      headers: { 'content-type': 'application/json' },
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    console.log('data:', data)
    setLoading(false)
    if (data.error)
      return setError(
        isObject(data.info) ? (data as any).info.message : data.info
      )

    setTimeout(() => {
      const redirect = state?.redirect || query.get('redirect')
      window.location.href = redirect || '/'
    }, 1000)
  }

  return (
    <TwoColumnLayout
      image='/images/auth3.jpg'
      subTitle={[
        'Sign in',
        'Login',
        'Sign into your account to get all good stuff!',
      ]}
      title='Welcome back!'
      hideHeadings={stage !== Stage.Info}
    >
      {loading ? (
        <div className='absolute top-10 left-50% translate-x--50%'>
          <Loader />
        </div>
      ) : (
        <>
          {stage === Stage.Info ? (
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
                onKeyDown={(e) =>
                  e.key.toLowerCase() == 'enter' && handleSendCode()
                }
              />
              <AuthTypeSelector
                type={type}
                onChange={setType}
                containerClass='mb-10 gap-5'
              />
            </>
          ) : stage === Stage.Verify ? (
            <VerificationCodeInput value={code} onChange={setCode} />
          ) : null}
          <button
            onClick={() =>
              stage === Stage.Info ? handleSendCode() : handleVerify()
            }
            className='mb-10 font-bold c-primary px-5 py-3 rounded-full text-md border-none cursor-pointer focus:brightness-75'
          >
            {stage === Stage.Info ? 'Continue' : 'Login'}
          </button>

          {stage === Stage.Verify ? (
            <p className='flex-center gap-0'>
              <span>Didn't recieve code?</span>
              <button
                onClick={handleSendCode}
                className='c-primary font-bold bg-white border-none underline'
              >
                Resend
              </button>
            </p>
          ) : stage === Stage.Info ? (
            <p>
              Don't have account yet?{' '}
              <Link
                className='c-primary decoration-none font-bold'
                to='/register'
              >
                Sign Up
              </Link>
            </p>
          ) : null}
          {error ? (
            <p className='c-red-500 text-center mt--5 mb-10 text-lg font-medium mt-5'>
              {error}
            </p>
          ) : null}
        </>
      )}
    </TwoColumnLayout>
  )
}
