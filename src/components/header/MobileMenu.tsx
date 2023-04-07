import { ReactElement, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CREATOR_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'

export function MobileMenu(): ReactElement {
  const navigate = useNavigate()
  const [user] = useAuth()

  const menuItems = useMemo(
    () => [
      ['/recipes', 'Recipes'],
      ['/blog', 'Topics'],
      ['/free', 'Free Stuff'],
      ['', ''],
      ['/saved', 'Saved'],
      user ? ['/profile', 'My Account'] : ['/login', 'Login'],
      user ? ['', ''] : null,
      user?.type === 'author' ? [CREATOR_ENDPOINT, 'Post your recipe'] : null,
    ],
    [user]
  )

  return (
    <div className='flex justify-start items-center ml-5 overflow-x-scroll overflow-y-hidden !lg:hidden'>
      {(menuItems as any[]).filter(Boolean).map(([endpoint, label]) => (
        <span
          className={`block px-10 py-2 mr-5 ${
            label ? 'bg-button text-white' : 'bg-white text-gray-200'
          } rounded-full`}
          onClick={() =>
            endpoint
              ? endpoint.includes('http')
                ? (window.location.href = endpoint)
                : navigate(endpoint)
              : null
          }
        >
          {label || '|'}
        </span>
      ))}
    </div>
  )
}
