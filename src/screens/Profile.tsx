import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { GoBack } from '../components/GoBack'
import { logoutUser } from '../features/auth'
import { useAuth } from '../hooks/api'

export interface ProfileProps {}

export function Profile({}: ProfileProps): ReactElement {
  const [user] = useAuth()
  if (!user) return <span>Loading...</span>
  return (
    <div className='min-h-100vh w-full'>
      <GoBack />
      <h1>Your account</h1>
      <div className='flex items-start flex-col gap-1'>
        <span className='uppercase c-primary text-sm font-bold'>
          Email address
        </span>
        <span>{user.email}</span>
      </div>
      <div className='flex items-start flex-col gap-1 mt-5'>
        <span className='uppercase c-primary text-sm font-bold'>Deposit</span>
        <span>${user.deposit}</span>
      </div>
      <div className='mt-5 block'>
        <Link
          to='/deposit'
          className='bg-primary block mb-5 c-white font-bold w-max font-medium no-underline px-5 py-3 border-none rounded-lg cursor-pointer hover:brightness-75'
        >
          Add deposit
        </Link>
        <Link
          to='/purchases'
          className='bg-primary block mb-5 c-white font-bold w-max font-medium no-underline px-5 py-3 border-none rounded-lg cursor-pointer hover:brightness-75'
        >
          See recent purchases
        </Link>
        <Link
          to='/subcribed'
          className='bg-primary block mb-5 c-white font-bold w-max font-medium no-underline px-5 py-3 border-none rounded-lg cursor-pointer hover:brightness-75'
        >
          Subscribed authors
        </Link>
      </div>
      <div className='mt-5 block'>
        <button
          onClick={logoutUser}
          className='bg-transparent hover:underline cursor-pointer c-primary text-lg border-none'
        >
          Logout
        </button>
      </div>
    </div>
  )
}
