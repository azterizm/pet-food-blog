import { Link } from 'react-router-dom'
import { List, MagnifyingGlass, X } from 'phosphor-react'
import { useEffect, useState } from 'react'

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
      <div className='flex items-center gap-6 font-bold invisible lg:visible'>
        <a className='no-underline c-black' href='/recipes'>
          Recipes
        </a>
        <a className='no-underline c-black' href='/posts'>
          Blog
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
      <div
        className='visible lg:invisible ml--50 md:ml--30'
        onClick={() => setMenuOpen(true)}
      >
        <List weight='bold' size={46} />
      </div>
      <div
        className={
          'z-2 lg:invisible fixed top-0 left-0 w-full p-10 h-full bg-primary c-white ' +
          (menuOpen ? 'visible' : 'invisible')
        }
      >
        <div className='flex justify-end items-start gap-10 flex-col h-70%'>
          {['Recipes', 'Blog', 'Contact', 'About'].map((r, i) => (
            <a className='text-3xl c-white decoration-none' href='#' key={i}>
              {r}
            </a>
          ))}
        </div>
        <div className='mt-10'>
          <button className='block mb-5 px-8 py-1 bg-primary c-white border-2 border-white text-lg rounded-full font-black'>
            Login
          </button>
          <button className='block mb-5 px-8 py-1 bg-primary c-white border-2 border-white text-lg rounded-full font-black'>
            Sign Up
          </button>
        </div>
        <div
          onClick={() => setMenuOpen(false)}
          className='absolute top-10 left-75% sm:left-80% md:left-82.5%'
        >
          <X size={46} className='c-white' />
        </div>
      </div>
    </div>
  )
}
