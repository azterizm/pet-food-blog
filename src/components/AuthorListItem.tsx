import { IAuthor } from '@backend/models/author'
import { ISocialMedia } from '@backend/models/socialMedia'
import { capitalize } from 'lodash'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthorProfileImage } from './AuthorProfileImage'
import { RenderIconByName } from './icons/RenderIconByName'

export interface AuthorListItemProps {
  data: IAuthor & { socialMedia: ISocialMedia[] }
  subscribed?: Boolean
  subscribeDate?: Date | string
}

export function AuthorListItem(props: AuthorListItemProps): ReactElement {
  const navigate = useNavigate()
  return (
    <div
      className='flex flex-col w-80 cursor-pointer shadow-lg'
      onClick={() => navigate('/authors/' + String(props.data.id))}
    >
      <AuthorProfileImage author={props.data} />
      <div className='px-5 py-3 bg-neutral-300 rounded-b-lg'>
        <span className='text-2xl font-bold mt-5 block'>{props.data.name}</span>
        <div className='flex items-center gap-5 my-5'>
          {props.data.socialMedia.length
            ? props.data.socialMedia.map((s) => (
                <RenderIconByName
                  name={capitalize(s.name) + 'Logo'}
                  size={20}
                  key={s.id}
                />
              ))
            : null}
        </div>
        <span className='mb-10 block truncate'>{props.data.bio}</span>
        {props.subscribed ? (
          <span>
            Subscribed{' '}
            {props.subscribeDate
              ? 'at ' + new Date(props.subscribeDate).toLocaleDateString()
              : ''}{' '}
            for ${props.data.subscribeCost}/month
          </span>
        ) : null}
      </div>
    </div>
  )
}
