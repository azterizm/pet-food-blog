import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { Article, Check, Circle, Heart, Money } from 'phosphor-react'
import { ReactElement, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hero } from '../../components/home/Hero'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/recipe_read.css'
import { getUser } from '../../features/auth'
import { useApi } from '../../hooks/api'
import { showDuration, showPluralS } from '../../util/ui'

//TODO test images in directions
export function RecipeRead(): ReactElement {
  const { id } = useParams() as { id: string }
  const { data, error, loading } = useApi<IRecipe & { author: IAuthor }>(
    '/recipe/read/' + id
  )
  console.log('data:', data)
  const navigate = useNavigate()
  const [checkedIng, setCheckedIng] = useState<number[]>([])

  useEffect(() => {
    if (!id) window.location.href = '/'
  }, [])

  async function likePost() {
    const user = await getUser()
    if (!user) return navigate('/login')
  }

  return (
    <div className='min-h-100vh'>
      {loading ? (
        <Loader />
      ) : error || !data ? (
        <div className='absolute-center flex flex-col justify-center items-center gap-5'>
          <span className='c-red text-lg'>Error occured: {error}</span>
          <span>Please try again later</span>
          <button
            onClick={() => navigate('/')}
            className='rounded-lg px-5 py-3 bg-blue-600 c-white border-none font-bold'
          >
            Go home
          </button>
        </div>
      ) : (
        <div id='recipe_read'>
          <Hero
            authors={[data.author]}
            title={data.title}
            image={API_ENDPOINT + data.mainImage}
            categories={data.categories}
            publishedOn={data.createdAt || new Date()}
          />
          <div className='flex justify-center items-center gap-2 uppercase font-medium text-primary text-xs mt-5'>
            <span>{showDuration(data.duration)}</span>
            <span>•</span>
            <span>
              {data.servings}
              {' serve'}
              {showPluralS(data.servings)}
            </span>
            <span>•</span>
            <span>{data.lang}</span>
          </div>
          <div className='max-w-200 mx-auto block mt-10'>
            <div
              id='content'
              dangerouslySetInnerHTML={{ __html: data.intro }}
            ></div>
            <div className='flex flex-col gap-5 mt-10'>
              <div>
                <span className='text-xl font-bold my-5 block'>
                  Ingredients
                </span>
                {data.ingredients.map((r, i) => (
                  <div className='flex items-center gap-2' key={i}>
                    <span
                      className={
                        'cursor-pointer border-2 border-element border-r-0 w-10 h-10 flex items-center justify-center ' +
                        (i + 1 === data.ingredients.length ? '' : 'border-b-0')
                      }
                      onClick={() =>
                        setCheckedIng((e) =>
                          e.includes(i) ? e.filter((r) => r !== i) : [...e, i]
                        )
                      }
                    >
                      {checkedIng.includes(i) ? (
                        <Check size={16} />
                      ) : (
                        <Circle size={16} />
                      )}
                    </span>
                    <span
                      className={`border-2 border-element ml--2 w-full border-r-0 pl-5 h-10 flex items-center justify-start ${
                        i + 1 === data.ingredients.length ? '' : 'border-b-0'
                      } ${checkedIng.includes(i) ? 'line-through' : ''}`}
                    >
                      {r}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <span className='text-xl font-bold my-5 block'>Directions</span>
                <div
                  className='flex flex-col items-start gap-5 relative'
                  id='instructions'
                >
                  {data.instructions.map(([images, content], i) => (
                    <div key={i}>
                      <div className='flex items-center gap-5 ml-10 mb-5'>
                        {images.map((image, i) => (
                          <img
                            className='max-w-50 max-w-50 object-cover rounded-lg'
                            src={API_ENDPOINT + image}
                            alt=''
                            key={'i_' + i}
                          />
                        ))}
                      </div>
                      <div className='flex items-center gap-5'>
                        <span className='z-5 bg-primary c-white min-w-10 min-h-10 flex-center rounded-full'>
                          {i + 1}.
                        </span>
                        <span>{content}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className='text-xl font-bold mt-5 mb-2 block'>Notes</div>
                <div className='flex flex-col gap-2'>
                  {data.notes.map((note, i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <span className='font-black'>&bull;</span>
                      <span key={i}>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-5'>
                <div
                  onClick={likePost}
                  className='flex items-center gap-2 font-medium text-md bg-gray-300 px-5 py-3 rounded-lg'
                >
                  <Heart size={20} />
                  <span>
                    {data.likes} Like{showPluralS(data.likes)}
                  </span>
                </div>
                <div className='flex items-center gap-2 font-medium text-md bg-gray-300 px-5 py-3 rounded-lg'>
                  <Article size={20} />
                  <span>Print</span>
                </div>
                <div className='flex items-center gap-2 font-medium text-md bg-gray-300 px-5 py-3 rounded-lg'>
                  <Money size={20} />
                  <span>Donate</span>
                </div>
              </div>
              <div>
                <div className='text-lg font-bold mt-5 mb-2 block'>Tags</div>
                {!data.tags.length ? (
                  <span>No tags.</span>
                ) : (
                  data.tags.map((tag, i) => (
                    <span key={i} className='block mr-1'>
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
