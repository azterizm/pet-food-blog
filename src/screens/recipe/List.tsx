import { CaretDown, FunnelSimple } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Recipe } from '../../components/home/Recipe'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { Recipe as RecipeT } from '../../types/api'

export function RecipeList(): ReactElement {
  const { data, error, loading } = useApi<
    (RecipeT & { author: { id: number; name: string } })[]
  >('/recipe/get_recipes/main/new/0')
  console.log('data:', data)
  return (
    <div>
      <div className='text-center mb-10'>
        <span className='text-4xl block font-bold mb-2'>Recipes</span>
        <span>All the food your pet ever needs.</span>
      </div>
      <div className='mb-5 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <CaretDown size={16} />
          <span>Sort by: Newest</span>
        </div>
        <FunnelSimple size={24} />
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
