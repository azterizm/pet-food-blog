import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ReactElement, useState } from 'react'
import { TwoColumnLayout } from '../components/TwoColumnLayout'
import { API_ENDPOINT } from '../constants/api'
import { useApi } from '../hooks/api'

const OFFSET = 4

export function Search(): ReactElement {
  const { data: authors, loading: authorsLoading } = useApi<{
    data: IAuthor[]
    total: number
  }>('/author/main_list/new/0/' + OFFSET)
  const { data: tags, loading: tagsLoading } = useApi<string[]>(
    '/recipe/search_tags'
  )
  const [search, setSearch] = useState('')
  const { data: searchData, loading: searchLoading } = useApi<{
    recipes: Pick<IRecipe, 'id' | 'title' | 'mainImage'>[]
    authors: Pick<IAuthor, 'id' | 'name'>[]
  }>('/search/' + search, { method: 'get', debounce: 800 }, [search])
  console.log('searchData:', searchData)

  return (
    <TwoColumnLayout image='/images/auth.avif'>
      <div className='relative'>
        <input
          type='text'
          name='search'
          id='search'
          className='large-input min-w-70'
          placeholder='Type your keywords...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchData && !searchLoading ? (
          <div className='absolute bottom--50 left-0 flex flex-col gap-2'>
            {searchData.authors.map((r) => (
              <div
                key={r.id}
                className='flex items-center gap-5 bg-white border-2 min-w-80 p-2 rounded-lg relative'
              >
                <img
                  src={API_ENDPOINT + '/auth/profile/' + r.id}
                  alt={r.name + "'s profile"}
                  className='w-20 h-20 object-cover rounded-lg'
                />
                <span>{r.name}</span>
                <span className='absolute top-2 right-2 c-gray-500 '>
                  Author
                </span>
              </div>
            ))}
            {searchData.recipes.map((r) => (
              <div
                key={r.id}
                className='flex items-center gap-5 bg-white border-2 min-w-80 p-2 rounded-lg relative'
              >
                <img
                  src={API_ENDPOINT + r.mainImage}
                  alt={r.title + ' main image'}
                  className='w-20 h-20 object-cover rounded-lg'
                />
                <span>{r.title}</span>
                <span className='absolute top-2 right-2 c-gray-500 '>
                  Recipe
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <span>
        {searchLoading ? 'Loading...' : 'Please enter atleast 3 characters'}
      </span>
      <div className='flex gap-10 items-start mt-20 flex-col justify-between'>
        {tagsLoading ? (
          <span>Loading...</span>
        ) : !tags || !tags.length ? null : (
          <div>
            <span className='text-xl font-bold mb-5 block'>
              May we suggest a tag?
            </span>
            <div className='flex items-center gap-2'>
              {tags.map((r, i) => (
                <span
                  key={i}
                  className='bg-gray-300 px-3 py-1 rounded-full uppercase text-xs font-bold'
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
        {authorsLoading ? (
          <span>Loading...</span>
        ) : !authors || !authors.data.length ? null : (
          <div>
            <span className='text-xl font-bold mb-5 block'>
              May we suggest an author?
            </span>
            <div className='flex items-center gap-2'>
              {authors.data.map((r, i) => (
                <span
                  key={i}
                  className='bg-gray-300 px-3 py-1 rounded-full uppercase text-xs font-bold'
                >
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </TwoColumnLayout>
  )
}
