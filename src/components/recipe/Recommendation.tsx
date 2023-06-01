import { IRecipe } from '@backend/models/recipe'
import { Heart } from 'phosphor-react'
import type { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { API_ENDPOINT } from '../../constants/api'

export interface RecommendationProps {
  title: string
  items: (IRecipe | (IRecipe & { likes: number }))[]
  contentType: 'recipe' | 'blog'
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
    <div className='my-16'>
      <span className='text-2xl font-bold capitalize'>
        {decodeURIComponent(props.title)}
      </span>
      {!props.items.length ? (
        <p className='text-xs uppercase text-center'>
          Nothing to recommend yet.
        </p>
      ) : (
        <Swiper
          spaceBetween={15}
          slidesPerView={2}
          keyboard
          className='mt-4 !pr-4'
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 30 },
            1200: { slidesPerView: 4, spaceBetween: 40 },
          }}
        >
          {props.items
            .filter((r) => r.id !== id)
            .map((r, i) => (
              <SwiperSlide
                key={i}
                className='rounded-xl cursor-pointer'
                onClick={() => openNewRecipe(r.id)}
              >
                <span className='flex items-center justify-center text-center block w-16 h-16 font-medium rounded-full bg-white border-0.5 border-gray-200 text-button translate-y-8 mx-auto'>
                  {props.contentType}
                </span>
                <img
                  className='object-cover rounded-t-xl border-x-2 border-gray-200 border-t-2'
                  src={API_ENDPOINT + r.mainImage}
                  alt='Profile image'
                />
                <div
                  style={{ width: 'calc(100% - 1rem)' }}
                  className='border-x-2 border-gray-200 border-b-2 flex flex-col items-start px-2 py-4 bg-white rounded-b-xl translate-y--1'
                >
                  <span className='truncate w-full font-bold text-lg'>
                    {decodeURIComponent(r.title)}
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
