import { IRecipe } from '@backend/models/recipe'
import moment from 'moment'
import { Heart } from 'phosphor-react'
import type { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { API_ENDPOINT } from '../../constants/api'

export interface RecommendationProps {
  title: string
  items: (IRecipe | (IRecipe & { likes: number }))[]
}

export function Recommendation(props: RecommendationProps): ReactElement {
  const navigate = useNavigate()
  const { id } = useParams()
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
        <Swiper
          spaceBetween={40}
          slidesPerView={2}
          keyboard
          className='mt-4 !pr-4'
          breakpoints={{
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {props.items
            .filter((r) => r.id !== id)
            .map((r, i) => (
              <SwiperSlide
                key={i}
                className='border-2 border-gray-200 rounded-xl'
                onClick={() => openNewRecipe(r.id)}
              >
                <img
                  className='object-cover rounded-t-xl'
                  src={API_ENDPOINT + r.mainImage}
                  alt='Profile image'
                />
                <div className='flex flex-col items-start px-2 py-4 bg-white rounded-b-xl'>
                  <span className='font-bold text-lg'>{r.title}</span>
                  <span className='font-medium text-gray-400'>
                    {moment(r.createdAt).fromNow()}
                  </span>
                  {'likes' in r ? (
                    <div className='mt-2 flex items-center gap-2 text-[#FEA2AD]'>
                      <Heart size={24} weight='fill' color='#FEA2AD' />
                      <span>{r.likes}</span>
                    </div>
                  ) : null}
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  )
}
