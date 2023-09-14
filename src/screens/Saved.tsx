import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IPost } from '@backend/models/post'
import { IRecipe } from '@backend/models/recipe'
import { ISave } from '@backend/models/save'
import { ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthorListItem from '../components/blog/ListItem'
import PageIndicator from '../components/home/PageIndicator'
import { Recipe } from '../components/home/Recipe'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { handleLike } from '../features/like'
import { isSavedRecipe, onSaveRecipe } from '../features/save'
import { useApi, useAuth } from '../hooks/api'

export function Saved(): ReactElement {
  const [user, _, __, loadingUser] = useAuth()

  const { data, error, loading } = useApi<
    ApiResponse[]
  >('/save/list', undefined, [user])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !loadingUser) {
      navigate('/login', { state: { redirect: '/saved' } })
    }
  }, [user, loadingUser])

  return (
    <div className='min-h-100vh w-full'>
      <h1 className='text-center'>Saved</h1>
      <PageIndicator active={3} />
      {loading
        ? <Loader />
        : !data || !data.length || error
        ? <span className='mt-30 block'>No saves yet.</span>
        : (
          <div>
            <div className='flex flex-wrap gap-5'>
              {data?.filter((r) => Boolean(r.recipe)).map((r) => (
                <Recipe
                  previewMode
                  key={r.recipe.id}
                  image={API_ENDPOINT + r.recipe.mainImage}
                  postedOn={r.recipe.createdAt!}
                  id={r.recipe.id!}
                  {...r.recipe}
                  saved={isSavedRecipe({
                    data: { saves: data },
                    user,
                    id: r.recipe.id,
                  })}
                  onSave={() => onSaveRecipe({ user, id: r.recipe.id })}
                  likesCount={r.recipe.likesDisplay}
                  userLiked={r.userLiked}
                />
              ))}
            </div>

            <div className='flex flex-wrap gap-5 mt-16'>
              {data.filter((r) => Boolean(r.post)).map((r) => (
                <AuthorListItem
                  key={r.id}
                  imgClassName='max-w-xs'
                  authorName={r.post.author.name}
                  onClick={() =>
                    navigate('/blog/' + (r.post.id?.toString() || '/'), {preventScrollReset: false})}
                  image={API_ENDPOINT + r.post.mainImage}
                  title={r.post.title}
                  onLike={() => handleLike(r.post.id!, 'blog')}
                  likes={r.post.likesCount}
                  liked={r.userLiked}
                />
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

type ApiResponse = ISave & {
  recipe: IRecipe & {
    author: IAuthor
    likes: ILike[]
  }
  post: IPost & {
    author: IAuthor
    likesCount: number
  }
  userLiked: boolean
}
