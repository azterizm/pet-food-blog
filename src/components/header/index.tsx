import { CaretUp, List, MagnifyingGlass, User, X } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { animated, useSpringValue } from '@react-spring/web'
import { CREATOR_ENDPOINT } from '../../constants/api'
import { AuthUser } from '../../types/auth'
import { MobileMenu } from '../header/MobileMenu'

interface Props {
  user: AuthUser | null
}

export function Header({ user }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [removeHint, setRemoveHint] = useState(false)
  const hintOpacity = useSpringValue(0, {
    onRest: (res) => {
      if (res.value === 0) setRemoveHint(true)
      else setRemoveHint(false)
    },
  })

  useEffect(() => {
    if (menuOpen) document.body.style.overflowY = 'hidden'
    else document.body.style.overflowY = 'unset'
    return () => {
      document.body.style.overflowY = 'unset'
    }
  }, [menuOpen])

  useEffect(() => {
    const hintShown = window.localStorage.getItem('hintShown')
    if (!hintShown && !user) hintOpacity.start(1)
    else setRemoveHint(true), hintOpacity.start(0)
  }, [user])

  function closeHint() {
    hintOpacity.start(0)
    window.localStorage.setItem('hintShown', 'true')
  }

  return (
    <>
      <div className='flex justify-between items-center lg:px-20 xl:px-50 py-5 mx--10'>
        <Link className='hidden lg:block' to='/'>
          <img className='w-50' src='/logo.svg' alt='logo' />
        </Link>
        <div className='items-center gap-6 font-bold hidden lg:flex'>
          <Link className='no-underline c-black' to='/recipes'>
            Recipes
          </Link>
          <Link className='no-underline c-black' to='/blog'>
            Topics
          </Link>

          <div className='w-0.5 h-5 bg-black'></div>
          <Link className='no-underline c-black' to='/free'>
            Free Stuff
          </Link>
          <Link className='no-underline c-black' to='/saved'>
            Saved
          </Link>
        </div>
        <div className='items-center gap-6 hidden lg:flex font-bold'>
          {!user || user.type === 'author' ? (
            <div className={'relative ' + (user ? 'translate-y--1' : '')}>
              <button
                onClick={() =>
                  !user
                    ? navigate('/login')
                    : (window.location.href = CREATOR_ENDPOINT)
                }
                className='bg-#2821fc c-white rounded-full c-black border-none font-bold px-7 py-2 hover:brightness-75 '
              >
                Create
              </button>
              <animated.div
                onClick={closeHint}
                className='absolute right-0 bottom--45 bg-secondary c-white p-5 rounded-lg w-50 font-medium z-1'
                style={{
                  opacity: hintOpacity,
                  display: removeHint || user ? 'none' : 'block',
                }}
              >
                <span>
                  Click to create recipes or articles and access your admin
                  panel.
                </span>
                <div className='flex items-center justify-start gap-2 mt-4 bg-blue-700 w-max px-2 py-1 rounded-lg cursor-pointer'>
                  <X weight='bold' />
                  <span>Close</span>
                </div>
                <div className='absolute top--7.5 right-5 c-secondary'>
                  <CaretUp size={56} weight='fill' />
                </div>
              </animated.div>
            </div>
          ) : null}
          {user ? (
            <div
              className='cursor-pointer p-5 pl-0'
              onClick={() => navigate('/profile')}
            >
              <User size={24} weight='bold' />
            </div>
          ) : (
            <button
              onClick={() => navigate('login')}
              className='bg-element border-none rounded-full c-black font-bold p-3 py-2 hover:brightness-75'
            >
              Login
            </button>
          )}
          <Link className='no-underline c-black' to='/search'>
            <MagnifyingGlass weight='bold' size={24} />
          </Link>
        </div>
        <div
          className='translate-y-1 lg:hidden ml-5 bg-gray-100 rounded-full p-2 py-5 flex items-start justify-center flex-col'
          onClick={() => setMenuOpen(true)}
        >
          <div className='w-10 h-0.8 bg-button mb-2 rounded-full' />
          <div className='w-5 h-0.8 bg-button rounded-full' />
        </div>
        <MobileMenu />
        {/* SIDE MENU */}
      </div>
    </>
  )
}
