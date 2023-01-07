import { IAuthor } from '@backend/models/author'
import { ISocialMedia } from '@backend/models/socialMedia'
import type { ReactElement } from 'react'
import { AuthorListItem } from '../components/AuthorListItem'
import { Loader } from '../components/Loader'
import { useApi } from '../hooks/api'

export function Subscribed(): ReactElement {
  const { data, error, loading } =
    useApi<(IAuthor & { socialMedia: ISocialMedia[] })[]>('/user/subscribed')
  console.log('data:', data)
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
          data.map((r) => <AuthorListItem data={r} key={r.id} />)
        )}
      </div>
    </div>
  )
}
