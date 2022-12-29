import { IAuthor } from '@backend/models/author'
import { Portal } from 'react-portal'
import { IRecipe } from '@backend/models/recipe'
import { Article, Check, Circle, Heart, Money } from 'phosphor-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorDialog } from '../../components/ErrorDialog'
import { GoBack } from '../../components/GoBack'
import { Hero } from '../../components/home/Hero'
import { Loader } from '../../components/Loader'
import { NotPaidDialog } from '../../components/NotPaidDialog'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/recipe_read.css'
import { useApi, useAuth } from '../../hooks/api'
import { ApiProcess } from '../../types/api'
import { showCompactNumber, showDuration, showPluralS } from '../../util/ui'
import { useFade } from '../../hooks/state'

export function RecipeRead(): ReactElement {
  const { id } = useParams() as { id: string }
  const { data, error, loading, refetch } = useApi<
    IRecipe & { author: IAuthor; userLiked: boolean }
  >('/recipe/read/' + id, {
    onSuccess: (r) => {
      const d = data || r
      if (d) setLiked(d.userLiked)
    },
  })
  const navigate = useNavigate()
  const [checkedIng, setCheckedIng] = useState<string[]>([])
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [user, changeUser] = useAuth()
  const [confirmPurchase, setConfirmPurchase] = useState(false)
  const fade = useFade()

  useEffect(() => {
    if (!id) window.location.href = '/'
  }, [])

  useEffect(() => {
    if (data) setLikes(data.likes)
  }, [data])

  async function like() {
    if (!id) return navigate('/login')
    let likes = !user ? [] : user.likes
    const data: ApiProcess = await fetch(API_ENDPOINT + '/recipe/like/' + id, {
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    if (data.error) {
      likes = likes.filter((r) => r !== Number(id))
      setLiked((e) => !e)
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
    setLiked((e) => !e)
  }

  async function purchase() {
    if (!errorUnpaid || !user || !data) return
    const payResponse: ApiProcess = await fetch(
      API_ENDPOINT + '/recipe/pay/' + id,
      {
        method: 'post',
        credentials: 'include',
      }
    ).then((r) => r.json())
    if (payResponse.error) {
      alert(payResponse.info)
      return
    }
    const newDeposit = user.deposit - data.price
    changeUser({ ...user, deposit: newDeposit })
    refetch()
  }

  const errorUnpaid = useMemo(() => {
    return Boolean(error && error.includes('paid'))
  }, [error])

  return (
    <div className='min-h-100vh'>
      {loading ? (
        <Loader />
      ) : (error && !errorUnpaid) || !data ? (
        <ErrorDialog text={error || 'Recipe not found'} />
      ) : (
        <div id='recipe_read'>
          <div className='mb-5'>
            <GoBack />
          </div>
          <Hero
            authors={[data.author]}
            title={data.title}
            image={API_ENDPOINT + data.mainImage}
            categories={data.categories}
            publishedOn={data.createdAt || new Date()}
          />
          <div className='flex justify-center items-center gap-2 uppercase font-medium text-primary text-xs mt-5'>
            <span>{showDuration(data.duration)}</span>
            <span>•</span>
            <span>
              {data.servings}
              {' serve'}
              {showPluralS(data.servings)}
            </span>
            <span>•</span>
            <span>{data.lang}</span>
          </div>
          <div className='max-w-200 mx-auto block mt-10'>
            <div className='relative'>
              <div
                id='content'
                dangerouslySetInnerHTML={{ __html: data.intro }}
              ></div>
              {errorUnpaid ? (
                <div className='absolute top-0 left-0 bg-gradient-to-b from-white/30 to-white w-full h-full'></div>
              ) : null}
            </div>
            {errorUnpaid ? (
              <NotPaidDialog
                onPurchase={() => (setConfirmPurchase(true), fade.show())}
                onSubscribe={() => navigate('/authors/' + data.author.id)}
                loggedIn={Boolean(user)}
                price={data.price}
                priceType={data.priceType}
                subscribeCost={data.author.subscribeCost}
              />
            ) : (
              <div className='flex flex-col gap-5 mt-10'>
                <div>
                  <span className='text-xl font-bold my-5 block'>
                    Ingredients
                  </span>
                  {data.ingredients.map((ingredient, ingredientIndex) => (
                    <div key={ingredientIndex}>
                      <span className='block text-lg font-bold mt-5'>
                        {ingredient.title}
                      </span>
                      {ingredient.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className='flex items-center gap-2'
                        >
                          <span
                            className={
                              'cursor-pointer border-2 border-element border-r-0 w-10 h-10 flex items-center justify-center ' +
                              (itemIndex + 1 === ingredient.items.length
                                ? ''
                                : 'border-b-0')
                            }
                            onClick={() =>
                              setCheckedIng((e) =>
                                e.includes(
                                  [ingredientIndex, itemIndex].join(':')
                                )
                                  ? e.filter(
                                      (r) =>
                                        r !==
                                        [ingredientIndex, itemIndex].join(':')
                                    )
                                  : [
                                      ...e,
                                      [ingredientIndex, itemIndex].join(':'),
                                    ]
                              )
                            }
                          >
                            {checkedIng.includes(
                              ingredientIndex + ':' + itemIndex
                            ) ? (
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
                              checkedIng.includes(
                                ingredientIndex + ':' + itemIndex
                              )
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
                  <span className='text-xl font-bold my-5 block'>
                    Directions
                  </span>
                  <div
                    className='flex flex-col items-start gap-5 relative'
                    id='instructions'
                  >
                    {data.instructions.map((content, i) => (
                      <div key={i} id={'instruction'}>
                        <div className='flex items-start gap-5'>
                          <span className='z-5 bg-primary c-white min-w-10 min-h-10 flex-center rounded-full'>
                            {i + 1}.
                          </span>
                          <div
                            className='translate-y--2'
                            dangerouslySetInnerHTML={{ __html: content }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className='text-xl font-bold mt-5 mb-2 block'>Notes</div>
                  <div className='flex flex-col gap-2'>
                    {data.notes.map((note, i) => (
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
                      {showCompactNumber(likes)} Like
                      {showPluralS(data.likes)}
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
                  <div className='text-lg font-bold mt-5 mb-2 block'>Tags</div>
                  {!data.tags.length ? (
                    <span>No tags.</span>
                  ) : (
                    <span>{data.tags.join(', ')}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          {confirmPurchase ? (
            <Portal>
              <div className='shadow-lg fixed-center bg-white p-8 rounded-lg text-center c-primary max-w-100'>
                <h3>Are you sure that you want to purchase this recipe?</h3>
                <div className='flex gap-5 justify-center'>
                  <button
                    onClick={() => (
                      purchase(), fade.hide(), setConfirmPurchase(false)
                    )}
                    className='rounded-lg font-bold px-5 py-3 c-white bg-secondary border-none'
                  >
                    Purchase
                  </button>
                  <button
                    onClick={() => (setConfirmPurchase(false), fade.hide())}
                    className='bg-transparent c-primary font-bold border-none'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Portal>
          ) : null}
        </div>
      )}
    </div>
  )
}
