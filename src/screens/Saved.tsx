import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IRecipe } from '@backend/models/recipe'
import { ISave } from '@backend/models/save'
import { ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoBack } from '../components/GoBack'
import { Recipe } from '../components/home/Recipe'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { isSaved, onSave } from '../features/save'
import { useApi, useAuth } from '../hooks/api'

export function Saved(): ReactElement {
  const [user, _, __, loadingUser] = useAuth()
  const { data, error, loading } = useApi<
    (ISave & { recipe: IRecipe & { author: IAuthor; likes: ILike[] } })[]
  >('/recipe/saved', undefined, [user])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !loadingUser)
      navigate('/login', { state: { redirect: '/saved' } })
  }, [user, loadingUser])

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
              key={r.recipe.id}
              image={API_ENDPOINT + r.recipe.mainImage}
              postedOn={r.recipe.createdAt!}
              id={r.recipe.id!}
              {...r.recipe}
              saved={isSaved({ data: { saves: data }, user, id: r.recipe.id })}
              onSave={() => onSave({ user, id: r.recipe.id })}
              likesCount={r.recipe.likesDisplay}
              hideLike
            />
          ))}
        </div>
      )}
    </div>
  )
}
