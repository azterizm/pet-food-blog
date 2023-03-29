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
        <div
          className={`transition transition-duration-500 fixed top-0 left-0 lg:invisible border-r-2 border-gray-400 w-[60vw] h-screen bg-white z-1 p-16 flex items-start flex-col gap-10 translate-x-[-${
            menuOpen ? 0 : 100
          }%]`}
        >
          <Link to='/'>
            <img className='w-50' src='/logo.svg' alt='logo' />
          </Link>

          {user ? (
            <Link
              className='bg-lightCyan text-white px-5 py-2 rounded-full border-none no-underline'
              to='/profile'
            >
              My Account
            </Link>
          ) : (
            <Link
              className='bg-lightCyan text-white px-5 py-2 rounded-full border-none no-underline'
              to='/login'
            >
              Login
            </Link>
          )}

          <button
            onClick={() => (window.location.href = CREATOR_ENDPOINT)}
            className='text-lg bg-lightCyan text-white px-5 py-2 rounded-full border-none no-underline'
          >
            Post your recipe
          </button>

          <div>
            <h1 className='text-button' style={{ fontFamily: 'GTSuperText' }}>
              Become a chef and <b>earn money</b>.
            </h1>

            <p className='font-medium'>
              Each time you create and share a recipe,{' '}
              <span className='text-button'>you are helping dogs</span> with
              better nutrition and a better life. Animal parents depend on
              people like you.
            </p>

            <p className='font-medium'>
              You can even{' '}
              <span className='text-button'>
                share your life experience and knowledge
              </span>{' '}
              about yourself and your lovely animal by creating topics. That is
              going to help all those in need.
            </p>
          </div>

          <X
            className='absolute top-5 right-5 bg-gray-400 p-2 rounded-full flex items-center'
            color='#fff'
            onClick={() => setMenuOpen(false)}
          />
        </div>
      </div>
    </>
  )
}
