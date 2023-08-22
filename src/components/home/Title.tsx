import classNames from 'classnames'
import { useState } from 'react'
import { SortBy } from '../../types/ui'

interface Props {
  sortBy: SortBy
  onChangeSortBy: (arg: SortBy) => void
  title: string |JSX.Element
  subTitle?: string
  containerClass?: string
  headingClass?: string
}
export default function Title(props: Props) {
  const [openSortMenu, setOpenSortMenu] = useState(false)
  return (
    <div
      className={classNames('relative', props.containerClass)}
      id='list_title'
    >
      <h1
        className={classNames(
          'm-0 text-center [&>p]:m-0 pointer-events-none',
          props.headingClass,
        )}
      >
        <p id='main_label' className='select-none'>{props.title}</p>
        {props.subTitle && (
          <p className='pt-8 md:pt-0 text-button select-none !-mt-[1rem]'>
            {props.subTitle}
          </p>
        )}
      </h1>
      <div className='absolute top-0 left-0'>
        <button
          onClick={() => setOpenSortMenu((e) => !e)}
          className='border-none text-md hover:bg-element rounded-lg bg-white c-black'
        >
          Sort by:{' '}
          <span className='font-bold'>
            {(Object.values(SortBy)[props.sortBy] as string).replace(/_/g, ' ')}
          </span>
        </button>
        <div
          className={classNames(
            'transition absolute left-0 z-10 -bottom-40 w-full bg-white border-2 outline-none border-neutral-200 flex justify-start item-start flex-col rounded-3xl',
            openSortMenu
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-5 pointer-events-none',
          )}
        >
          {Object.values(SortBy).slice(0, Object.values(SortBy).length / 2).map(
            (r, i) => (
              <button
                onClick={() => (props.onChangeSortBy(i),
                  setOpenSortMenu(false))}
                disabled={props.sortBy === i}
                key={i}
                className={classNames(
                  'border-none outline-none',
                  i === 0
                    ? 'rounded-tr-3xl rounded-tl-3xl'
                    : i === 2
                    ? 'rounded-br-3xl rounded-bl-3xl'
                    : 'rounded-none',
                  'py-4 bg-white',
                  props.sortBy === i
                    ? 'pointer-events-none c-black'
                    : 'hover:bg-neutral-300 hover:c-black c-neutral-400',
                )}
              >
                {typeof r === 'string' ? r.replace(/_/g, ' ') : r}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
