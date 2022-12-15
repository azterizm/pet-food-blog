import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoBack } from '../components/GoBack'
import { Recipe } from '../components/home/Recipe'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { useApi } from '../hooks/api'

export function Purchases(): ReactElement {
  const navigate = useNavigate()
  const { data, error, loading } =
    useApi<(IRecipe & { author: IAuthor })[]>('/user/purchases')
  console.log('data:', data)
  return (
    <div className='min-h-90vh mr-20'>
      <div className='mb-5'>
        <GoBack />
      </div>
      {loading ? (
        <Loader />
      ) : error || !data || !data.length ? (
        <div className='absolute-center'>
          <span className='c-red'>
            {!data || !data.length ? 'No purchases' : error}
          </span>
        </div>
      ) : (
        <div className='flex flex-wrap gap-10 justify-center items-center'>
          {data.map((recipe) => (
            <Recipe
              key={recipe.id}
              title={recipe.title}
              authors={[recipe.author]}
              postedOn={recipe.createdAt!}
              reviews={recipe.likes}
              image={API_ENDPOINT + recipe.mainImage}
              duration={recipe.duration}
              onClick={() => navigate('/recipes/read/' + recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
