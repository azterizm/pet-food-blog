import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { animated as a, config, useSpring } from 'react-spring'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { Loader } from '../Loader'
import { MainButton } from '../MainButton'
import { Recipe } from './Recipe'

export function Recipes(): ReactElement {
  const { data, error, loading } = useApi<(IRecipe & { author: IAuthor })[]>(
    `/recipe/get_client_feat`
  )
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
      ) : !data || !data.length || error ? (
        <span className='mt-30 block'>
          No recipes are available at the moment.
        </span>
      ) : (
        data.map((r) => (
          <Recipe
            authors={[r.author]}
            duration={r.duration}
            image={API_ENDPOINT + r.mainImage}
            postedOn={r.createdAt!}
            reviews={r.likes}
            title={r.title}
            onClick={() => navigate('/recipes/read/' + r.id)}
            priceType={r.priceType}
            key={r.id}
          />
        ))
      )}
      {data && data.length >= 10 ? (
        <MainButton onClick={() => navigate('/recipes')}>
          See all recipes
        </MainButton>
      ) : null}
    </a.div>
  )
}
