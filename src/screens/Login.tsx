import { ReactElement, useEffect, useState } from 'react'
import { AuthTypeSelector } from '../components/AuthTypeSelector'
import { TwoColumnLayout } from '../components/TwoColumnLayout'
import { API_ENDPOINT } from '../constants/api'
import '../css/login.css'
import { AuthType } from '../types/auth'

export function Login(): ReactElement {
  const [type, setType] = useState<AuthType>('user')

  useEffect(() => {
    window.localStorage.removeItem('user')
  }, [])

  return (
    <TwoColumnLayout
      image='/images/auth3.jpg'
      subTitle={[
        'Sign in',
        'Login',
        'Sign into your account to get all good stuff!',
      ]}
      title='Welcome back!'
    >
      <div className='my-5'>
        <p className='mt-5'>How should we describe you as?</p>
        <AuthTypeSelector onChange={setType} type={type} />

        <a
          className='g-sign-in-button'
          href={API_ENDPOINT + '/auth/google/' + type}
        >
          <div className='content-wrapper'>
            <div className='logo-wrapper'>
              <img src='https://developers.google.com/identity/images/g-logo.png' />
            </div>
            <span className='text-container'>
              <span>Sign in with Google</span>
            </span>
          </div>
        </a>
      </div>
      <p className='m-0 p-0 text-neutral-600 text-center max-w-md'>
        If you don't have account then your account will automatically be
        created once you login.
      </p>
    </TwoColumnLayout>
  )
}
