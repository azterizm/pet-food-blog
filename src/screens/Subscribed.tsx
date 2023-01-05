import { IAuthor } from '@backend/models/author'
import { ISocialMedia } from '@backend/models/socialMedia'
import type { ReactElement } from 'react'
import { AuthorListItem } from '../components/AuthorListItem'
import { GoBack } from '../components/GoBack'
import { Loader } from '../components/Loader'
import { useApi } from '../hooks/api'

export function Subscribed(): ReactElement {
  const { data, error, loading } =
    useApi<(IAuthor & { socialMedia: ISocialMedia[] })[]>('/user/subscribed')
  console.log('data:', data)
  return (
    <div>
      <GoBack />
      <div className='mt-10 min-h-100vh flex flex-wrap gap-5 justify-center'>
        {loading ? (
          <Loader />
        ) : error ? (
          <span>{error}</span>
        ) : !data || !data.length ? (
          <span>No authors available.</span>
        ) : (
          data.map((r) => <AuthorListItem data={r} key={r.id} />)
        )}
      </div>
    </div>
  )
}
