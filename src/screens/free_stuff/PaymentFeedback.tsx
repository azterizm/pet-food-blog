import { IFreeItem } from '@backend/models/freeItem'
import classNames from 'classnames'
import { CheckCircle, XCircle } from 'phosphor-react'
import { ReactElement } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi, useAuth } from '../../hooks/api'

export default function FreeStuffPaymentFeedback(): ReactElement {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('status') === 'success'
  const [user] = useAuth()
  const { data, loading, error } = useApi<
    IFreeItem & {
      author: { id: number; name: string }
      purchased: boolean
      file: null | string
    }
  >(
    '/free_items/access/' + searchParams.get('itemId'),
  )
  function onDownload() {
    if (!data?.purchased || !success) return
    let link = document.createElement('a')
    link.download = data.file
    link.href = API_ENDPOINT + '/free_items/download/' + data.id
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='py-32 w-screen flex flex-col justify-center items-center -translate-x-8'>
      {success
        ? <CheckCircle className='text-green-600 text-5xl' />
        : <XCircle className='text-red-600 text-5xl' />}
      <h1
        className={classNames(
          success ? 'text-green-600' : 'text-red-600',
          'font-bold',
        )}
      >
        Payment {success ? 'successful' : 'failed'}
      </h1>
      {loading
        ? <Loader />
        : !data || error
        ? (
          <div className='flex flex-col justify-center items-center'>
            <p className='mt-4'>Item not found.</p>
            <Link
              className={`rounded-full w-64 py-5 mt-4 tracking-wide bg-button c-white font-bold block text-center no-underline border-none text-lg disabled:opacity-50`}
              to='/free'
            >
              See more printables
            </Link>
          </div>
        )
        : (
          <div className='mt-4 flex flex-col justify-center items-center max-w-xl'>
            <img
              className='w-140 object-cover object-center mx-auto block rounded-lg'
              src={API_ENDPOINT + '/free_items/thumbnail/' + data.id}
              alt=''
            />
            <h3 className='mt-4 text-xl text-gray-900 m-0'>
              {decodeURIComponent(data.title)}
            </h3>
            <p className='text-sm m-0'>
              by{' '}
              <Link
                to={'/authors/' + data.authorId}
                className='no-underline'
              >
                {data.author?.name}
              </Link>
            </p>
            {success
              ? (
                <div>
                  <button
                    onClick={onDownload}
                    className={`rounded-full w-full py-5 mt-4 tracking-wide bg-button c-white font-bold block text-center no-underline border-none text-lg disabled:opacity-50`}
                    disabled={!data.purchased}
                  >
                    Download
                  </button>
                  {user && data.purchased
                    ? (
                      <p>
                        Your purchase will be available in{' '}
                        <Link to='/free' className='underline'>
                          printables
                        </Link>{' '}
                        page.
                      </p>
                    )
                    : data.purchased
                    ? (
                      <p>
                        You chose to purchase this item as a guest. You can
                        create an{' '}
                        <Link to='/login' className='underline'>account</Link>
                        {' '}
                        to access your purchases forever from{' '}
                        <Link to='/free' className='underline'>
                          printables
                        </Link>{' '}
                        page. For now, you can download your purchase from the
                        link above (valid for 1 day).
                      </p>
                    )
                    : (
                      <p>
                        Purchase not found. You can try again from{' '}
                        <Link to='/free' className='underline'>
                          printables
                        </Link>.
                        {' '}
                      </p>
                    )}
                </div>
              )
              : (
                <Link
                  className={`rounded-full w-full py-5 mt-4 tracking-wide bg-button c-white font-bold block text-center no-underline border-none text-lg disabled:opacity-50`}
                  to='/free'
                >
                  See more printables like this
                </Link>
              )}
          </div>
        )}
    </div>
  )
}
