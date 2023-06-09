import type { ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CREATOR_ENDPOINT } from '../constants/api'
import { useAuth } from '../hooks/api'

export function Footer(): ReactElement {
  const [user] = useAuth()
  const navigate = useNavigate()

  return (
    <footer className='flex items-center justify-center flex-col mb-16 mt-48'>
      <button
        onClick={() =>
          !user ? navigate('/login') : (window.location.href = CREATOR_ENDPOINT)
        }
        className='bg-[#98d4cb] px-5 py-2 rounded-full border-none text-white font-bold'
        type='button'
      >
        Post your recipe
      </button>

      <Link to='/' className='my-8'>
        <img className='w-50' src='/logo.svg' alt='logo' />
      </Link>

      <div className='flex items-center gap-4'>
        <Link className='no-underline text-sm c-black' to='/recipes'>
          Recipes
        </Link>
        <Link className='no-underline text-sm c-black' to='/blog'>
          Topics
        </Link>
        <Link className='no-underline text-sm c-black' to='/free'>
          Free Stuff
        </Link>
        <Link className='no-underline text-sm c-black' to='/saved'>
          Saved
        </Link>
      </div>

      {/*
CONTACT INFORMATION
      <div className='flex items-center gap-4 mt-2'>
        <Link
          className='text-black text-sm no-underline decoration-none'
          to='/contact'
        >
          Contact
        </Link>
        <Link
          className='text-black text-sm no-underline decoration-none'
          to='/about'
        >
          About
        </Link>
        <Link
          className='text-black text-sm no-underline decoration-none'
          to='/terms'
        >
          Terms and Conditions
        </Link>
        <Link
          className='text-black text-sm no-underline decoration-none'
          to='/pp'
        >
          Privacy Policy
        </Link>
      </div>
*/}
    </footer>
  )
}
