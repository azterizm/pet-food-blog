import { generateUsername } from 'friendly-username-generator'
import { isObject } from 'lodash'
import { CaretLeft, MagicWand, X } from 'phosphor-react'
import {
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useState,
} from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { AuthTypeSelector } from '../components/AuthTypeSelector'
import { Loader } from '../components/Loader'
import { TwoColumnLayout } from '../components/TwoColumnLayout'
import { VerificationCodeInput } from '../components/VerificationCodeInput'
import { API_ENDPOINT } from '../constants/api'
import { emailRegex } from '../constants/regex'
import { ApiProcess } from '../types/api'
import { AuthType } from '../types/auth'

const MAX_PHONE = 13
enum Stage {
  Info,
  Phone,
  Verify,
  LoggingIn,
}

export function Register(): ReactElement {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [stage, setStage] = useState<Stage>(Stage.Info)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<AuthType>('user')
  const [code, setCode] = useState('')

  const state = useLocation().state
  const [query] = useSearchParams()

  useEffect(() => {
    setUsername(generateUsername({ useHyphen: false }))
    window.localStorage.removeItem('user')
    return () => {
      setStage(Stage.Info)
      setError('')
      setLoading(false)
      setType('user')
      setUsername('')
      setPhone('')
      setEmail('')
      setName('')
    }
  }, [])

  async function handlePhone() {
    setError('')
    setLoading(true)
    const data = await fetch(`${API_ENDPOINT}/auth/register/${type}`, {
      body: JSON.stringify({
        name,
        email,
        phone,
        username,
        type,
        input: username || email,
        password: 'placeholder',
      }),
      headers: { 'content-type': 'application/json' },
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return setError(data.info)
    setStage(Stage.Verify)
  }

  async function handleResend() {
    setError('')
    setLoading(true)
    const data = await fetch(`${API_ENDPOINT}/auth/send_code`, {
      body: JSON.stringify({
        type,
        input: username || email,
      }),
      headers: { 'content-type': 'application/json' },
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return setError(data.info)
    setStage(Stage.Verify)
  }

  async function handleInfo() {
    setError('')
    const okEmail = emailRegex.test(email)
    if (!okEmail)
      return setError(
        'Please enter correct email address. It does not seem valid.'
      )
    setLoading(true)
    const emailVerifyData: ApiProcess = await fetch(
      `${API_ENDPOINT}/auth/check_email`,
      {
        body: JSON.stringify({
          email,
          type,
        }),
        headers: { 'content-type': 'application/json' },
        method: 'post',
        credentials: 'include',
      }
    ).then((r) => r.json())
    setLoading(false)
    if (emailVerifyData.error) return setError(emailVerifyData.info)
    setStage(Stage.Phone)
  }

  async function handleVerify() {
    setLoading(true)

    const data: ApiProcess = await fetch(`${API_ENDPOINT}/auth/login`, {
      body: JSON.stringify({
        code,
        type,
        input: email || username,
        password: 'placeholder',
      }),
      headers: { 'content-type': 'application/json' },
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error)
      return setError(
        isObject(data.info) ? (data as any).info.message : data.info
      )
    setStage(Stage.LoggingIn)

    setTimeout(() => {
      const redirect = state?.redirect || query.get('redirect') || '/'
      window.location.href = redirect || '/'
    }, 1000)
  }

  async function handleSubmitClick() {
    if (stage === Stage.Info) await handleInfo()
    else if (stage === Stage.Phone) await handlePhone()
    else if (stage === Stage.Verify) await handleVerify()
  }

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    if (phone.length > MAX_PHONE || isNaN(input as any)) return

    if (!phone) {
      setPhone('+' + input)
    } else setPhone(input)
  }

  function handlePhoneKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key.toLowerCase() === 'backspace') setPhone((e) => e.slice(0, -1))
  }

  return (
    <TwoColumnLayout
      image='/images/menu.avif'
      subTitle={['Thoughts', 'Stories', 'Thoughts, stories and ideas']}
      title='Sign Up'
      hideHeadings={stage !== Stage.Info}
    >
      {stage === Stage.LoggingIn ? (
        <h1>Logging in...</h1>
      ) : stage === Stage.Info ? (
        <>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Your name'
            className='focus:outline-none mt-10 mb-5 p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element focus:border-primary w-60% text-center'
            value={name}
            data-lpignore='true'
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='text'
            name='email'
            id='email'
            placeholder='Your email address'
            data-lpignore='true'
            className='focus:outline-none mb-10 p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element w-60% text-center focus:border-primary'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      ) : stage === Stage.Phone ? (
        <>
          <div
            className='flex items-center gap-2 mt-10 cursor-pointer'
            onClick={() => setStage(Stage.Info)}
          >
            <CaretLeft size={16} />
            <span>Go back</span>
          </div>
          <div className='flex items-center mt-5 mb-5'>
            <input
              type='text'
              name='phone'
              id='phone'
              placeholder='Your phone number'
              className='focus:outline-none p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element min-w-15rem text-center focus:border-primary'
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyPress}
            />
            {phone.length > MAX_PHONE ? (
              <div
                className='bg-element p-2 rounded-lg ml-2 flex items-center focus:brightness-75 cursor-pointer'
                onClick={() => setPhone('')}
              >
                <X size={24} weight='bold' />
              </div>
            ) : null}
          </div>
          <div className='flex items-center justify-center'>
            <input
              type='text'
              name='username'
              id='username'
              placeholder='Your username'
              className='focus:outline-none mb-10 p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element min-w-15rem text-center focus:border-primary'
              value={username}
              data-lpignore='true'
              onChange={(e) => setUsername(e.target.value)}
            />
            <div
              className='bg-element p-2 rounded-lg translate-y--4 ml-2 flex items-center focus:brightness-75 cursor-pointer'
              onClick={() =>
                setUsername(
                  generateUsername({ useHyphen: false, useRandomNumber: true })
                )
              }
            >
              <MagicWand size={24} weight='bold' />
            </div>
          </div>
        </>
      ) : stage === Stage.Verify ? (
        <VerificationCodeInput value={code} onChange={setCode} />
      ) : null}
      {stage === Stage.Info ? (
        <AuthTypeSelector
          type={type}
          onChange={setType}
          containerClass='gap-5 mb-10'
        />
      ) : null}
      {error ? (
        <p className='c-red-500 text-center mt--5 mb-10 text-lg font-medium'>
          {error}
        </p>
      ) : null}
      {stage !== Stage.LoggingIn ? (
        <button
          onClick={handleSubmitClick}
          className='mb-10 font-bold c-primary px-5 py-3 rounded-full text-md border-none'
        >
          {stage === Stage.Info
            ? 'Continue'
            : stage === Stage.Phone
            ? 'Send code'
            : stage === Stage.Verify
            ? 'Check code'
            : 'Continue'}
        </button>
      ) : null}
      {stage === Stage.Info ? (
        <p>
          Already have account yet?{' '}
          <Link className='c-primary decoration-none font-bold' to='/login'>
            Login
          </Link>
        </p>
      ) : null}
      {stage === Stage.Verify ? (
        <p className='flex-center gap-0'>
          <span>Didn't recieve code?</span>
          <button
            onClick={handleResend}
            className='c-primary font-bold bg-white border-none underline'
          >
            Resend
          </button>
        </p>
      ) : null}
      {loading ? (
        <div className='absolute top-10 left-50% translate-x--50%'>
          <Loader />
        </div>
      ) : null}
    </TwoColumnLayout>
  )
}
