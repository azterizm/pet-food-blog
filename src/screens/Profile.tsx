import _ from 'lodash'
import { ReactElement } from 'react'

import { GoBack } from '../components/GoBack'
import { Deposit } from '../components/profile/Deposit'
import { EditProfile } from '../components/profile/EditProfile'

import { logoutUser } from '../features/auth'
import { useAuth } from '../hooks/api'
import { Purchases } from './Purchases'
import { Subscribed } from './Subscribed'

export interface ProfileProps {}

export function Profile({}: ProfileProps): ReactElement {
  const [user] = useAuth()

  if (!user) return <span>Loading...</span>
  return (
    <div className='min-h-100vh w-full'>
      <GoBack />
      <h1>Your account</h1>
      <EditProfile />
      <Deposit />
      <Purchases />
      <Subscribed />
      <div className='mt-5 block'>
        <button onClick={logoutUser} className='white-btn'>
          Logout
        </button>
      </div>
    </div>
  )
}
