import { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { TwoColumnLayout } from '../components/TwoColumnLayout'

export function Login(): ReactElement {
  const [input, setInput] = useState('')
  async function handleSubmit() {}
  return (
    <TwoColumnLayout
      image='/images/auth.jpg'
      subTitle={[
        'Sign in',
        'Login',
        'Sign into your account to get all good stuff!',
      ]}
      title='Welcome back!'
    >
      <input
        type='text'
        name='input'
        id='input'
        placeholder='Username or email address'
        className='focus:border-primary focus:outline-none mt-10 mb-5 p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element w-60% text-center'
        value={input}
        data-lpignore='true'
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className='mb-10 font-bold c-primary px-5 py-3 rounded-full text-md border-none'
      >
        Send login link
      </button>
      <p>
        Don't have account yet?{' '}
        <Link className='c-primary decoration-none font-bold' to='/register'>
          Sign Up
        </Link>
      </p>
    </TwoColumnLayout>
  )
}
