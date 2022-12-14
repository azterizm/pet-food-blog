import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { animated as a, config, useSpring } from 'react-spring'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { AuthorTotalRecipe } from '../../types/api'
import { Loader } from '../Loader'
import { MainButton } from '../MainButton'
import { Recipe } from './Recipe'

export function Recipes(): ReactElement {
  const { data, error, loading } = useApi<{
    recipes: (IRecipe & { author: IAuthor })[]
    authorTotalRecipes: AuthorTotalRecipe[]
  }>(`/recipe/get_client_feat`)
  console.log('data:', data)
  const navigate = useNavigate()
  const main = useSpring({
    from: {
      y: 100,
    },
    to: { y: 0 },
    config: config.slow,
  })
  return (
    <a.div
      style={{ transform: main.y.to((r) => `translate3d(0,${r}px,0)`) }}
      className='flex flex-wrap gap-10 xl:w-300 block m-auto relative bottom-10 flex justify-center items-center'
    >
      {loading ? (
        <Loader />
      ) : !data || !data.recipes.length || error ? (
        <span className='mt-30 block'>
          No recipes are available at the moment.
        </span>
      ) : (
        data.recipes.map((r) => (
          <Recipe
            author={r.author}
            image={API_ENDPOINT + r.mainImage}
            postedOn={r.createdAt!}
            reviews={r.likes}
            onClick={() => navigate('/recipes/read/' + r.id)}
            key={r.id}
            categories={r.categories}
            title={r.title}
            duration={r.duration}
            priceType={r.priceType}
            price={r.price}
            authorTotalRecipes={
              data.authorTotalRecipes.find((v) => v.id === r.author.id)
                ?.total || 0
            }
          />
        ))
      )}
      {data && data.recipes.length >= 10 ? (
        <MainButton onClick={() => navigate('/recipes')}>
          See all recipes
        </MainButton>
      ) : null}
    </a.div>
  )
}
