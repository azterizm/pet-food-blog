import { generateUsername } from 'friendly-username-generator'
import { CaretLeft, MagicWand, X } from 'phosphor-react'
import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { Link } from 'react-router-dom'
import { AuthTypeSelector } from '../components/AuthTypeSelector'
import { Loader } from '../components/Loader'
import { TwoColumnLayout } from '../components/TwoColumnLayout'
import { emailRegex, usernameRegex } from '../constants/regex'
import { AuthType } from '../types/auth'

const MAX_PHONE = 13

export function Register(): ReactElement {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [stage, setStage] = useState(false)
  const [error, setError] = useState('')
  const [logging, setLogging] = useState(false)
  const [loading, setLoading] = useState(false)

  const [type, setType] = useState<AuthType>('user')

  useEffect(() => {
    setUsername(generateUsername({ useHyphen: false }))
  }, [])

  async function handleSubmit() {
    setError('')
    const okEmail = emailRegex.test(email)
    if (!okEmail)
      return setError(
        'Please enter correct email address. It does not seem valid.',
      )
    const okUsername = usernameRegex.test(username)
    if (!okUsername)
      return setError(
        'Username has invalid characters. Please choose another one.',
      )

    setLoading(true)
    const data = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/auth/register/${type}`,
      {
        body: JSON.stringify({
          name,
          email,
          phone,
          username,
          type,
          input: username,
          password: 'placeholder',
        }),
        headers: { 'content-type': 'application/json' },
        method: 'post',
        credentials: 'include',
      },
    ).then((r) => r.json())
    setLoading(false)
    if (data.error) return setError(data.info)
    setLogging(true)
    setTimeout(() => {
      window.location.href = '/'
    }, 1000)
  }

  function handleStart() {
    setError('')
    const okEmail = emailRegex.test(email)
    if (!okEmail)
      return setError(
        'Please enter correct email address. It does not seem valid.',
      )
    setStage(true)
  }

  function handleSubmitClick() {
    if (!stage) handleStart()
    else handleSubmit()
  }

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    if (phone.length > 13) return

    if (!phone) {
      setPhone('+' + input)
    } else setPhone(input)
  }

  return (
    <TwoColumnLayout
      image='/images/menu.jpg'
      subTitle={['Thoughts', 'Stories', 'Thoughts, stories and ideas']}
      title='Sign Up'
    >
      {logging ? (
        <h1>Logging in...</h1>
      ) : !stage ? (
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
      ) : (
        <>
          <div
            className='flex items-center gap-2 mt-10 cursor-pointer'
            onClick={() => setStage(false)}
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
            />
            {phone.length > 13 ? (
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
                setUsername(generateUsername({ useHyphen: false }))
              }
            >
              <MagicWand size={24} weight='bold' />
            </div>
          </div>
          <AuthTypeSelector
            type={type}
            onChange={setType}
            containerClass='gap-5 mb-10'
          />
        </>
      )}
      {error ? (
        <p className='c-red-500 text-center mt--5 mb-10 text-lg font-medium'>
          {error}
        </p>
      ) : null}
      {!logging ? (
        <button
          onClick={handleSubmitClick}
          className='mb-10 font-bold c-primary px-5 py-3 rounded-full text-md border-none'
        >
          {!stage ? 'Continue' : 'Send link'}
        </button>
      ) : null}
      {!stage && !logging ? (
        <p>
          Already have account yet?{' '}
          <Link className='c-primary decoration-none font-bold' to='/login'>
            Login
          </Link>
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
