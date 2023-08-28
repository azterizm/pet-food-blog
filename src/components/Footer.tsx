import { Copyright } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CREATOR_ENDPOINT } from '../constants/api'
import { useAuth } from '../hooks/api'

export function Footer(): ReactElement {
  const [user] = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <footer className='flex bg-white p-4 items-center justify-between gap-6 c-neutral-600 flex-col lg:flex-row lg:fixed bottom-0 left-0 lg:w-screen mt-32 mb-4 lg:m-0 z-10'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() =>
              !user
                ? navigate('/login')
                : (window.location.href = CREATOR_ENDPOINT)}
            className='bg-button px-9 py-3 rounded-full border-none text-white font-medium'
            type='button'
          >
            Post your recipe
          </button>
          <span className='flex items-center gap-1 c-neutral-600'>
            <Copyright /> 2023 So Pawlicious, Inc.
          </span>
        </div>

        <div className='flex items-center gap-4 [&>a]:c-neutral-600'>
          <Link
            className='text-sm no-underline hover:underline decoration-none'
            to='/contact'
          >
            Contact
          </Link>
          <Link
            className='text-sm no-underline hover:underline decoration-none'
            to='/about'
          >
            About
          </Link>
          <Link
            className='text-sm no-underline hover:underline decoration-none'
            to='/terms'
          >
            Terms and Conditions
          </Link>
          <Link
            className='text-sm no-underline hover:underline decoration-none'
            to='/privacy_policy'
          >
            Privacy Policy
          </Link>
        </div>

        <button className='bg-transparent border-none hover:bg-neutral-300 cursor-pointer font-bold p-2 rounded-lg mr-8'>
          English
        </button>
      </footer>
      <div className='h-56 hidden lg:block pointer-events-none' />
    </>
  )
}
