import { Link } from 'react-router-dom'
import { MagnifyingGlass } from 'phosphor-react'

export function Header() {
  return (
    <div className='flex justify-between items-center px-50 py-5 mx--10'>
      <Link to='/'>
        <img className='w-25 invert' src='/logo.svg' alt='logo' />
      </Link>
      <div className='flex items-center gap-6 font-bold'>
        <a className='no-underline c-black' href='/recipes'>
          Recipes
        </a>
        <a className='no-underline c-black' href='/posts'>
          Posts
        </a>
        <button className='bg-element border-none rounded-full c-black font-bold p-3 py-2'>Sign in</button>
        <button className='bg-#2821fc c-white rounded-full c-black border-none font-bold p-3 py-2'>Sign up</button>
        <a className='no-underline c-black' href='/search'>
          <MagnifyingGlass weight='bold' size={24} />
        </a>
      </div>
    </div>
  )
}
