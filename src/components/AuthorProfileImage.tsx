import { IAuthor } from '@backend/models/author'
import type { ReactElement } from 'react'
import { API_ENDPOINT } from '../constants/api'

export function AuthorProfileImage(props: { author: IAuthor }): ReactElement {
  return (
    <img
      className='object-cover w-80 object-cover rounded-t-lg'
      src={
        !props.author?.profile
          ? './images/avatar.webp'
          : API_ENDPOINT + '/auth/profile/' + props.author.id
      }
      alt='profile'
    />
  )
}
