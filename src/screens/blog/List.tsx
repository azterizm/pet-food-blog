import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IPost } from '@backend/models/post'
import { useHookstate } from '@hookstate/core'
import { ReactElement } from 'react'
import Title from '../../components/home/Title'
import { PAGE_OFFSET } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { SortBy } from '../../types/ui'

export function List(): ReactElement {
  const filter = useHookstate<
    { sortBy: SortBy; tag: string | null; page: number }
  >({
    sortBy: SortBy.Newest,
    tag: null,
    page: 0,
  })

  const { data, loading, error } = useApi<{
    count: number
    rows: (IPost & { author: IAuthor; likes: ILike[] })[]
  }>('/blog/get_posts/' + filter.page.value * PAGE_OFFSET, {}, [filter])

  const { data: tags, loading: loadingTags } = useApi<{ data: string[] }>(
    '/blog/get_client_tags',
  )

  return (
    <div className='relative'>
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
    </div>
  )
}
