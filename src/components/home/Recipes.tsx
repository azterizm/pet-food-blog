import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ISave } from '@backend/models/save'
import { ReactElement } from 'react'
import Masonry from 'react-masonry-css'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'
import { isSavedRecipe, onSaveRecipe } from '../../features/save'
import { useAuth } from '../../hooks/api'
import { Loader } from '../Loader'
import { Recipe } from './Recipe'

interface Props {
  data: {
    recipes: (IRecipe & {
      author: IAuthor
      saves: ISave[]
      userLiked: boolean
    })[]
    total: number
  } | null
  error: string | null
  loading: boolean
}
export function Recipes(props: Props): ReactElement {
  const [user] = useAuth()
  const navigate = useNavigate()

  return (
    <div id='list'>
      {props.loading && !props.data?.recipes.length
        ? <Loader />
        : !props.data || !props.data.recipes.length || props.error
        ? (
          <span className='mt-30 block'>
            No recipes are available at the moment.
          </span>
        )
        : (
          <Masonry
            breakpointCols={{
              default: 5,
              1550: 4,
              1100: 3,
              768: 2,
            }}
            className='flex w-auto'
            id='list_masonry'
            columnClassName='flex items-center flex-col gap-6 mx-6'
          >
            {props.data.recipes.map((r) => (
              <Recipe
                previewMode
                intro={r.intro}
                mainImage={r.mainImage}
                tags={r.tags}
                fullWidth
                id={r.id!}
                author={r.author}
                image={r.mainImage.startsWith('/')
                  ? API_ENDPOINT + r.mainImage
                  : r.mainImage}
                postedOn={r.createdAt!}
                likesCount={r.likesDisplay}
                onClick={() => navigate('/recipes/read/' + r.id + '/' + r.slug)}
                key={r.id}
                categories={r.categories}
                title={decodeURIComponent(r.title)}
                duration={r.duration}
                priceType={r.priceType}
                price={r.price}
                userLiked={r.userLiked}
                authorTotalRecipes={0}
                onSave={() =>
                  onSaveRecipe({
                    id: r.id,
                    user,
                  })}
                saved={isSavedRecipe({
                  id: r.id,
                  user,
                  data: r,
                })}
              />
            ))}
          </Masonry>
        )}
      {props.loading ? <Loader /> : null}
    </div>
  )
}
