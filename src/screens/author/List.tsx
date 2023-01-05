import { IAuthor } from '@backend/models/author'
import { ISocialMedia } from '@backend/models/socialMedia'
import { ReactElement, useState } from 'react'
import { AuthorListItem } from '../../components/AuthorListItem'
import { Loader } from '../../components/Loader'
import { useApi } from '../../hooks/api'

const OFFSET = 20

export function AuthorList(): ReactElement {
  const [page, setPage] = useState(0)
  const { data, error, loading } = useApi<{
    data: (IAuthor & { socialMedia: ISocialMedia[] })[]
    total: number
  }>('/author/main_list/new/' + page * OFFSET + '/' + OFFSET)

  return (
    <div className='mt-10 min-h-100vh flex flex-wrap gap-5 justify-center'>
      {loading ? (
        <Loader />
      ) : !data || !data.data.length ? (
        <span>No authors available.</span>
      ) : error ? (
        <span>{error}</span>
      ) : (
        <>
          {data.data.map((r) => (
            <AuthorListItem data={r} key={r.id} />
          ))}

          {(page + 1) * 20 < data.total && data.total >= 20 ? (
            <div className='flex justify-center items-center gap-2'>
              {page > 0 && (
                <button onClick={() => setPage((e) => e - 1)}>Previous</button>
              )}
              {page <= 0 && (
                <button onClick={() => setPage((e) => e + 1)}>Next</button>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
