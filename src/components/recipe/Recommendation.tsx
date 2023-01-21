import { IRecipe } from '@backend/models/recipe'
import moment from 'moment'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'

export interface RecommendationProps {
  title: string
  items: IRecipe[]
}

export function Recommendation(props: RecommendationProps): ReactElement {
  const navigate = useNavigate()
  function openNewRecipe(id?: number | string) {
    if (id) navigate('/recipes/read/' + id)
    setTimeout(() => {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    }, 100)
  }
  return (
    <div className='max-w-80'>
      <div className='flex items-center'>
        <div className='h-2px flex-1 bg-neutral-300 mr-2' />
        <span className='block text-center uppercase text-xs font-medium tracking-[0.25rem] bg-white'>
          {props.title}
        </span>
        <div className='h-2px flex-1 bg-neutral-300 ml-2' />
      </div>
      <div className='p-5 flex flex-col items-center gap-5 border-l-2px border-r-2px border-b-2px border-neutral-300 my--2'>
        {!props.items.length ? (
          <p className='text-xs uppercase text-center'>
            Nothing to recommend yet.
          </p>
        ) : (
          props.items.map((r, i) => (
            <div
              onClick={() => openNewRecipe(r.id)}
              key={i}
              className='grid grid-cols-2 gap-5 items-center cursor-pointer'
            >
              <img
                className='w-full h-full object-cover'
                src={API_ENDPOINT + r.mainImage}
                alt='Profile image'
              />
              <div className='flex items-start flex-col'>
                <span className='font-bold text-lg'>{r.title}</span>
                <span className='font-medium'>
                  {moment(r.createdAt).fromNow()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
