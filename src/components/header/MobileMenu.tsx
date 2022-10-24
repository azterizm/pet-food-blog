import { X } from 'phosphor-react'
import type { ReactElement } from 'react'
import { useSpring, animated as a, config, useTrail } from 'react-spring'

export interface MobileMenuProps {
  open: boolean
  onChange: (arg: boolean) => void
}

export function MobileMenu({ open, onChange }: MobileMenuProps): ReactElement {
  const menu = useSpring({
    y: open ? 0 : 100,
    config: config.slow,
    o: open ? 1 : 0,
  })
  const menuItems = [
    'Recipes',
    'Categories',
    'Blog',
    'Authors',
    'Contact',
    'About',
  ]
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
      <div className='flex justify-end items-start gap-10 flex-col h-70%'>
        {items.map((styles, i) => (
          <a.a
            style={{
              opacity: styles.o,
              transform: styles.y.to((r) => `translateY(${r}px)`),
            }}
            className='text-3xl c-white decoration-none shadow-lg font-medium'
            href='#'
            key={i}
          >
            {menuItems[i]}
          </a.a>
        ))}
      </div>
      <div className='mt-10'>
        <button className='block mb-5 px-8 py-1 bg-element c-black border-2 border-white text-lg rounded-full font-bold'>
          Login
        </button>
        <button className='block mb-5 px-8 py-1 bg-element c-black border-2 border-white text-lg rounded-full font-bold'>
          Sign Up
        </button>
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
