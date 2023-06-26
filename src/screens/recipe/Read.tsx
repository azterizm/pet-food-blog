import classNames from 'classnames'
import { Heart } from 'phosphor-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthorProfileImage } from '../../components/AuthorProfileImage'
import { ErrorDialog } from '../../components/ErrorDialog'
import { Loader } from '../../components/Loader'
import { NotPaidDialog } from '../../components/NotPaidDialog'
import { LikeSection } from '../../components/recipe/LikeSection'
import PurchaseDialog from '../../components/recipe/PurchaseDialog'
import { ReadContent } from '../../components/recipe/ReadContent'
import { Recommendation } from '../../components/recipe/Recommendation'
import UnpublishedBanner from '../../components/recipe/UnpublishedBanner'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/recipe_read.css'
import { handleLike } from '../../features/like'
import { onSave } from '../../features/save'
import { useApi, useAuth } from '../../hooks/api'
import { useFade } from '../../hooks/state'
import { ApiProcess, RecipeReadData } from '../../types/api'
import { constructRecipeSchema } from '../../util/seo'

export function RecipeRead(): ReactElement {
  const { id } = useParams() as { id: string }
  const { data, error, loading, refetch } = useApi<RecipeReadData>(
    '/recipe/read/' + id,
    {
      onSuccess: (r) => {
        const d = data || r
        if (d) setLiked(d.userLiked), setFollowing(d.following)
      },
    },
    [id],
  )

  const navigate = useNavigate()
  const [user, changeUser] = useAuth()
  const fade = useFade()

  const [liked, setLiked] = useState(false)
  const [confirmPurchase, setConfirmPurchase] = useState(false)
  const [apiLoading, setApiLoading] = useState(false)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if (!id) window.location.href = '/'
  }, [])

  useEffect(() => {
    if (!data) return

    const exists = document.getElementById('recipe_schema')
    if (exists) return

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'recipe_schema'
    script.innerHTML = JSON.stringify(constructRecipeSchema(data))

    document.head.appendChild(script)

    return () => {
      const el = document.getElementById('script')
      if (el) el.remove()
    }
  }, [data])

  async function onPurchase() {
    if (!errorUnpaid || !user || !data) return
    const payResponse: ApiProcess = await fetch(
      API_ENDPOINT + '/recipe/pay/' + id,
      {
        method: 'post',
        credentials: 'include',
      },
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

  async function onLike() {
    const { error, info } = await handleLike(id, 'recipe')
    if (error) {
      alert(info)
      return
    }
    setLiked((e) => !e)
  }

  async function onFollow() {
    if (!user) return navigate('/login')
    setApiLoading(true)
    const response = await fetch(`${API_ENDPOINT}/follow/${data?.authorId}`, {
      credentials: 'include',
      method: 'post',
    }).then((r) => r.json())
    setApiLoading(false)
    if (response.error) return alert(response.info)
    setFollowing((e) => !e)
  }

  return (
    <div
      className={classNames(
        'min-h-100vh',
        data?.status === 'published' ? 'opacity-100' : 'opacity-50',
      )}
    >
      <Helmet>
        <title>
          {loading
            ? 'Loading...'
            : decodeURIComponent(data?.title || 'Unknown') || 'Unknown'}{' '}
          | So Pawlicious
        </title>
        <meta name='keywords' content={data?.tags.join(', ')} />
      </Helmet>
      {loading ? (
        <Loader />
      ) : (error && !errorUnpaid) || !data ? (
        <ErrorDialog text={error || 'Recipe not found'} />
      ) : (
        <div id='recipe_read' className='my-8'>
          <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2'>
            <img
              src={API_ENDPOINT + data.mainImage}
              alt='recipe image'
              className='max-w-unset! w-screen md:w-full md:rounded-r-lg mx--10 h-full object-cover'
              id='recipe_image'
            />
            <div className='flex justify-center flex-col items-start'>
              <div className='flex justify-start items-center gap-4 mt-4 lg:mt-0'>
                <AuthorProfileImage
                  className='rounded-full w-25 h-25 object-cover'
                  author={data.author}
                  onClick={() => navigate('/authors/' + data.authorId)}
                />
                <div onClick={onFollow}>
                  <p
                    onClick={() => navigate('/authors/' + data.authorId)}
                    className='m-0 mb-2'
                  >
                    {data.author.name}
                  </p>
                  <button
                    disabled={apiLoading}
                    className={
                      'font-bold text-center rounded-full block w-full border-0 py-2 disabled:opacity-50 ' +
                      (following
                        ? 'bg-white border-2 border-button text-button'
                        : 'bg-button text-white')
                    }
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
              <div className='w-full h-0.5 my-8 bg-gray-200' />
              <h1 className='m-0'>{decodeURIComponent(data.title)}</h1>
              <p className='m-0 mt-2 text-gray-500 font-medium'>
                by {data.author.name}
              </p>
              <div className='flex items-center my-4'>
                <div
                  className='flex items-center gap-2 cursor-pointer'
                  onClick={onLike}
                >
                  <Heart size={24} weight='fill' color='#FEA2AD' />
                  <span className='font-medium text-[#FEA2AD]'>
                    {data.likes + (liked ? 1 : 0)}
                  </span>
                </div>
                <div className='w-0.5 h-5 bg-gray-200 mx-5' />
                <span className='text-gray-400 font-bold'>
                  Viewed {data.views}
                </span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: data.intro }} />
              <div className='flex items-center gap-2 flex-wrap mt-8 justify-center mx-auto'>
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
              <div className='flex items-center gap-2 mt-4 mx-auto'>
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
              originalId={data.originalId}
              availableLanguages={data.availableLanguages}
              liked={liked}
              onLike={setLiked}
              onPrint={() => navigate('/recipes/read/print/' + id)}
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
              <div className='flex-col w-full flex items-start max-w-5xl mx-auto'>
                <ReadContent
                  changeLiked={setLiked}
                  liked={liked}
                  id={id}
                  data={data}
                />
              </div>
            )}
          </div>

          {errorUnpaid ? null : (
            <div className='max-w-5xl mx-auto relative'>
              <Recommendation
                contentType='recipe'
                title={'more by ' + data.author.name}
                items={data.author.recipes}
              />
              <Recommendation
                title='by others'
                items={data.popular}
                contentType='recipe'
              />
              <div className='absolute top-60 -left-5 lg:-left-10 xl:-left-30 w-[200vw] h-140 bg-gray-100 z--1' />
            </div>
          )}

          {confirmPurchase ? (
            <PurchaseDialog
              onCancel={() => (setConfirmPurchase(false), fade.hide())}
              onPurchase={() => (
                onPurchase(), fade.hide(), setConfirmPurchase(false)
              )}
            />
          ) : null}
          {data.status !== 'published' ? (
            <UnpublishedBanner status={data.status} />
          ) : null}
        </div>
      )}
    </div>
  )
}
