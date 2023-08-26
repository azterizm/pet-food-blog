import { ReactElement, useEffect } from 'react'
import { TwoColumnLayout } from '../components/TwoColumnLayout'
import { API_ENDPOINT } from '../constants/api'
import '../css/login.css'

export function Login(): ReactElement {
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
        <a
          className='g-sign-in-button'
          href={API_ENDPOINT + '/auth/google/' + 'author'}
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
        If you don't have an account then your account will be created
        automatically once you login.
      </p>
    </TwoColumnLayout>
  )
}
