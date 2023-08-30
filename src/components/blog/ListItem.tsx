import classNames from 'classnames'
import { HandsClapping } from 'phosphor-react'
import { ReactNode } from 'react'
import { handleLike } from '../../features/like'

interface Props {
  image: string
  title: string
  onClick?: () => void
  authorName: string
  children?: ReactNode
  onLike?: () => void
  liked?: boolean
  likes?: number
}

export default function AuthorListItem(props: Props) {
  return (
    <div>
      <img
        className={classNames(
          'cursor-pointer object-cover rounded-lg w-full',
        )}
        loading='lazy'
        src={props.image}
        alt={props.title + ' ' + 'image'}
        onClick={props.onClick}
      />

      <div className='relative text-center'>
        <span className='text-2xl font-bold'>{props.title}</span>
        <span className='block text-lg font-bold c-button'>
          with {props.authorName}
        </span>

        <div
          onClick={props.onLike}
          className='flex items-center justify-center -mt-2 group cursor-pointer'
        >
          <img
            src={props.liked ? '/icons/clap-active.png' : '/icons/clap.png'}
            alt='Clapping hands icon'
            width='45'
            height='45'
            style={{ transform: 'translateY(-2px)' }}
            className='group-active:scale-150 group-focus:scale-150 transition-transform'
            draggable={false}
          />
          <span className='inline-block !-ml-1'>
            {Intl.NumberFormat('en-US').format(
              props.likes || 0,
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
