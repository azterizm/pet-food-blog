import { IAuthor } from '@backend/models/author'
import classNames from 'classnames'
import { RecipeCategory } from '@backend/models/recipe'
import moment from 'moment'
import { Check, Heart } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryLabel } from '../../types/api'
import { PriceType } from '../../types/ui'
import { showDuration, showPluralS } from '../../util/ui'
import { categoryRenders } from '../icons/RecipeCategory'
import { Sharing } from '../recipe/Sharing'
import { handleLike } from '../../features/like'

interface Props {
  title: string
  onHeartClick?: () => void
  author?: Pick<IAuthor, 'id' | 'name' | 'subscribeCost' | 'profile'>
  postedOn: Date
  fullWidth?: boolean
  likesCount?: number
  image: string
  duration: number
  authorTotalRecipes?: number
  priceType?: PriceType
  price?: number
  categories: RecipeCategory[]
  onClick?: () => void
  id: number
  saved?: boolean
  onSave?: () => void
  purchased?: boolean
  userLiked?: boolean
  purchaseDate?: string | Date
  hideLike?: boolean
}

export function Recipe({
  onHeartClick,
  hideLike,
  userLiked,
  id,
  onSave,
  purchased,
  purchaseDate,
  priceType,
  price,
  duration,
  image,
  title,
  likesCount: reviews = 0,
  postedOn,
  author,
  onClick,
  categories,
  authorTotalRecipes,
  saved,
  fullWidth,
}: Props) {
  const navigate = useNavigate()
  const [newSave, setNewSave] = useState(saved)
  const [showShare, setShowShare] = useState(false)
  const [recipeLiked, setRecipeLiked] = useState(false)
  const [increment, setIncrement] = useState(false)
  const [decrement, setDecrement] = useState(false)

  useEffect(() => {
    setRecipeLiked(Boolean(userLiked))
  }, [userLiked])

  async function onLike(id: number) {
    await handleLike(id, 'recipe')
    setRecipeLiked((e) => !e)
    if (increment) setIncrement(false)
    else if (decrement) setDecrement(false)
    else if (userLiked) setDecrement(true)
    else setIncrement(true)
  }

  return (
    <div
      className={classNames(
        'm-0 p-0 shadow-lg rounded-lg',
        fullWidth ? 'w-full' : 'max-w-80',
      )}
    >
      <img
        onClick={onClick}
        className={classNames(
          'cursor-pointer object-cover rounded-t-lg',
          fullWidth ? 'w-full' : 'max-w-80',
        )}
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
                  (r) => r.value === category,
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
          {showShare ? (
            <Sharing disableSharing id={id} />
          ) : (
            <button
              onClick={() => setShowShare(true)}
              className='w-full bg-secondary c-white border-none py-2 text-lg font-medium rounded-full'
            >
              Share
            </button>
          )}
          {onSave ? (
            <>
              {newSave ? (
                <div
                  onClick={() => (onSave(), setNewSave((e) => !e))}
                  className='cursor-pointer c-secondary flex items-center gap-2 bg-blue-100 w-full rounded-full justify-center py-2'
                >
                  <span className='font-medium'>Saved</span>
                  <Check weight='bold' />
                </div>
              ) : (
                <button
                  onClick={() => (onSave(), setNewSave((e) => !e))}
                  className='w-full bg-secondary c-white cursor-pointer border-none py-2 text-lg font-medium rounded-full'
                >
                  Save
                </button>
              )}
            </>
          ) : null}
          {hideLike ? null : (
            <div className='flex items-center justify-around w-full bg-blue-100 c-secondary rounded-full py-2'>
              <span>Wow</span>
              <Heart
                size={24}
                weight={recipeLiked ? 'fill' : 'thin'}
                className='c-red translate-x--2.5 cursor-pointer'
                onClick={() => (onHeartClick ? onHeartClick() : onLike(id))}
              />
              <span>{reviews - (decrement ? 1 : 0) + (increment ? 1 : 0)}</span>
            </div>
          )}
          <div
            className='flex items-center justify-center flex-col cursor-pointer mt-5'
            onClick={() => navigate('/authors/' + author?.id)}
          >
            <img
              src={!author?.profile ? './images/avatar.webp' : author.profile}
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
            ? purchased
              ? `Purchased for \$${price || 0} ${
                  purchaseDate
                    ? 'at ' + new Date(purchaseDate).toLocaleDateString()
                    : ''
                }`
              : `Unlock \$${price || 0}`
            : purchased
            ? `Subscribed channel ${
                purchaseDate
                  ? 'at ' + new Date(purchaseDate).toLocaleDateString()
                  : ''
              }`
            : `Subscribe Channel \$${author?.subscribeCost || 0}`}
        </span>
      </div>
    </div>
  )
}
