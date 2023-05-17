import { IAuthor } from '@backend/models/author'
import { ISocialMedia } from '@backend/models/socialMedia'
import type { ReactElement } from 'react'
import { AuthorListItem } from '../components/AuthorListItem'
import { Loader } from '../components/Loader'
import { useApi } from '../hooks/api'

export function Subscribed(): ReactElement {
  const { data, error, loading } = useApi<
    (IAuthor & {
      socialMedia: ISocialMedia[]
      subscribeDate?: string | Date
    })[]
  >('/user/subscribed')
  return (
    <div className='my-5'>
      <span className='uppercase c-primary text-xl font-bold'>
        Subscribed authors
      </span>
      <div className=''>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className='m-0 text-start'>{error}</p>
        ) : !data || !data.length ? (
          <span>No authors available.</span>
        ) : (
          <div className='flex flex-wrap gap-5 justify-start'>
            {data.map((r) => (
              <AuthorListItem
                subscribed
                subscribeDate={r.subscribeDate}
                data={r}
                key={r.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
