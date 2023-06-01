import { IAuthor } from '@backend/models/author'
import { IVetInfo } from '@backend/models/vetInfo'
import moment from 'moment'
import { PawPrint, Star, Timer } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
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
  vetApprover?: IVetInfo
}

export function Hero(props: Props) {
  const navigate = useNavigate()
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
                  className='uppercase font-bold text-sm mr-2 bg-white c-primary px-3 py-1 rounded-full tracking-widest lg:border-2 cursor-pointer'
                  key={r + '_' + i}
                  onClick={() =>
                    navigate('/recipes', { state: { category: r } })
                  }
                >
                  {categoryLabel[r]}
                </span>
              ))
            : null}
        </div>
        <h1 className='max-w-80vw text-3xl mb-0 md:text-5xl md:leading-15'>
          {decodeURIComponent(props.title)}
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
          <div>
            <AuthorProfileImage
              className='w-50 h-80 object-cover rounded-lg mt-10 block cursor-pointer'
              author={props.author as IAuthor}
              onClick={() => navigate('/authors/' + props.author?.id)}
            />
            <p
              onClick={() => navigate('/authors/' + props.author?.id)}
              className=' cursor-pointer mb-0 font-bold text-lg'
            >
              {props.author.name}
            </p>
            <p className='m-0'>{props.author.bio}</p>
            <button
              onClick={() => navigate('/authors/' + props.author?.id)}
              className='bg-secondary px-5 py-3 border-0 rounded-full mt-5 c-white font-bold'
            >
              Follow
            </button>
            {props.vetApprover ? (
              <div
                className='cursor-pointer'
                onClick={() => window.open(props.vetApprover?.web, '_blank')}
              >
                <div className='uppercase c-green flex items-center mt-5 gap-2'>
                  <PawPrint className='text-5xl' />
                  <span className='text-3xl font-bold'>vet approved</span>
                </div>
                <p
                  onClick={() => window.open(props.vetApprover?.web, '_blank')}
                >
                  This recipe is approved by {props.vetApprover.name}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
