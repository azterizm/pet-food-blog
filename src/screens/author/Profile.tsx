import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ISocialMedia } from '@backend/models/socialMedia'
import { capitalize } from 'lodash'
import { Check, UserMinus } from 'phosphor-react'
import { ReactElement, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorDialog } from '../../components/ErrorDialog'
import { GoBack } from '../../components/GoBack'
import { Recipe } from '../../components/home/Recipe'
import { RenderIconByName } from '../../components/icons/RenderIconByName'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi, useAuth } from '../../hooks/api'
import { useUndefinedParam } from '../../hooks/ui'

export function AuthorProfile(): ReactElement {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, _, refetchUser] = useAuth()
  const { data, loading, error } = useApi<
    IAuthor & {
      recipes: IRecipe[]
      socialMedia: ISocialMedia[]
      subscribed: boolean
    }
  >('/author/one/' + id)
  const [unsubscribe, setUnsubscribe] = useState(false)
  useUndefinedParam(id)

  async function subscribe(proceed: boolean) {
    if (!user) return navigate('/login')
    const data = await fetch(
      `${API_ENDPOINT}/user/${proceed ? 'subscribe' : 'unsubscribe'}/${id}`,
      {
        credentials: 'include',
        method: 'post',
      }
    ).then((r) => r.json())
    if (data.error) return alert(data.info)
    refetchUser()
    window.location.reload()
  }

  return (
    <div className='min-h-100vh'>
      {loading ? (
        <Loader />
      ) : error || !data ? (
        <ErrorDialog text={error || 'User not found'} showLabel={false} />
      ) : (
        <div>
          <GoBack />
          <div className='flex-center flex-col my-20 gap-4'>
            <img
              src={API_ENDPOINT + '/auth/profile/' + data.id}
              alt='profile picture'
              className='w-40 h-40 object-cover rounded-lg shadow-lg'
            />
            <p className='text-4xl font-bold'>{data.name}</p>
            <div className='flex-center gap-5'>
              {data.socialMedia.map((s, i) => (
                <RenderIconByName
                  key={i}
                  size={24}
                  name={capitalize(s.name) + 'Logo'}
                  className='hover:c-primary cursor-pointer'
                  onClick={() => window.open(s.url, '_blank')?.focus()}
                />
              ))}
            </div>
            <p className='text-center max-w-100'>{data.bio}</p>

            {data.subscribeCost > 0 && !data.subscribed ? (
              <button
                onClick={() => subscribe(true)}
                className='bg-primary c-white px-5 py-3 rounded-full text-lg font-bold border-none'
              >
                Subscribe for {data.subscribeCost}$/month
              </button>
            ) : null}

            {data.subscribed ? (
              <div
                className='cursor-pointer flex-center gap-2 border-2 border-primary px-5 py-3 rounded-full'
                onClick={() => setUnsubscribe((e) => !e)}
              >
                <span>Subscribed</span>
                <Check />
              </div>
            ) : null}
          </div>

          <div className='flex flex-wrap gap-10 items-center'>
            {data.recipes.map((r) => (
              <Recipe
                key={r.id}
                image={API_ENDPOINT + r.mainImage}
                postedOn={r.createdAt!}
                reviews={r.likes}
                onClick={() => navigate('/recipes/read/' + r.id)}
                {...r}
              />
            ))}
          </div>
        </div>
      )}

      {unsubscribe ? (
        <div className='fixed-center z-101 flex-center flex-col gap-5 bg-white border-2 border-primary px-10 py-5 rounded-lg'>
          <UserMinus size={56} />
          <span>Do you really want to unsubscribe this author?</span>
          <div className='flex-center gap-5'>
            <button
              onClick={() => setUnsubscribe(false)}
              className='bg-primary c-white border-none px-5 py-3 rounded-lg font-medium'
            >
              Cancel
            </button>
            <button
              onClick={() => subscribe(false)}
              className='bg-transparent c-red px-5 py-3 rounded-lg border-none font-bold'
            >
              Proceed
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
