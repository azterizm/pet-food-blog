import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IRecipe } from '@backend/models/recipe'
import { Check, Circle } from 'phosphor-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'
import { donateAuthor } from '../../features/author'
import { onSave } from '../../features/save'
import { useAuth } from '../../hooks/api'
import { ApiProcess } from '../../types/api'
import { DonateStatus } from '../../types/ui'
import { Donate } from './Donate'
import { HelpSection } from './HelpSection'
import { LikeSection } from './LikeSection'

export interface ReadContentProps {
  data: IRecipe & {
    author: IAuthor
    userLiked: boolean
    likes: ILike[]
    userSaved: boolean
  }
  id: string
  liked: boolean
  changeLiked: (arg: boolean) => void
}

export function ReadContent({
  liked,
  id,
  ...props
}: ReadContentProps): ReactElement {
  const [user] = useAuth()
  const [checkedIng, setCheckedIng] = useState<string[]>([])
  const [likes, setLikes] = useState(0)
  const [donateStatus, setDonateStatus] = useState<DonateStatus>(
    DonateStatus.Idle
  )

  const navigate = useNavigate()

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.data) setLikes(props.data.likes.length)
  }, [props.data])

  async function onLike() {
    if (!id) return navigate('/login')
    const data: ApiProcess = await fetch(API_ENDPOINT + '/recipe/like/' + id, {
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    if (data.error) {
      props.changeLiked(!liked)
      alert(data.info)
      return
    }
    if (!liked) setLikes((e) => e + 1)
    else setLikes((e) => e - 1)

    props.changeLiked(!liked)
  }

  async function donate(amount: number) {
    if (!amount) return
    setDonateStatus(DonateStatus.Process)
    const data: ApiProcess = await donateAuthor({
      id: props.data.author.id!,
      amount,
    })
    setDonateStatus(DonateStatus.Process)
    if (data.error) return alert(data.info)
    setDonateStatus(DonateStatus.Done)
  }

  function onPrint() {
    window.print()
  }

  return (
    <div className='flex flex-col gap-5 mt-10' id='content' ref={containerRef}>
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
      <LikeSection
        saved={props.data.userSaved}
        onSave={() => onSave({ id, user })}
        liked={liked}
        likes={likes}
        onLike={onLike}
        onPrint={onPrint}
      />
      <HelpSection author={props.data.author} />
      <Donate
        status={donateStatus}
        onDonate={donate}
        name={props.data.author.name}
        onReset={() => setDonateStatus(DonateStatus.Idle)}
      />
    </div>
  )
}
