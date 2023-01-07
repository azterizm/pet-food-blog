import type { ReactElement } from 'react'
import { useAuth } from '../../hooks/api'

export function Deposit(): ReactElement {
  const [user] = useAuth()
  if (!user) return <span>Loading...</span>
  return (
    <div className='flex items-start flex-col gap-1 mt-5'>
      <span className='uppercase c-primary text-xl font-bold'>Deposit</span>
      <span>${user.deposit}</span>
      <button className='fill-btn'>Add deposit</button>
    </div>
  )
}
