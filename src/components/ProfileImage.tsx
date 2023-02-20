import type { HTMLAttributes, ReactElement } from 'react'
import { API_ENDPOINT } from '../constants/api'
import { useAuth } from '../hooks/api'

export interface Props {}

export function ProfileImage(
  props: HTMLAttributes<HTMLImageElement>
): ReactElement {
  const [user] = useAuth()
  return (
    <img
      src={
        !user || (user && !user.profile) ? './images/avatar.webp' : user.profile
      }
      alt=''
      {...props}
      className={'object-cover rounded-full shadow-lg  ' + props.className}
    />
  )
}
