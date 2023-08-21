import { useHookstate } from '@hookstate/core'
import classNames from 'classnames'
import { ArrowCircleLeft, ArrowCircleRight } from 'phosphor-react'
import { useRef } from 'react'
import { makeMouseScrollable } from '../../hooks/ui'
import { Category, categoryLabel } from '../../types/api'
import { categories } from '../../types/api'

interface Props {
  category: Category | null
  onChangeCategory: (arg: Category | null) => void
}

export default function List(props: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  const arrowStats = useHookstate({ showLeft: false, showRight: true, x: 0 })
  makeMouseScrollable(listRef)

  function onScroll() {
    if (!listRef.current) return
    const total = listRef.current.scrollWidth - listRef.current.clientWidth - 20
    const x = listRef.current.scrollLeft
    if (
      x >= total
    ) arrowStats.showRight.set(false)
    else arrowStats.showRight.set(true)
    if (x>=20) arrowStats.showLeft.set(true)
    else arrowStats.showLeft.set(false)
    arrowStats.x.set(x)
  }
  return (
    <div className='relative w-full sm:w-lg h-14 mt-5 mx-auto mb-8'>
      <div
        ref={listRef}
        className='h-full w-full flex overflow-x-scroll hide-scrollbar items-center gap-2'
        onScroll={onScroll}
      >
        <div
          className={'block px-5 py-2 rounded-full cursor-pointer select-none ' +
            (!props.category ? 'bg-primary c-white' : 'bg-gray-300 c-black')}
          onClick={() => props.onChangeCategory(null)}
          draggable='false'
        >
          All
        </div>
        {categories.map((r, i) => (
          <div
            draggable='false'
            className={'block px-5 py-2 rounded-full cursor-pointer whitespace-nowrap select-none ' +
              (props.category === r
                ? 'bg-primary c-white'
                : 'bg-neutral-300 c-black')}
            key={'category_' + i}
            onClick={() => props.onChangeCategory(r)}
          >
            {categoryLabel[r]}
          </div>
        ))}
      </div>
      <div
        className={classNames(
          'absolute top-0 right-0 h-full pointer-events-none bg-gradient-to-l from-white w-[35%] transition-opacity',
          arrowStats.showRight.value ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        className={classNames(
          'absolute top-0 left-0 h-full pointer-events-none bg-gradient-to-r from-white w-[35%] transition-opacity',
          arrowStats.showLeft.value ? 'opacity-100' : 'opacity-0',
        )}
      />
      <button
        onClick={() =>
          listRef.current?.scrollTo(
            {
              left: arrowStats.x.value - 40,
              top: 0,
              behavior: 'smooth',
            },
          )}
        className={classNames(
          'border-0 bg-transparent absolute top-1/2 left-0 -translate-y-1/2 z-50 transition-opacity',
          arrowStats.showLeft.value
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <ArrowCircleLeft size={36} className='text-black' />
      </button>
      <button
        onClick={() =>
          listRef.current?.scrollTo(
            {
              left: arrowStats.x.value + 40,
              top: 0,
              behavior: 'smooth',
            },
          )}
        className={classNames(
          'border-0 bg-transparent absolute top-1/2 right-0 -translate-y-1/2 z-50 transition-opacity',
          arrowStats.showRight.value
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <ArrowCircleRight size={36} className='text-black' />
      </button>
    </div>
  )
}
