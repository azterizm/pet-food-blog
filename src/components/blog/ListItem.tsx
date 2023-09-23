import classNames from 'classnames'
import { ReactNode, useEffect, useState } from 'react'

interface Props {
  image: string
  title: string
  onClick?: () => void
  authorName: string
  children?: ReactNode
  onLike?: () => void
  liked?: boolean
  likes?: number
  imgClassName?: string
}

export default function AuthorListItem({ liked: likedProp, ...props }: Props) {
  const [liked, setLiked] = useState(likedProp || false)
  useEffect(() => {
    setLiked(Boolean(likedProp))
  }, [likedProp])
  return (
    <div>
      <img
        className={classNames(
          'cursor-pointer object-cover rounded-2xl w-full',
          props.imgClassName,
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
          onClick={() => (props.onLike && props.onLike(), setLiked((e) => !e))}
          className='flex items-center justify-center -mt-2 group cursor-pointer'
        >
          <img
            src={liked ? '/icons/clap-active.png' : '/icons/clap.png'}
            alt='Clapping hands icon'
            width='45'
            height='45'
            style={{ transform: 'translateY(-2px)' }}
            className='group-active:scale-150 group-focus:scale-150 transition-transform'
            draggable={false}
          />
          <span className='inline-block !-ml-1'>
            {Intl.NumberFormat('en-US').format(
              (
                props.likes || 0
              ) + (
                liked ? 1 : 0
              ),
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
