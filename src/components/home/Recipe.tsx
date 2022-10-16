import moment from 'moment'
import { Star } from 'phosphor-react'
interface Props {
  title: string
  authors: string[]
  postedOn: Date
  reviews: number
  image: string
  duration: string
  large?: boolean
}
export function Recipe({ duration, large = false, image, title, reviews, postedOn, authors }: Props) {
  return (
    <div
      className={
        'h-70 p-10 rounded-7 c-white flex justify-between items-start flex-col relative ' + (large ? 'w-170' : 'w-70')
      }
    >
      <div className='z-1'>
        <h1>{title}</h1>
        <span>
          by <b>{authors.join(', ')}</b> {moment(postedOn).fromNow()}
        </span>
      </div>
      <div className='flex justify-between items-center w-full z-1'>
        <span>{duration}</span>
        <div className='flex items-center gap-2'>
          <span>{reviews.toFixed(1)}</span>
          <div>
            {new Array(Math.floor(reviews)).fill(null).map((_, i) => (
              <Star key={i} weight='fill' />
            ))}
            {new Array(5 - Math.floor(reviews)).fill(null).map((_, i) => (
              <Star key={i} weight='bold' />
            ))}
          </div>
        </div>
      </div>
      <img
        className='w-full h-full absolute top-0 left-0 rounded-7 brightness-50 object-cover'
        src={image}
        alt={title + ' image'}
      />
    </div>
  )
}
