import { IAuthor } from '@backend/models/author'
import { IPurchase } from '@backend/models/purchase'
import { IRecipe } from '@backend/models/recipe'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { Recipe } from '../components/home/Recipe'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { isSaved, onSave } from '../features/save'
import { useApi, useAuth } from '../hooks/api'

export function Purchases(): ReactElement {
  const navigate = useNavigate()
  const [user] = useAuth()
  const { data, error, loading } =
    useApi<(IPurchase & { author: IAuthor; recipe: IRecipe })[]>(
      '/user/purchases'
    )
  return (
    <div className='my-5'>
      <span className='uppercase c-primary text-xl font-bold'>Purchases</span>
      {loading ? (
        <Loader />
      ) : error || !data || !data.length ? (
        <p className='text-start m-0'>
          {!data || !data.length ? 'No purchases' : error}
        </p>
      ) : (
        <div className='flex flex-wrap gap-10 justify-start items-center'>
          {data.map(({ recipe, author, createdAt }) => (
            <Recipe
              key={recipe.id}
              title={recipe.title}
              author={author}
              postedOn={recipe.createdAt!}
              reviews={recipe.likesDisplay}
              image={API_ENDPOINT + recipe.mainImage}
              duration={recipe.duration}
              onClick={() => navigate('/recipes/read/' + recipe.id)}
              categories={recipe.categories}
              price={recipe.price}
              priceType={recipe.priceType}
              purchased
              purchaseDate={createdAt}
              id={recipe.id!}
              onSave={() =>
                onSave({
                  user,
                  id: recipe.id,
                })
              }
              saved={isSaved({ data: { saves: data }, user, id: recipe.id })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
