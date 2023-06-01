import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { API_ENDPOINT } from '../../constants/api'
import { AuthorProfileImage } from '../AuthorProfileImage'
import { Sharing } from './Sharing'

interface Props {
  author: IAuthor
  recipeId: number | string
  recipe: IRecipe
}

export const HelpSection = (props: Props) => (
  <div>
    <h3 className='text-xl font-bold text-button bg-white border-y-1 border-gray-200 py-3 w-full'>
      Please, share the recipe to help other dogs
    </h3>
    <div className='flex items-start flex-col lg:flex-row lg:justify-between'>
      <div className='flex items-center gap-2 justify-center'>
        <img
          className='w-25 h-25 rounded-full object-cover'
          src={API_ENDPOINT + props.recipe.mainImage}
          alt='recipe main image'
        />

        <div className='flex items-start flex-col ml-5'>
          <span className='text-lg font-medium truncate max-w-30'>
            {decodeURIComponent(props.recipe.title)}
          </span>
        </div>
      </div>
      <Sharing id={props.recipeId} />
    </div>
  </div>
)
