import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ISave } from '@backend/models/save'
import { ReactElement } from 'react'
import Masonry from 'react-masonry-css'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'
import { isSaved, onSave } from '../../features/save'
import { useApi, useAuth } from '../../hooks/api'
import { AuthorTotalRecipe } from '../../types/api'
import { Loader } from '../Loader'
import { MainButton } from '../MainButton'
import { Recipe } from './Recipe'

export function Recipes(): ReactElement {
  const { data, error, loading } = useApi<{
    recipes: (IRecipe & { author: IAuthor })[]
    authorTotalRecipes: AuthorTotalRecipe[]
    saves: ISave[]
  }>(`/recipe/get_client_feat`)

  const [user] = useAuth()
  const navigate = useNavigate()

  return (
    <div id='list'>
      {loading ? (
        <Loader />
      ) : !data || !data.recipes.length || error ? (
        <span className='mt-30 block'>
          No recipes are available at the moment.
        </span>
      ) : (
        <Masonry
          breakpointCols={{
            default: 5,
            1850: 4,
            1550: 3,
            1100: 2,
          }}
          className='flex w-auto'
          id='list_masonry'
          columnClassName='flex items-center flex-col gap-12 mx-6'
        >
          {data.recipes.map((r) => (
            <Recipe
              fullWidth
              id={r.id!}
              author={r.author}
              image={
                r.mainImage.startsWith('/')
                  ? API_ENDPOINT + r.mainImage
                  : r.mainImage
              }
              postedOn={r.createdAt!}
              likesCount={r.likesDisplay}
              onClick={() => navigate('/recipes/read/' + r.id)}
              key={r.id}
              categories={r.categories}
              title={decodeURIComponent(r.title)}
              duration={r.duration}
              priceType={r.priceType}
              price={r.price}
              authorTotalRecipes={
                data.authorTotalRecipes.find((v) => v.id === r.author.id)
                  ?.total || 0
              }
              onSave={() =>
                onSave({
                  id: r.id,
                  user,
                })
              }
              saved={isSaved({
                id: r.id,
                user,
                data,
              })}
            />
          ))}
        </Masonry>
      )}
      {data && data.recipes.length >= 10 ? (
        <MainButton onClick={() => navigate('/recipes')}>
          See all recipes
        </MainButton>
      ) : null}
    </div>
  )
}
