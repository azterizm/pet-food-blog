import { IAuthor } from '@backend/models/author'
import { AuthorProfileImage } from '../AuthorProfileImage'
import { Sharing } from './Sharing'

interface Props {
  author: IAuthor
  recipeId: number | string
}

export const HelpSection = (props: Props) => (
  <div>
    <h3 className='text-xl font-bold bg-neutral-200 ml--10 pl-10 py-3 w-full'>
      You can help dogs by sharing
    </h3>
    <div className='flex items-center flex-col lg:flex-row lg:justify-between'>
      <div className='flex items-center gap-2 justify-center'>
        <AuthorProfileImage
          author={props.author}
          className='w-20 h-20 rounded-full object-cover'
        />
        <div className='flex items-start flex-col ml-5'>
          <span className='text-lg font-bold'>{props.author.name}</span>
          <span>
            Chef since {new Date(props.author.createdAt!).getFullYear()}
          </span>
        </div>
      </div>
      <Sharing id={props.recipeId} />
    </div>
  </div>
)
