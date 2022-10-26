import { CaretLeft } from 'phosphor-react'
import type { ReactElement } from 'react'
import { GoBack } from '../components/GoBack'
import { AuthUser } from '../types/auth'

export interface ProfileProps {
  user: AuthUser
}

export function Profile({ user }: ProfileProps): ReactElement {
  return (
    <div className='min-h-100vh w-full'>
      <GoBack/>
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
        <button className='bg-primary block mb-5 c-white font-bold px-5 py-3 border-none rounded-lg cursor-pointer hover:brightness-75'>
          See recent purchases
        </button>
        <button className='bg-primary block c-white font-bold px-5 py-3 border-none rounded-lg cursor-pointer hover:brightness-75'>
          Subscribed authors
        </button>
      </div>
    </div>
  )
}
