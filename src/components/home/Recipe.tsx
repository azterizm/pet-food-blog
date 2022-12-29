import { IAuthor } from '@backend/models/author'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { PriceType } from '../../types/ui'
import { showDuration, showPluralS } from '../../util/ui'
interface Props {
  title: string
  authors?: Pick<IAuthor, 'id' | 'name'>[]
  postedOn: Date
  reviews?: number
  image: string
  duration: number
  large?: boolean
  priceType?: PriceType
  onClick?: () => void
}
export function Recipe({
  priceType,
  duration,
  large = false,
  image,
  title,
  reviews = 0,
  postedOn,
  authors,
  onClick,
}: Props) {
  const navigate = useNavigate()
  return (
    <div
      className={
        'h-70 p-10 rounded-7 w-full c-white flex justify-between items-start flex-col relative shadow-lg hover:translate-y--2 transition hover:shadow-xl cursor-pointer ' +
        (large ? 'xl:w-170' : 'xl:w-70')
      }
      onClick={onClick}
    >
      <div className='z-1'>
        <h1>{title}</h1>
        <span>
          {authors && authors.length ? 'by' : ''}{' '}
          {!authors || !authors.length
            ? null
            : authors.map((r, i) => (
                <b
                  className='hover:underline cursor-pointer'
                  onClick={() => navigate('/authors/' + r.id)}
                  key={r.id}
                >
                  {r.name}
                  {i + 1 === authors.length ? '' : ', '}
                </b>
              ))}{' '}
          {moment(postedOn).fromNow()}
        </span>
        {priceType && priceType !== 'free' ? (
          <span className='block w-max mt-2 font-bold m-0 p-0 uppercase border-1 border-white w-max-content text-sm px-3 py-1 rounded-full'>
            {priceType.toUpperCase()} members only
          </span>
        ) : null}
      </div>
      <div className='flex justify-between items-center w-full z-1'>
        <span className='uppercase text-sm font-medium'>
          {showDuration(duration)}
        </span>
        {!reviews ? (
          <span>No likes</span>
        ) : (
          <span>
            {reviews} like{showPluralS(reviews)}
          </span>
        )}
      </div>
      <img
        className='w-full h-full absolute top-0 left-0 rounded-7 brightness-50 object-cover'
        src={image}
        alt={title + ' image'}
      />
    </div>
  )
}
