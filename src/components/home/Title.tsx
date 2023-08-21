import classNames from 'classnames'
import { useState } from 'react'
import { SortBy } from '../../types/ui'

interface Props{
  sortBy: SortBy
  onChangeSortBy: (arg: SortBy) => void
}
export default function Title(props:Props) {
  const [openSortMenu, setOpenSortMenu] = useState(false)
  return (
      <div className='relative' id='list_title'>
        <h1 className='m-0 text-center [&>p]:m-0'>
          <p id='main_label' className='select-none'>Discover</p>
          <p className='pt-8 md:pt-0 text-button select-none !-mt-[2rem]'>
            Yummy Recipes
          </p>
        </h1>
        <div className='absolute top-0 left-0'>
          <button
            onClick={() => setOpenSortMenu((e) => !e)}
            className='border-none text-lg hover:bg-element rounded-lg bg-white c-black'
          >
            Sort by:{' '}
            <span className='font-bold'>
              {(Object.values(SortBy)[props.sortBy] as string).replace(/_/g, ' ')}
            </span>
          </button>
          <div
            className={classNames(
              'transition absolute left-0 -bottom-40 w-full bg-secondary flex justify-start item-start flex-col rounded-lg',
              openSortMenu
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5 pointer-events-none',
            )}
          >
            {Object.values(SortBy).slice(0, 3).map((r, i) => (
              <button
                onClick={() => (props.onChangeSortBy(i), setOpenSortMenu(false))}
                disabled={props.sortBy === i}
                key={i}
                className={classNames(
                  i === 0
                    ? 'rounded-tr-lg rounded-tl-lg'
                    : i === 2
                    ? 'rounded-br-lg rounded-bl-lg'
                    : 'rounded-none',
                  'py-4 border-none bg-secondary c-white',
                  props.sortBy === i ? 'pointer-events-none' : 'hover:bg-primary',
                )}
              >
                {typeof r === 'string' ? r.replace(/_/g, ' ') : r}
              </button>
            ))}
          </div>
        </div>
      </div>

  )
}

