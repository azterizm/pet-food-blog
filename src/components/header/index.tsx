import { List, MagnifyingGlass } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MobileMenu } from '../header/MobileMenu'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
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
        <a className='no-underline c-black' href='/recipes'>
          Recipes
        </a>
        <a className='no-underline c-black' href='/recipes'>
          Categories
        </a>
        <a className='no-underline c-black' href='/posts'>
          Blog
        </a>
        <a className='no-underline c-black' href='/posts'>
          Authors
        </a>
        <button className='bg-element border-none rounded-full c-black font-bold p-3 py-2'>
          Sign in
        </button>
        <button className='bg-#2821fc c-white rounded-full c-black border-none font-bold p-3 py-2'>
          Sign up
        </button>
        <a className='no-underline c-black' href='/search'>
          <MagnifyingGlass weight='bold' size={24} />
        </a>
      </div>
      <div className='visible lg:invisible' onClick={() => setMenuOpen(true)}>
        <List weight='bold' size={46} />
      </div>
      <MobileMenu open={menuOpen} onChange={setMenuOpen}/>
    </div>
  )
}
