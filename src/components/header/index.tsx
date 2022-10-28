import { List, MagnifyingGlass, User } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthUser } from '../../types/auth'
import { MobileMenu } from '../header/MobileMenu'

interface Props {
  user: AuthUser | null
}

export function Header({ user }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (menuOpen) document.body.style.overflowY = 'hidden'
    else document.body.style.overflowY = 'unset'
    return () => {
      document.body.style.overflowY = 'unset'
    }
  }, [menuOpen])
  return (
    <div className='flex justify-between items-center px-20 xl:px-50 py-5 mx--10'>
      <Link to='/'>
        <img className='w-50 invert' src='/logo.svg' alt='logo' />
      </Link>
      <div className='items-center gap-6 font-bold hidden lg:flex'>
        <Link className='no-underline c-black' to='/recipes'>
          Recipes
        </Link>
        <Link className='no-underline c-black' to='/categories'>
          Categories
        </Link>
        <Link className='no-underline c-black' to='/blog'>
          Blog
        </Link>
        <Link className='no-underline c-black' to='/authors'>
          Authors
        </Link>
        {user ? (
          <div
            className='cursor-pointer p-5'
            onClick={() => navigate('/profile')}
          >
            <User size={24} weight='bold' />
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('login')}
              className='bg-element border-none rounded-full c-black font-bold p-3 py-2 hover:brightness-75'
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('register')}
              className='bg-#2821fc c-white rounded-full c-black border-none font-bold p-3 py-2 hover:brightness-75'
            >
              Sign up
            </button>
          </>
        )}
        <Link className='no-underline c-black' to='/search'>
          <MagnifyingGlass weight='bold' size={24} />
        </Link>
      </div>
      <div className='visible lg:invisible' onClick={() => setMenuOpen(true)}>
        <List weight='bold' size={46} />
      </div>
      <MobileMenu user={user} open={menuOpen} onChange={setMenuOpen} />
    </div>
  )
}
