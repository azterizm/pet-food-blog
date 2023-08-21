import classNames from 'classnames'
import { ReactElement, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CREATOR_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'
import { makeMouseScrollable } from '../../hooks/ui'

export function MobileMenu(): ReactElement {
  const navigate = useNavigate()
  const location = useLocation()
  const [user] = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  makeMouseScrollable(containerRef)

  const menuItems = useMemo(
    () => [
      ['/', 'Recipes'],
      ['/blog', 'Topics'],
      ['/free', 'Free Stuff'],
      ['', ''],
      ['/saved', 'Saved'],
      user ? ['/profile', 'My Account'] : ['/login', 'Login'],
      user ? ['', ''] : null,
      user?.type === 'author' ? [CREATOR_ENDPOINT, 'Post your recipe'] : null,
    ],
    [user],
  )

  return (
    <div
      ref={containerRef}
      className='flex justify-start items-center ml-5 overflow-x-auto overflow-y-hidden !lg:hidden hide-scrollbar'
    >
      {(menuItems as any[]).filter(Boolean).map(([endpoint, label], i) => (
        <span
          key={i}
          className={classNames(
            'block py-2 mr-5 rounded-full whitespace-nowrap mb-2',
            label ? 'text-white px-10' : 'bg-white text-gray-200',
            location.pathname === endpoint
              ? 'bg-secondary pointer-events-none opacity-50'
              : 'bg-button',
          )}
          draggable='false'
          onClick={() =>
            endpoint
              ? endpoint.includes('http')
                ? (window.location.href = endpoint)
                : navigate(endpoint)
              : null}
        >
          {label || '|'}
        </span>
      ))}
    </div>
  )
}
