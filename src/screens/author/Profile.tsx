import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ISocialMedia } from '@backend/models/socialMedia'
import { capitalize } from 'lodash'
import type { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorDialog } from '../../components/ErrorDialog'
import { GoBack } from '../../components/GoBack'
import { Recipe } from '../../components/home/Recipe'
import { RenderIconByName } from '../../components/icons/RenderIconByName'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { useUndefinedParam } from '../../hooks/ui'

export function AuthorProfile(): ReactElement {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useApi<
    IAuthor & { recipes: IRecipe[]; socialMedia: ISocialMedia[] }
  >('/author/one/' + id)
  useUndefinedParam(id)

  async function subscribe() {}

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

            <button
              onClick={subscribe}
              className='bg-primary c-white px-5 py-3 rounded-full text-lg font-bold border-none'
            >
              Subscribe
            </button>
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
    </div>
  )
}
