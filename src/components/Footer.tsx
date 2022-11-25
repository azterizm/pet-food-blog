import { Copyright, TiktokLogo, TwitterLogo, YoutubeLogo } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

export function Footer(): ReactElement {
  return (
    <footer className='mt-10 py-5 border-t-2 border-gray-200'>
      <div className='flex justify-between items-center'>
        <Link to='/'>
          <img className='w-50 invert' src='/logo.svg' alt='logo' />
        </Link>
        <div className='flex items-center gap-5 flex-col md:flex-row ml-5'>
          <Link className='font-bold c-primary decoration-none' to='/contact'>
            Contact
          </Link>
          <Link className='font-bold c-primary decoration-none' to='/about'>
            About
          </Link>
          <Link className='font-bold c-primary decoration-none' to='/terms'>
            Terms and Conditions
          </Link>
          <Link className='font-bold c-primary decoration-none' to='/pp'>
            Privacy Policy
          </Link>
        </div>
        <div className='flex items-center gap-5'>
          <TwitterLogo size={24} />
          <YoutubeLogo size={24} />
          <TiktokLogo size={24} />
        </div>
      </div>
      <p className='gap-2 font-light text-center text-sm flex justify-center items-center font-bold c-neutral-400 mt-10 md:mt-5'>
        <Copyright />
        <span>2022 We Cook for Dogs. All rights reserved.</span>
      </p>
    </footer>
  )
}
