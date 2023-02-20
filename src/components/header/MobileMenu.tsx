import { Dog, MagnifyingGlass, User, X } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSpring, animated as a, config, useTrail } from 'react-spring'
import { CREATOR_ENDPOINT } from '../../constants/api'
import { AuthUser } from '../../types/auth'

export interface MobileMenuProps {
  open: boolean
  onChange: (arg: boolean) => void
  user: AuthUser | null
}

const menuItems = [
  ['/recipes', 'Recipes'],
  ['/blog', 'Blog'],
  ['/free', 'Free Stuff'],
  ['/authors', 'Chefs'],
  ['/contact', 'Contact'],
  ['/about', 'About'],
]

export function MobileMenu({
  user,
  open,
  onChange,
}: MobileMenuProps): ReactElement {
  const navigate = useNavigate()
  const menu = useSpring({
    y: open ? 0 : 100,
    config: config.slow,
    o: open ? 1 : 0,
  })
  const items = useTrail(menuItems.length, {
    o: open ? 1 : 0,
    y: open ? 0 : 10,
    delay: 500,
  })
  return (
    <a.div
      className={
        'z-2 lg:invisible fixed top-0 left-0 w-full p-10 h-full c-white bg-cover ' +
        (open ? 'translate-y-0' : 'translate-y-100vh')
      }
      style={{
        transform: menu.y.to((r) => `translateY(${r}vh)`),
        backgroundImage: `url('/images/menu.jpg')`,
      }}
    >
      <div className='flex justify-start items-start gap-10 flex-col h-70%'>
        {items.map((styles, i) => (
          <a.div
            style={{
              opacity: styles.o,
              transform: styles.y.to((r) => `translateY(${r}px)`),
            }}
            key={i}
            onClick={() => onChange(false)}
          >
            <Link
              to={menuItems[i][0]}
              className='text-3xl c-white decoration-none shadow-lg font-medium'
            >
              {menuItems[i][1]}
            </Link>
          </a.div>
        ))}
      </div>
      <div className='mt-10 translate-y--10' onClick={() => onChange(false)}>
        {!user ? (
          <button
            onClick={() => navigate('/login')}
            className='block mb-5 px-8 py-1 bg-element c-black border-2 border-white text-lg rounded-full font-bold'
          >
            Login
          </button>
        ) : (
          <div className='flex items-start gap-5 flex-col ml--5'>
            <div
              className='w-max px-5 flex items-center gap-2'
              onClick={() => (window.location.href = CREATOR_ENDPOINT)}
            >
              <Dog size={48} />
              <span className='text-xl'>Create</span>
            </div>
            <div
              className='w-max px-5 flex items-center gap-2'
              onClick={() => navigate('/profile')}
            >
              <User size={48} />
              <span className='text-xl'>Profile</span>
            </div>
            <div
              className='w-max px-5 flex items-center gap-2'
              onClick={() => navigate('/search')}
            >
              <MagnifyingGlass size={48} />
              <span className='text-xl'>Search</span>
            </div>
          </div>
        )}
      </div>
      <div
        onClick={() => onChange(false)}
        className='absolute top-10 left-75% sm:left-80% md:left-82.5%'
      >
        <X size={46} className='c-white' />
      </div>
    </a.div>
  )
}
