import type { ReactElement } from 'react'
import { useApi } from '../hooks/api'
import { IFreeItem } from '@backend/models/freeItem'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'

export function FreeStuff(): ReactElement {
  const { data, loading } = useApi<IFreeItem[]>('/free_items/all')
  console.log('data:', data)
  if (loading) return <Loader />
  return (
    <div>
      {!data || !data.length ? (
        <div className='flex-center'>
          <span>No items are available yet.</span>
        </div>
      ) : (
        <div className='flex flex-wrap justify-center items-center gap-5'>
          {data.map((item) => (
            <article
              key={item.id}
              className='overflow-hidden rounded-lg shadow transition hover:shadow-lg min-w-80'
            >
              <img
                alt='Thumbnail'
                src={API_ENDPOINT + '/free_items/thumbnail/' + item.id}
                className='h-56 w-full object-cover'
              />
              <div className='bg-white p-4 sm:p-6'>
                <time
                  dateTime='2022-10-10'
                  className='block text-xs text-gray-500'
                >
                  {new Date(item.createdAt!).toDateString()}
                </time>
                <h3 className='mt-0.5 text-lg text-gray-900 no-underline'>
                  {item.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3'>
                  {item.description}
                </p>
                <a
                  href={API_ENDPOINT + '/free_items/download/' + item.id}
                  className='rounded-lg w-full py-5 bg-primary c-white font-bold block text-center no-underline'
                >
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
