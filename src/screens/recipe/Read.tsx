import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Portal } from 'react-portal'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorDialog } from '../../components/ErrorDialog'
import { GoBack } from '../../components/GoBack'
import { Hero } from '../../components/home/Hero'
import { Loader } from '../../components/Loader'
import { NotPaidDialog } from '../../components/NotPaidDialog'
import { ReadContent } from '../../components/recipe/ReadContent'
import { Recommendation } from '../../components/recipe/Recommendation'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/recipe_read.css'
import { useApi, useAuth } from '../../hooks/api'
import { useFade } from '../../hooks/state'
import { ApiProcess } from '../../types/api'
import { showDuration, showPluralS } from '../../util/ui'

interface ReadData extends IRecipe {
  author: IAuthor & { recipes: IRecipe[] }
  userLiked: boolean
  popular: IRecipe[]
}

export function RecipeRead(): ReactElement {
  const { id } = useParams() as { id: string }
  const { data, error, loading, refetch } = useApi<ReadData>(
    '/recipe/read/' + id,
    {
      onSuccess: (r) => {
        const d = data || r
        if (d) setLiked(d.userLiked)
      },
    },
    [id]
  )

  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [user, changeUser] = useAuth()
  const [confirmPurchase, setConfirmPurchase] = useState(false)
  const fade = useFade()

  useEffect(() => {
    if (!id) window.location.href = '/'
  }, [])

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
            author={data.author}
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
          <div className='block mt-10'>
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
              <div className='w-full flex items-start'>
                <div className='flex-1'>
                  <ReadContent
                    changeLiked={setLiked}
                    liked={liked}
                    id={id}
                    data={data}
                  />
                </div>
                <div className='ml-10 hidden md:flex flex-col items-center gap-20'>
                  <Recommendation
                    title='latest recipes'
                    items={data.author.recipes}
                  />
                  <Recommendation
                    title='popular articles'
                    items={data.popular}
                  />
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
