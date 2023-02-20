import { IAuthor } from '@backend/models/author'
import type { DetailedHTMLProps, ReactElement } from 'react'
import { API_ENDPOINT } from '../constants/api'

interface Props
  extends DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  author: IAuthor
}

export function AuthorProfileImage(props: Props): ReactElement {
  return (
    <img
      className='object-cover w-80 object-cover rounded-t-lg'
      src={
        !props.author?.profile ? './images/avatar.webp' : props.author.profile
      }
      alt='profile'
      {...props}
    />
  )
}
