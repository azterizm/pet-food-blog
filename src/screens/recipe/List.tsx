import { CaretDown } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Recipe } from '../../components/home/Recipe'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { categories, categoryLabel, Recipe as RecipeT } from '../../types/api'

export function RecipeList(): ReactElement {
  const { data, error, loading } = useApi<RecipeT[]>(
    '/recipe/get_recipes/main/new/0',
    { params: { category: 'meal' } }
  )
  console.log('data:', data)
  return (
    <div className='min-h-100vh'>
      <div className='text-center my-10'>
        <span className='text-4xl block font-bold mb-2'>Recipes</span>
        <span>All the food your pet ever needs.</span>
      </div>
      <div className='justify-center mt-5 flex flex-wrap items-center gap-5'>
        {categories.map((r, i) => (
          <div
            className='bg-gray-300 block px-5 py-2 rounded-full c-black'
            key={'category_' + i}
          >
            {categoryLabel[r]}
          </div>
        ))}
      </div>
      <div className='mb-5 mt-10 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <CaretDown size={16} />
          <span>Sort by: Newest</span>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <span>{error}</span>
      ) : data && data.length ? (
        <div className='flex flex-wrap gap-10 items-center'>
          {data.map((r) => (
            <Recipe
              authors={[r.author.name]}
              duration={r.duration + ' min'}
              image={API_ENDPOINT + r.mainImage}
              postedOn={r.createdAt}
              reviews={0}
              title={r.title}
              paid={Boolean(r.price)}
              key={r.id}
            />
          ))}
        </div>
      ) : (
        <span>No recipes are avialable yet. Please try again later.</span>
      )}
    </div>
  )
}
