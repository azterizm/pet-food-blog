import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IRecipe } from '@backend/models/recipe'
import { IVetInfo } from '@backend/models/vetInfo'
import { Heart } from 'phosphor-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Portal } from 'react-portal'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthorProfileImage } from '../../components/AuthorProfileImage'
import { ErrorDialog } from '../../components/ErrorDialog'
import { Loader } from '../../components/Loader'
import { NotPaidDialog } from '../../components/NotPaidDialog'
import { LikeSection } from '../../components/recipe/LikeSection'
import { ReadContent } from '../../components/recipe/ReadContent'
import { Recommendation } from '../../components/recipe/Recommendation'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/recipe_read.css'
import { onSave } from '../../features/save'
import { useApi, useAuth } from '../../hooks/api'
import { useFade } from '../../hooks/state'
import { ApiProcess } from '../../types/api'

interface ReadData extends IRecipe {
  author: IAuthor & { recipes: IRecipe[] }
  userLiked: boolean
  userSaved: boolean
  popular: IRecipe[]
  likes: ILike[]
  vetinfo?: IVetInfo
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

  async function onPurchase() {
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
          <div className='max-w-5xl mx-auto grid grid-cols-2'>
            <img
              src={API_ENDPOINT + data.mainImage}
              alt='recipe image'
              className='w-full h-full rounded-lg'
            />
            <div className='ml-8 flex justify-center flex-col items-start'>
              <div className='flex justify-start items-center gap-4'>
                <AuthorProfileImage
                  className='rounded-full w-25 h-25 object-cover'
                  author={data.author}
                />
                <div>
                  <p className='m-0 mb-2'>{data.author.name}</p>
                  <button className='bg-button font-bold text-center text-white rounded-full block w-full border-0 py-2'>
                    Follow
                  </button>
                </div>
              </div>
              <div className='w-full h-0.5 my-8 bg-gray-200' />
              <h1 className='m-0'>{data.title}</h1>
              <p className='m-0 mt-2'>by {data.author.name}</p>
              <div className='flex items-center my-4'>
                <div className='flex items-center gap-2'>
                  <Heart size={24} weight='fill' color='#FEA2AD' />
                  <span className='font-medium text-[#FEA2AD]'>
                    {data.likes.length}
                  </span>
                </div>
                <div className='w-0.5 h-5 bg-gray-200 mx-5' />
                <span className='text-gray-400 font-bold'>Viewed 22343</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: data.intro }} />
              <div className='flex items-center gap-2 flex-wrap mt-8'>
                {data.categories.map((category, i) => (
                  <p
                    key={i}
                    className='capitalize cursor-pointer hover:contrast-75 m-0 px-5 py-2 rounded-full bg-white text-[#98d4cb] border-4 border-[#98d4cb]'
                    onClick={() =>
                      navigate('/recipes', { state: { category } })
                    }
                  >
                    {category}
                  </p>
                ))}
              </div>
              <div className='flex items-center gap-2 mt-4'>
                <div className='flex justify-center items-center flex-col text-gray-400'>
                  <span className='text-4xl font-light'>{data.duration}</span>
                  <span className='text-sm'>Minutes</span>
                </div>
                <div className='w-0.5 h-10 bg-gray-200 mx-5' />
                <div className='flex justify-center items-center flex-col text-gray-400'>
                  <span className='text-4xl font-light'>{data.servings}</span>
                  <span className='text-sm'>Servings</span>
                </div>
                <div className='w-0.5 h-10 bg-gray-200 mx-5' />
                <div className='flex justify-center items-center flex-col text-gray-400'>
                  <span className='text-4xl font-light uppercase'>
                    {data.lang}
                  </span>
                  <span className='text-sm'>Language</span>
                </div>
              </div>
            </div>

            <LikeSection
              liked={data.userLiked}
              onPrint={() => window.print()}
              onSave={() => onSave({ user, id })}
              saved={data.userSaved}
            />
          </div>

          <div className='block'>
            <div className='relative'>
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
              <div className='w-full flex items-start max-w-5xl mx-auto'>
                <div className='flex-1'>
                  <ReadContent
                    changeLiked={setLiked}
                    liked={liked}
                    id={id}
                    data={data}
                  />

                  <div className='flex items-start flex-col w-full gap-10 relative'>
                    <Recommendation
                      title='latest'
                      items={data.author.recipes}
                    />
                    <Recommendation title='popular' items={data.popular} />
                    <div className='bg-neutral-100 w-screen h-120 absolute top-50 left--10 z--1' />
                  </div>
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
                      onPurchase(), fade.hide(), setConfirmPurchase(false)
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
