import { IAuthor } from '@backend/models/author'
import { ISocialMedia } from '@backend/models/socialMedia'
import { capitalize } from 'lodash'
import { ReactElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RenderIconByName } from '../../components/icons/RenderIconByName'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'

const OFFSET = 20

export function AuthorList(): ReactElement {
  const [page, setPage] = useState(0)
  const { data, error, loading } = useApi<{
    data: (IAuthor & { socialMedia: ISocialMedia[] })[]
    total: number
  }>('/author/main_list/new/' + page * OFFSET + '/' + OFFSET)
  console.log('data:', data)
  const navigate = useNavigate()

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
            <div
              className='flex flex-col w-80 cursor-pointer'
              onClick={() => navigate(String(r.id))}
              key={r.id}
            >
              <img
                className='object-cover w-80 object-cover rounded-t-lg'
                src={API_ENDPOINT + '/auth/profile/' + r.id}
                alt='profile'
              />
              <div className='px-5 py-3 bg-neutral-300 rounded-b-lg'>
                <span className='text-2xl font-bold mt-5 block'>{r.name}</span>
                <div className='flex items-center gap-5 my-5'>
                  {r.socialMedia.length
                    ? r.socialMedia.map((s) => (
                        <RenderIconByName
                          name={capitalize(s.name) + 'Logo'}
                          size={20}
                          key={s.id}
                        />
                      ))
                    : null}
                </div>
                <span className='mb-10 block'>
                  {!r.bio
                    ? null
                    : r.bio.length > 150
                    ? r.bio.slice(0, 147) + '...'
                    : r.bio}
                </span>
              </div>
            </div>
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
