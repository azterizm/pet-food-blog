import { IFreeItem } from '@backend/models/freeItem'
import { Link } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'
import { formatCurrency } from '../../util/ui'

interface Props {
  data: IFreeItem & {
    author?: {
      name: string
      id: number
    } | undefined
    purchased: boolean
    file: string
  }
  onClick: () => void
  contributionPercentage: number
}
export default function FreeStuffItem(props: Props) {
  const canDownload = props.data.purchased || props.data.price <= 0
  const contributionAmount = !props.data.price ? 0 : (
    props.data.price / 100 *
    props.contributionPercentage
  )
  return (
    <article
      key={props.data.id}
      className='overflow-hidden rounded-lg transition hover:shadow-lg min-w-80'
    >
      <img
        alt='Thumbnail'
        src={API_ENDPOINT + '/free_items/thumbnail/' + props.data.id}
        className='w-140 object-cover object-center mx-auto block'
      />
      <div className='bg-white mt-2'>
        <h3 className='mt-0.5 m-0 text-lg text-gray-900 no-underline'>
          {decodeURIComponent(props.data.title)}
        </h3>
        {props.data.author
          ? (
            <p className='m-0 text-sm'>
              by{' '}
              <Link
                to={'/authors/' + props.data.author.id}
                className='no-underline'
              >
                {props.data.author?.name}
              </Link>
            </p>
          )
          : null}
        {props.data.price > 0
          ? (
            <div>
              <p className='text-2xl font-bold m-0 mt-2 text-button flex items-center gap-2'>
                <span>
                  {formatCurrency(props.data.price - contributionAmount)}
                </span>
                {props.data.purchased
                  ? (
                    <span className='p-2 rounded-lg text-white text-xs bg-button uppercase'>
                      purchased
                    </span>
                  )
                  : null}
              </p>
              <p className='text-lg font-bold m-0 text-black'>
                {formatCurrency(contributionAmount)} goes to the shelter
              </p>
            </div>
          )
          : null}
        <button
          onClick={props.onClick}
          className={`rounded-full w-full py-5 mt-4 tracking-wide bg-button c-white font-bold block text-center no-underline border-none text-lg`}
        >
          {canDownload ? 'Download' : 'Purchase'}
        </button>
      </div>
    </article>
  )
}
