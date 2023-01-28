import { Article, Heart } from 'phosphor-react'
import { showCompactNumber, showPluralS } from '../../util/ui'

interface Props {
  onLike: () => void
  onPrint?: () => void
  liked: boolean
  likes: number
  readType?: string
}
export const LikeSection = (props: Props) => (
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
    </div>
  </div>
)
