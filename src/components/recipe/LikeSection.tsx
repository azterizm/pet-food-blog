import classNames from 'classnames'
import { Article, FloppyDiskBack, Heart } from 'phosphor-react'
import { useState } from 'react'
import { showCompactNumber, showPluralS } from '../../util/ui'

interface Props {
  onLike: () => void
  onPrint?: () => void
  liked: boolean
  likes: number
  readType?: string
  saved?: boolean
  onSave?: () => void
}

export const LikeSection = (props: Props) => {
  const [newSave, setNewSave] = useState(props.saved)
  return (
    <div>
      <h3 className='text-xl font-bold bg-neutral-200 ml--10 pl-10 py-3 w-full'>
        Do you like this {props.readType || 'recipe'}?
      </h3>

      <div className='flex items-center gap-5 c-black'>
        <div
          onClick={props.onLike}
          className='flex items-center gap-2 font-medium text-md bg-neutral-200 px-5 py-3 rounded-full hover:bg-neutral-300 cursor-pointer'
        >
          <Heart
            weight={props.liked ? 'fill' : 'regular'}
            size={20}
            className={props.liked ? 'c-red' : 'c-black'}
          />
          <span className='whitespace-nowrap'>
            {showCompactNumber(props.likes)} like
            {showPluralS(props.likes)}
          </span>
        </div>

        <div
          onClick={() => (props.onPrint ? props.onPrint() : window.print())}
          className='flex items-center gap-2 font-medium text-md bg-neutral-200 px-5 py-3 rounded-full hover:bg-neutral-300 cursor-pointer'
        >
          <Article size={20} />
          <span>Print</span>
        </div>

        {props.onSave ? (
          <div
            onClick={() =>
              !props.onSave ? null : (props.onSave(), setNewSave((e) => !e))
            }
            className={classNames(
              'flex items-center gap-2 font-medium text-md px-5 py-3 rounded-full hover:bg-neutral-300 cursor-pointer',
              !newSave ? 'bg-neutral-200 c-black' : 'bg-secondary c-white'
            )}
          >
            <FloppyDiskBack size={20} />
            <span>{newSave ? 'Saved!' : 'Save'}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
