import { ReactElement, useState } from 'react'
import Paginate from 'react-paginate'
import { useApi } from '../../hooks/api'
import { IPost } from '@backend/models/post'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT, PAGE_OFFSET } from '../../constants/api'
import { IAuthor } from '@backend/models/author'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'phosphor-react'
import { showCompactNumber } from '../../util/ui'
import { ILike } from '@backend/models/like'

export function List(): ReactElement {
  const [pageNumber, setPageNumber] = useState(0)
  const navigate = useNavigate()
  const { data, loading, error } = useApi<{
    count: number
    rows: (IPost & { author: IAuthor; likes: ILike[] })[]
  }>('/blog/get_posts/' + pageNumber * PAGE_OFFSET, {}, [pageNumber])

  console.log('data:', data)

  return (
    <div>
      {loading ? (
        <Loader />
      ) : !data || !data.rows.length || error ? (
        <span>Nothing...</span>
      ) : (
        <div className='flex-wrap flex items-center justify-center gap-10'>
          {data.rows.map((post) => (
            <div
              key={post.id}
              className='w-80 h-80 c-white relative rounded-lg shadow-lg'
            >
              <div className='absolute w-full h-full top-0 left-0 z-1 pl-10 pt-5 flex items-start flex-col justify-between'>
                <div>
                  <h2
                    onClick={() => navigate(String(post.id!))}
                    className='cursor-pointer'
                  >
                    {post.title}
                  </h2>
                  <p
                    className='hover:underline cursor-pointer'
                    onClick={() => navigate('/authors/' + post.author.id)}
                  >
                    by <b>{post.author.name}</b>{' '}
                    {moment(post.createdAt).fromNow()}
                  </p>
                </div>
                <div className='flex items-center gap-2 mb-15 c-white text-2xl'>
                  <Heart />
                  <span className='text-sm'>
                    {!post.likes
                      ? 'Be first to like!'
                      : showCompactNumber(post.likes.length)}
                  </span>
                </div>
              </div>

              <img
                src={API_ENDPOINT + post.mainImage}
                alt=''
                className='absolute top-0 left-0 w-full h-full object-cover rounded-lg brightness-70 cursor-pointer'
                onClick={() => navigate(String(post.id!))}
              />
            </div>
          ))}
          {data.count > data.rows.length ? (
            <Paginate
              pageCount={Math.floor(data.count / PAGE_OFFSET)}
              breakLabel='...'
              containerClassName='list_nav flex justify-center items-center gap-10 list-none'
              onPageChange={(e) => setPageNumber(e.selected)}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}
