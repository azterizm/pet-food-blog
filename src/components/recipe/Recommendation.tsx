import moment from 'moment'
import type { ReactElement } from 'react'

export interface RecommendationProps {
  title: string
  items: { image: string; title: string; createdAt: string | Date }[]
}

export function Recommendation(props: RecommendationProps): ReactElement {
  return (
    <div className='max-w-80'>
      <div className='flex items-center'>
        <div className='h-2px flex-1 bg-neutral-300 mr-2' />
        <span className='block text-center uppercase text-xs font-medium tracking-[0.25rem] bg-white'>
          {props.title}
        </span>
        <div className='h-2px flex-1 bg-neutral-300 ml-2' />
      </div>
      <div className='p-5 flex flex-col items-center gap-5 border-l-2px border-r-2px border-b-2px border-neutral-300 my--2'>
        {props.items.map((r) => (
          <div className='flex items-center justify-between gap-5'>
            <img
              className='w-25 h-25 object-cover'
              src={r.image}
              alt='Profile image'
            />
            <div className='flex items-start flex-col'>
              <span className='font-bold text-lg'>{r.title}</span>
              <span className='font-medium'>
                {moment(r.createdAt).fromNow()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
