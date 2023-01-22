import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { Article, Check, Circle, Heart, Money } from 'phosphor-react'
import { ReactElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'
import { ApiProcess } from '../../types/api'
import { showCompactNumber, showPluralS } from '../../util/ui'

export interface ReadContentProps {
  data: IRecipe & { author: IAuthor; userLiked: boolean }
  id: string
  liked: boolean
  changeLiked: (arg: boolean) => void
}

export function ReadContent({
  liked,
  id,
  ...props
}: ReadContentProps): ReactElement {
  const [checkedIng, setCheckedIng] = useState<string[]>([])
  const [likes, setLikes] = useState(0)
  const [user, changeUser] = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (props.data) setLikes(props.data.likes)
  }, [props.data])

  async function like() {
    if (!id) return navigate('/login')
    let likes = !user ? [] : user.likes
    const data: ApiProcess = await fetch(API_ENDPOINT + '/recipe/like/' + id, {
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    if (data.error) {
      likes = likes.filter((r) => r !== Number(id))
      props.changeLiked(!liked)
      alert(data.info)
      return
    }
    if (!liked) {
      likes = likes.filter((r) => r !== Number(id)).concat(Number(id))
      setLikes((e) => e + 1)
    } else {
      likes = likes.filter((r) => r !== Number(id))
      setLikes((e) => e - 1)
    }
    if (user) {
      const newUser = { ...user, likes }
      changeUser(newUser)
    }
    props.changeLiked(!liked)
  }

  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div>
        <span className='text-3xl font-bold my-5 block'>Ingredients</span>
        {props.data.ingredients.map((ingredient, ingredientIndex) => (
          <div key={ingredientIndex}>
            <span className='block text-lg font-bold mt-5'>
              {ingredient.title}
            </span>
            {ingredient.items.map((item, itemIndex) => (
              <div key={itemIndex} className='flex items-center gap-2'>
                <span
                  className={
                    'cursor-pointer border-2 border-element border-r-0 w-10 h-10 flex items-center justify-center ' +
                    (itemIndex + 1 === ingredient.items.length
                      ? ''
                      : 'border-b-0')
                  }
                  onClick={() =>
                    setCheckedIng((e) =>
                      e.includes([ingredientIndex, itemIndex].join(':'))
                        ? e.filter(
                            (r) => r !== [ingredientIndex, itemIndex].join(':')
                          )
                        : [...e, [ingredientIndex, itemIndex].join(':')]
                    )
                  }
                >
                  {checkedIng.includes(ingredientIndex + ':' + itemIndex) ? (
                    <Check size={16} />
                  ) : (
                    <Circle size={16} />
                  )}
                </span>
                <span
                  className={`border-2 border-element ml--2 w-full border-r-0 pl-5 h-10 flex items-center justify-start ${
                    itemIndex + 1 === ingredient.items.length
                      ? ''
                      : 'border-b-0'
                  } ${
                    checkedIng.includes(ingredientIndex + ':' + itemIndex)
                      ? 'line-through'
                      : ''
                  }`}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <span className='text-3xl font-bold my-5 block'>Directions</span>
        <div
          className='flex flex-col items-start gap-5 relative'
          id='instructions'
        >
          {props.data.instructions.map((content, i) => (
            <div key={i}>
              <div className='flex items-start gap-5'>
                <span className='z-5 bg-secondary c-white min-w-12.5 min-h-12.5 flex-center rounded-full font-bold text-2xl translate-x--1'>
                  {i + 1}.
                </span>
                <div
                  id={
                    i === props.data.instructions.length - 1
                      ? ''
                      : 'instruction'
                  }
                  className='translate-y--2'
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='text-2xl font-bold mt-5 mb-2 block'>Notes</div>
        <div className='flex flex-col gap-2'>
          {props.data.notes.map((note, i) => (
            <div key={i} className='flex items-center gap-2'>
              <span className='font-black'>&bull;</span>
              <span key={i}>{note}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-5 c-primary'>
        <div
          onClick={like}
          className='flex items-center gap-2 font-medium text-md bg-gray-300 px-5 py-3 rounded-lg hover:bg-gray-400 cursor-pointer'
        >
          <Heart
            weight={liked ? 'fill' : 'regular'}
            size={20}
            className={liked ? 'c-red' : 'c-primary'}
          />
          <span>
            {showCompactNumber(likes)} like
            {showPluralS(props.data.likes)}
          </span>
        </div>
        <div className='flex items-center gap-2 font-medium text-md bg-gray-300 px-5 py-3 rounded-lg hover:bg-gray-400 cursor-pointer'>
          <Article size={20} />
          <span>Print</span>
        </div>
        <div className='flex items-center gap-2 font-medium text-md bg-gray-300 px-5 py-3 rounded-lg hover:bg-gray-400 cursor-pointer'>
          <Money size={20} />
          <span>Donate</span>
        </div>
      </div>
      <div>
        <div className='text-xl font-bold mt-5 mb-2 block'>Tags</div>
        {!props.data.tags.length ? (
          <span>No tags.</span>
        ) : (
          <span>{props.data.tags.join(', ')}</span>
        )}
      </div>
    </div>
  )
}
