import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IPost } from '@backend/models/post'
import { useHookstate } from '@hookstate/core'
import classNames from 'classnames'
import _ from 'lodash'
import { HandsClapping } from 'phosphor-react'
import { ReactElement, useEffect, useState } from 'react'
import Masonry from 'react-masonry-css'
import { useLocation, useNavigate } from 'react-router-dom'
import TagsList from '../../components/home/List'
import PageIndicator from '../../components/home/PageIndicator'
import Title from '../../components/home/Title'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/home.css'
import { handleLike } from '../../features/like'
import { useApi } from '../../hooks/api'
import { SortBy } from '../../types/ui'

interface ApiResponse {
  count: number
  rows: (IPost & { author: IAuthor; likes: ILike[]; userLiked: boolean })[]
}
export function List(): ReactElement {
  const [activePage, setActivePage] = useState(0)
  const [data, setData] = useState<ApiResponse['rows']>([])
  const location = useLocation()
  const filter = useHookstate<
    { sortBy: SortBy; tag: string | null; page: number }
  >({
    sortBy: SortBy.Newest,
    tag: null,
    page: 0,
  })
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const likes = useHookstate<{ increment: number[]; decrement: number[] }>({
    decrement: [],
    increment: [],
  })

  const { data: newData, loading, error } = useApi<ApiResponse>(
    `/blog/get_client_posts/${filter.page.value * 30}/${filter.sortBy.value}/${
      !filter.tag.value ? '' : filter.tag.value
    }`,
    {
      debounce: 800,
      onSuccess: (e: ApiResponse) => {
        setData((v) => (_.uniqBy([...v, ...e.rows], 'id')))
      },
    },
    [filter],
  )

  const { data: tags } = useApi<{ data: string[] }>(
    '/blog/get_client_tags',
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (location.state?.tag) filter.tag.set(location.state.tag)
  }, [location])

  async function onLike(id: number, i: number, userLiked: boolean) {
    await handleLike(id, 'blog')
    if (likes.increment.value.includes(i)) {
      likes.increment.set((r) => r.filter((v) => v !== i))
    } else if (likes.decrement.value.includes(i)) {
      likes.decrement.set((r) => r.filter((v) => v !== i))
    } else if (userLiked) likes.decrement.merge([i])
    else likes.increment.merge([i])
  }

  return (
    <div
      className={classNames(
        'transition duration-500 relative',
        mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10',
      )}
    >
      <Title
        headingClass='max-w-1/2 mx-auto'
        title={
          <span>
            Articles, tips <span className='c-button'>&</span> helpful resources
          </span>
        }
        sortBy={filter.sortBy.value}
        onChangeSortBy={filter.sortBy.set}
      />
      <TagsList
        data={tags?.data.map((r) => ({ key: r, value: _.capitalize(r) })) || []}
        value={filter.tag.value}
        onChange={filter.tag.set}
      />
      <PageIndicator active={1} />

      <div id='list'>
        {!data || !data.length || error
          ? (
            <span className='mt-30 block'>
              No articles are available at the moment.
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
              {data.map((r, i) => (
                <div key={i}>
                  <img
                    className={classNames(
                      'cursor-pointer object-cover rounded-lg w-full',
                    )}
                    loading='lazy'
                    src={API_ENDPOINT + r.mainImage}
                    alt={r.title + ' ' + 'image'}
                    onClick={() => navigate(r.id?.toString() || '/')}
                  />

                  <div className='relative text-center'>
                    <span className='text-2xl font-bold'>{r.title}</span>
                    <span className='block text-lg font-bold c-button'>
                      with {r.author?.name.split(' ')[0]}
                    </span>
                    <div
                      onClick={() => onLike(r.id!, i, r.userLiked)}
                      className='flex items-center justify-center mt-1'
                    >
                      <HandsClapping
                        size={24}
                        color={(r.userLiked &&
                              !likes.decrement.value.includes(i) ||
                            likes.increment.value.includes(i))
                          ? '#FEA2AD'
                          : '#000000'}
                        weight='fill'
                        className='cursor-pointer active:scale-175 transition c-black'
                      />
                      <span className='inline-block !ml-1'>
                        {Intl.NumberFormat('en-US').format(
                          (r.likes?.length ||
                            0) -
                            (likes.decrement.value.includes(i) ? 1 : 0) +
                            (likes.increment.value.includes(i) ? 1 : 0),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        {loading ? <Loader /> : null}
      </div>

      {newData && newData?.count > newData?.rows.length && (
        <div
          id='more_recipes_button'
          className='flex items-center gap-2 justify-center'
        >
          {newData?.count > (data?.length + (filter.page.value * 30)) &&
            (
              <button
                onClick={() => (filter.page.set((e) => e + 1),
                  setActivePage((e) => e === 3 ? 0 : e + 1))}
                className='px-6 py-3 rounded-full bg-white border-2 border-gray-300 font-medium c-black block'
              >
                More articles
              </button>
            )}
        </div>
      )}
    </div>
  )
}
