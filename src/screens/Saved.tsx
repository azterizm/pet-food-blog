import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ReactElement } from 'react'
import { GoBack } from '../components/GoBack'
import { Recipe } from '../components/home/Recipe'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { useApi, useAuth } from '../hooks/api'

export function Saved(): ReactElement {
  const [user] = useAuth()
  const { data, error, loading } = useApi<(IRecipe & { author: IAuthor })[]>(
    '/recipe/saved',
    undefined,
    [user]
  )

  return (
    <div className='min-h-100vh w-full'>
      <GoBack />
      <h1 className='text-center'>Saved recipes</h1>
      {loading ? (
        <Loader />
      ) : !data || !data.length || error ? (
        <span className='mt-30 block'>No recipes are saved yet.</span>
      ) : (
        <div className='flex flex-wrap gap-5'>
          {data.map((r) => (
            <Recipe
              key={r.id}
              image={API_ENDPOINT + r.mainImage}
              postedOn={r.createdAt!}
              id={r.id!}
              {...r}
            />
          ))}
        </div>
      )}
    </div>
  )
}
