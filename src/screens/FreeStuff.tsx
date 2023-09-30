import { ReactElement, useEffect, useState } from 'react'
import { useApi, useAuth } from '../hooks/api'
import { IFreeItem } from '@backend/models/freeItem'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { Link, useNavigate } from 'react-router-dom'
import { Portal } from 'react-portal'
import { useFade } from '../hooks/state'
import PageIndicator from '../components/home/PageIndicator'

export function FreeStuff(): ReactElement {
  const [paying, setPaying] = useState(0)
  const [payLoading, setPayLoading] = useState(false)

  const [user, _, __, userLoading] = useAuth()
  const navigate = useNavigate()
  const fade = useFade()

  const { refetch, data, loading } = useApi<
    (IFreeItem & {
      author?: { name: string; id: number }
      purchased: boolean
      file: string
    })[]
  >('/free_items/all')

  async function onPayItem() {
    setPayLoading(true)

    const data = await fetch(API_ENDPOINT + '/free_items/pay/' + paying, {
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())

    if (data.error) alert(data.info)
    else refetch()

    setPayLoading(false)
    setPaying(0)
  }

  function onDownload(id: number, name: string) {
    let link = document.createElement('a')
    link.download = name
    link.href = API_ENDPOINT + '/free_items/download/' + id
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    paying ? fade.show() : fade.hide()
    return () => {
      fade.hide()
    }
  }, [paying])

  useEffect(() => {
    if (!userLoading && !user) navigate('/login')
  }, [user])

  if (loading || userLoading) return <Loader />
  return (
    <div>
      <h1 className='text-center'>Free Stuff</h1>
      <PageIndicator active={2} />
      {!data || !data.length
        ? (
          <div className='flex-center mt-8'>
            <span>No items are available yet.</span>
          </div>
        )
        : (
          <div className='flex flex-wrap mt-8 justify-center items-center gap-5'>
            {data.map((item) => {
              const canDownload = item.purchased || item.price <= 0
              return (
                <article
                  key={item.id}
                  className='overflow-hidden rounded-lg transition hover:shadow-lg min-w-80 text-center'
                >
                  <img
                    alt='Thumbnail'
                    src={API_ENDPOINT + '/free_items/thumbnail/' + item.id}
                    className='w-140 object-cover object-center mx-auto block'
                  />
                  <div className='bg-white p-4 sm:p-6'>
                    <time
                      dateTime='2022-10-10'
                      className='block text-xs text-gray-500'
                    >
                      {new Date(item.createdAt!).toDateString()}
                    </time>
                    <h3 className='mt-0.5 m-0 text-lg text-gray-900 no-underline'>
                      {decodeURIComponent(item.title)}
                    </h3>
                    {item.author
                      ? (
                        <p className='m-0 text-sm'>
                          by{' '}
                          <Link
                            to={'/authors/' + item.author.id}
                            className='no-underline'
                          >
                            {item.author?.name}
                          </Link>
                        </p>
                      )
                      : null}
                    <p className='mt-2 text-md leading-relaxed text-gray-500 line-clamp-3'>
                      {item.description}
                    </p>
                    <button
                      onClick={() =>
                        canDownload
                          ? onDownload(item.id!, item.file)
                          : setPaying(item.id!)}
                      className={`rounded-lg w-full py-5 tracking-wide bg-button c-white font-bold block text-center no-underline border-none text-lg`}
                    >
                      {canDownload ? 'Download' : 'Pay ' + item.price + '$'}
                    </button>
                  </div>
                </article>
              )
            })}

            {paying
              ? (
                <Portal>
                  <div className='fixed-center z-101 flex-center flex-col gap-5 bg-white border-2 border-primary px-10 py-5 rounded-lg z-101'>
                    <p>Are you sure, you want to pay 2$ for this item?</p>
                    <div className='flex-center'>
                      {payLoading
                        ? <p className='text-center'>Loading...</p>
                        : (
                          <>
                            <button
                              onClick={() => setPaying(0)}
                              className='bg-white text-primary px-5 py-2 text-lg border-none'
                            >
                              Cancel
                            </button>
                            <button
                              onClick={onPayItem}
                              className='bg-button text-white px-5 py-2 rounded-full text-lg border-none'
                            >
                              Continue
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </Portal>
              )
              : null}
          </div>
        )}
    </div>
  )
}
