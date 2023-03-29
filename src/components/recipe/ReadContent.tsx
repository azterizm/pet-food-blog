import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { Check, Circle } from 'phosphor-react'
import { ReactElement, useRef, useState } from 'react'
import { donateAuthor } from '../../features/author'
import { ApiProcess } from '../../types/api'
import { DonateStatus } from '../../types/ui'
import { Donate } from './Donate'
import { HelpSection } from './HelpSection'

export interface ReadContentProps {
  data: IRecipe & {
    author: IAuthor
    userLiked: boolean
    likes: number
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
  const [checkedIng, setCheckedIng] = useState<string[]>([])
  const [donateStatus, setDonateStatus] = useState<DonateStatus>(
    DonateStatus.Idle
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const [doneSteps, setDoneSteps] = useState<number[]>([])

  async function onDonate(amount: number) {
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

  return (
    <div
      className='max-w-xl flex flex-col gap-5'
      id='content'
      ref={containerRef}
    >
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
                  id='ingredient_checkbox'
                  className={
                    'cursor-pointer relative z-1 rounded-full border-element w-10 h-10 flex items-center justify-center ' +
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
                    <Check weight='bold' color='#fff' size={16} />
                  ) : (
                    <Circle color='#fff' weight='fill' size={16} />
                  )}
                </span>
                <span
                  onClick={() =>
                    setCheckedIng((e) =>
                      e.includes([ingredientIndex, itemIndex].join(':'))
                        ? e.filter(
                            (r) => r !== [ingredientIndex, itemIndex].join(':')
                          )
                        : [...e, [ingredientIndex, itemIndex].join(':')]
                    )
                  }
                  className={`border-0 border-element ml--2 w-full border-r-0 pl-5 h-10 flex items-center justify-start cursor-pointer ${
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
                <span className='z-5 bg-[#c1e5e0] c-white min-w-12.5 min-h-12.5 flex-center rounded-full font-regular text-xl translate-x--1'>
                  {i + 1}.
                </span>
                <div>
                  <div
                    id={
                      i === props.data.instructions.length - 1
                        ? ''
                        : 'instruction'
                    }
                    className='translate-y--2'
                    dangerouslySetInnerHTML={{ __html: content }}
                  />

                  <div
                    className='flex items-start gap-2 text-sm font-medium cursor-pointer'
                    onClick={() =>
                      setDoneSteps((r) =>
                        !r.includes(i) ? [...r, i] : r.filter((e) => e !== i)
                      )
                    }
                  >
                    <label
                      className='checkbox_container'
                      onClick={() =>
                        setDoneSteps((r) =>
                          !r.includes(i) ? [...r, i] : r.filter((e) => e !== i)
                        )
                      }
                    >
                      <input
                        type='checkbox'
                        name='mark'
                        id='mark'
                        className='checkbox'
                        checked={doneSteps.includes(i)}
                        onChange={(e) =>
                          setDoneSteps((r) =>
                            e.target.checked
                              ? [...r, i]
                              : r.filter((e) => e !== i)
                          )
                        }
                      />
                      <span className='checkmark'></span>
                    </label>
                    <span className='block translate-y-1'>
                      {!doneSteps.includes(i) ? 'Mark as complete' : 'Done!'}
                    </span>
                  </div>
                </div>
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

      <HelpSection
        recipe={props.data}
        author={props.data.author}
        recipeId={props.data.id!}
      />
      <Donate
        status={donateStatus}
        onDonate={onDonate}
        name={props.data.author.name}
        onReset={() => setDonateStatus(DonateStatus.Idle)}
      />
    </div>
  )
}
