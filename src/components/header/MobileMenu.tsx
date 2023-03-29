import { ReactElement, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CREATOR_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'

export function MobileMenu(): ReactElement {
  const navigate = useNavigate()
  const [user] = useAuth()

  const menuItems = useMemo(
    () => [
      ['/recipes', 'Recipes'],
      ['/blog', 'Topics'],
      ['/free', 'Free Stuff'],
      ['', ''],
      ['/saved', 'Saved'],
      user ? ['/profile', 'My Account'] : ['/login', 'Login'],
      user ? ['', ''] : null,
      user?.type === 'author' ? [CREATOR_ENDPOINT, 'Post your recipe'] : null,
    ],
    [user]
  )

  return (
    <Swiper
      className='translate-x-5 !pr-70 !lg:hidden'
      spaceBetween={10}
      slidesPerView={3}
      keyboard
    >
      {(menuItems as any[]).filter(Boolean).map(([endpoint, label], i) => (
        <SwiperSlide
          key={i}
          className={`py-2 rounded-full ${
            label ? 'bg-button text-white px-5' : 'bg-white text-gray-400'
          } border-0 no-underline flex items-center justify-center text-center`}
          onClick={() =>
            endpoint
              ? endpoint.includes('http')
                ? (window.location.href = endpoint)
                : navigate(endpoint)
              : null
          }
        >
          {label || '|'}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
