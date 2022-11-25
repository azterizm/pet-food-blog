import type { ReactElement } from 'react'
import { TwoColumnLayout } from '../components/TwoColumnLayout'

export function Search(): ReactElement {
  return (
    <TwoColumnLayout image='/images/auth.avif'>
      <input
        type='text'
        name='search'
        id='search'
        className='large-input'
        placeholder='Type your keywords...'
      />
      <span>Please enter atleast 3 characters</span>
      <div className='flex gap-10 items-start mt-20 flex-col justify-between'>
        <div>
          <span className='text-xl font-bold mb-5 block'>
            May we suggest a tag?
          </span>
          <div className='flex items-center gap-2'>
            {['story', 'people', 'education', 'journey'].map((r, i) => (
              <span
                key={i}
                className='bg-gray-300 px-3 py-1 rounded-full uppercase text-xs font-bold'
              >
                {r}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className='text-xl font-bold mb-5 block'>
            May we suggest an author?
          </span>
          <div className='flex items-center gap-2'>
            {['name1', 'name2', 'name3', 'name4'].map((r, i) => (
              <span
                key={i}
                className='bg-gray-300 px-3 py-1 rounded-full uppercase text-xs font-bold'
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TwoColumnLayout>
  )
}
