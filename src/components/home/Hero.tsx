import { IAuthor } from '@backend/models/author'
import moment from 'moment'
import { Star, Timer } from 'phosphor-react'
import { Link } from 'react-router-dom'
import { Category, categoryLabel } from '../../types/api'
import { isFirefox } from '../../util/ui'

interface Props {
  image: string
  title: string
  authors: (IAuthor | { id: number | string; name: string })[]
  publishedOn: Date | string
  featured?: boolean
  categories?: Category[]
  average?: number
}

export function Hero(props: Props) {
  return (
    <div
      className={
        'flex items-center ml--10 xl:ml-10 gap-20 relative ' +
        (isFirefox ? 'mr--10' : '')
      }
    >
      <img
        className='brightness-65 lg:brightness-100 w-120% lg:w-50% h-70vh xl:rounded-lg lg:rounded-r-lg object-right aspect-video object-cover'
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
        <h1 className='max-w-80vw text-3xl md:text-5xl md:leading-15'>
          {props.title}
        </h1>
        <span>
          by{' '}
          <b>
            {props.authors.map((r) => (
              <Link
                className='decoration-none hover:underline cursor-pointer c-inherit'
                to={'/authors/' + r.id}
                key={r.id}
              >
                {r.name}
              </Link>
            ))}
          </b>{' '}
          {moment(props.publishedOn).fromNow()}
        </span>
        {props.average ? (
          <div className='flex items-center gap-2'>
            <Timer />
            <span className='uppercase font-medium'>
              {props.average} {props.average > 1 ? 'mins' : 'min'} read
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
