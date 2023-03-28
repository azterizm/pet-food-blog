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
    <div className='mt-16'>
      <span className='text-2xl font-bold capitalize'>{props.title}</span>
      <div className='mt-4 flex flex-row overflow-auto items-center gap-5 my--2'>
        {!props.items.length ? (
          <p className='text-xs uppercase text-center'>
            Nothing to recommend yet.
          </p>
        ) : (
          props.items.map((r, i) => (
            <div
              onClick={() => openNewRecipe(r.id)}
              key={i}
              className='cursor-pointer w-40'
            >
              <img
                className='w-full h-60 object-cover rounded-t-lg'
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
