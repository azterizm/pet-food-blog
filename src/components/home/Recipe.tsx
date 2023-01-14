import { IAuthor } from '@backend/models/author'
import { RecipeCategory } from '@backend/models/recipe'
import moment from 'moment'
import { Check, Heart } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'
import { categoryLabel } from '../../types/api'
import { PriceType } from '../../types/ui'
import { showDuration, showPluralS } from '../../util/ui'
import { categoryRenders } from '../icons/RecipeCategory'

interface Props {
  title: string
  author?: Pick<IAuthor, 'id' | 'name' | 'subscribeCost' | 'profile'>
  postedOn: Date
  reviews?: number
  image: string
  duration: number
  authorTotalRecipes?: number
  priceType?: PriceType
  price?: number
  categories: RecipeCategory[]
  onClick?: () => void
  id: number
}

export function Recipe({
  priceType,
  id,
  price,
  duration,
  image,
  title,
  reviews = 0,
  postedOn,
  author,
  onClick,
  categories,
  authorTotalRecipes,
}: Props) {
  const navigate = useNavigate()
  const [user, changeUser] = useAuth()

  async function onSave() {
    if (!user || !id) return navigate('/login')
    if (user.saved.includes(id))
      changeUser({ ...user, saved: user.saved.filter((r) => r !== id) })
    else changeUser({ ...user, saved: user.saved.concat(id) })

    const data = await fetch(API_ENDPOINT + '/recipe/save/' + id, {
      credentials: 'include',
      method: 'post',
    })
      .then((r) => r.json())
      .catch(() => ({ error: true }))

    if (data.error) {
      alert(data.info)
      if (user.saved.includes(id))
        changeUser({ ...user, saved: user.saved.concat(id) })
      else changeUser({ ...user, saved: user.saved.filter((r) => r !== id) })
      return
    }
  }

  return (
    <div className='m-0 p-0 shadow-lg rounded-lg max-w-80'>
      <img
        onClick={onClick}
        className='cursor-pointer max-w-80 rounded-t-lg'
        src={image}
        alt='recipe image'
      />
      <div className='p-5 relative'>
        <div
          className='flex items-start flex-col cursor-pointer'
          onClick={onClick}
        >
          <div className='flex justify-between items-center w-full mt-2.5'>
            <span>{showDuration(duration)}</span>
            <span>{moment(postedOn).fromNow()}</span>
          </div>
          <span className='text-2xl font-bold'>{title}</span>
        </div>

        <div className='flex items-center flex-wrap gap-5 mt-5 border-b-2 border-neutral-300 pb-8 border-dashed border-t-0 border-l-0 border-r-0'>
          {categories.map((category, i) => (
            <span
              key={i}
              style={{
                color: categoryRenders.find((r) => r.value === category)
                  ?.color[0],
                backgroundColor: categoryRenders.find(
                  (r) => r.value === category
                )?.color[1],
              }}
              className='px-5 py-3 rounded-full flex items-center gap-2'
            >
              {categoryRenders.find((r) => r.value === category)?.icon}
              {(categoryLabel as any)[category]}
            </span>
          ))}
        </div>

        <div className='mt-8 flex items-center flex-col gap-2 w-full'>
          <button className='w-full bg-secondary c-white border-none py-2 text-lg font-medium rounded-full'>
            Share
          </button>
          {id && user?.saved.includes(id) ? (
            <div
              onClick={onSave}
              className='cursor-pointer c-secondary flex items-center gap-2 bg-blue-100 w-full rounded-full justify-center py-2'
            >
              <span className='font-medium'>Saved</span>
              <Check weight='bold' />
            </div>
          ) : (
            <button
              onClick={onSave}
              className='w-full bg-secondary c-white cursor-pointer border-none py-2 text-lg font-medium rounded-full'
            >
              Save
            </button>
          )}
          <div className='flex items-center justify-around w-full bg-blue-100 c-secondary rounded-full py-2'>
            <span>Wow</span>
            <Heart size={24} weight='fill' className='c-red translate-x--2.5' />
            <span>{reviews}</span>
          </div>
          <div
            className='flex items-center justify-center flex-col cursor-pointer mt-5'
            onClick={() => navigate('/authors/' + author?.id)}
          >
            <img
              src={
                !author?.profile
                  ? './images/avatar.webp'
                  : API_ENDPOINT + '/auth/profile/' + author.id
              }
              alt='author image'
              className='w-15 h-15 rounded-full object-cover'
            />
            <span className='block mt-2'>{author?.name}</span>
            {authorTotalRecipes ? (
              <span className='font-medium c-secondary'>
                {authorTotalRecipes} Recipe{showPluralS(authorTotalRecipes)}
              </span>
            ) : null}
          </div>
        </div>

        <span className='absolute top--8 right-5 block bg-black c-white px-5 py-3 rounded-full'>
          {priceType === 'free'
            ? 'Free'
            : priceType === 'paid'
            ? `Unlock \$${price || 0}`
            : `Subscribe Channel \$${author?.subscribeCost || 0}`}
        </span>
      </div>
    </div>
  )
}
