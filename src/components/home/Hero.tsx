import { IAuthor } from '@backend/models/author'
import moment from 'moment'
import { Star, Timer } from 'phosphor-react'
import { Category, categoryLabel } from '../../types/api'
import { isFirefox } from '../../util/ui'
import { AuthorProfileImage } from '../AuthorProfileImage'

interface Props {
  image: string
  title: string
  author?: IAuthor
  publishedOn: Date | string
  featured?: boolean
  categories?: Category[]
  average?: number
}

export function Hero(props: Props) {
  return (
    <div
      className={
        'flex items-center ml--10 mr--10 xl:ml-10 xl:mr--10 gap-20 relative ' +
        (isFirefox ? 'mr--10' : '')
      }
    >
      <img
        className='brightness-65 lg:brightness-100 w-120% lg:w-50% h-90vh xl:rounded-lg lg:rounded-r-lg object-right aspect-video object-cover'
        src={props.image}
        alt={props.title + ' ' + props.image}
      />
      <div className='c-primary w-full md:w-120 ml-10 top-50% left-50% translate-x--50% translate-y--50% lg:translate-y-0 lg:translate-x-0 absolute lg:static c-white lg:c-primary lg:invert-0'>
        {props.featured ? (
          <div className='flex items-center bg-primary px-3 py-2 rounded-full w-max gap-2'>
            <Star weight='fill' className='c-white' />
            <span className='uppercase font-bold text-sm c-white'>
              Featured
            </span>
          </div>
        ) : null}
        <div className='flex flex-wrap items-center gap-y-2'>
          {props.categories && props.categories.length
            ? props.categories.map((r, i) => (
                <span
                  className='uppercase font-bold text-sm mr-2 bg-white c-primary px-3 py-1 rounded-full tracking-widest lg:border-2'
                  key={r + '_' + i}
                >
                  {categoryLabel[r]}
                </span>
              ))
            : null}
        </div>
        <h1 className='max-w-80vw text-3xl mb-0 md:text-5xl md:leading-15'>
          {props.title}
        </h1>
        <span>{moment(props.publishedOn).fromNow()}</span>
        {props.average ? (
          <div className='flex items-center gap-2'>
            <Timer />
            <span className='uppercase font-medium'>
              {props.average} {props.average > 1 ? 'mins' : 'min'} read
            </span>
          </div>
        ) : null}
        {props.author ? (
          <>
            <AuthorProfileImage
              className='w-50 h-80 object-cover rounded-lg mt-10 block'
              author={props.author as IAuthor}
            />
            <p className='mb-0 font-bold text-lg'>{props.author.name}</p>
            <p className='m-0'>{props.author.bio}</p>
            <button className='bg-secondary px-5 py-3 border-0 rounded-full mt-5 c-white font-bold'>
              Follow
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
