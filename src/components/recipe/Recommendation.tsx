import { IRecipe } from '@backend/models/recipe'
import moment from 'moment'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
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
    <div className='my-8'>
      <span className='text-2xl font-bold capitalize'>{props.title}</span>
      {!props.items.length ? (
        <p className='text-xs uppercase text-center'>
          Nothing to recommend yet.
        </p>
      ) : (
        <Swiper spaceBetween={50} slidesPerView={3} className='mt-4'>
          {props.items.map((r, i) => (
            <SwiperSlide
              key={i}
              className='border-2 border-gray-200 rounded-xl'
            >
              <img
                className='object-cover rounded-t-xl'
                src={API_ENDPOINT + r.mainImage}
                alt='Profile image'
              />
              <div className='flex flex-col items-start px-2 py-4 bg-white rounded-b-xl'>
                <span className='font-bold text-lg'>{r.title}</span>
                <span className='font-medium'>
                  {moment(r.createdAt).fromNow()}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}
