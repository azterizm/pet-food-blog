import { IFreeItem } from '@backend/models/freeItem'
import { useHookstate } from '@hookstate/core'
import { ReactElement, useEffect, useState } from 'react'
import { Portal } from 'react-portal'
import { useNavigate } from 'react-router-dom'
import { categories } from '../../../src/constants/info'
import FreeStuffItem from '../components/free_stuff/FreeStuffItem'
import List from '../components/home/List'
import PageIndicator from '../components/home/PageIndicator'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { useApi, useAuth } from '../hooks/api'
import { useFade } from '../hooks/state'
import { categoryLabel } from '../types/api'

export function FreeStuff(): ReactElement {
  const [paying, setPaying] = useState(0)
  const [payLoading, setPayLoading] = useState(false)

  const [user, _, __, userLoading] = useAuth()
  const navigate = useNavigate()
  const fade = useFade()

  const selectedCategory = useHookstate('')

  const { refetch, data, loading } = useApi<
  {

  items: 
    (IFreeItem & {
      author?: { name: string; id: number }
      purchased: boolean
      file: string
    })[]
    contributionPercentage: number
  }
  >(`/free_items/all/${selectedCategory.value}`, {}, [selectedCategory])

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
      <div className='text-center max-w-5xl mx-auto'>
        <h1>
          <span className='text-button'>Support dog shelters worldwide</span>
          {' '}
          by downloading free printables or making a purchase.
        </h1>
        <p>
          "Every purchase will contribute 50% of its proceeds to animal
          shelters."
        </p>
      </div>
      <List
        data={categories.map((r) => ({
          key: r,
          value: categoryLabel[r as keyof typeof categoryLabel],
        }))}
        value={selectedCategory.value}
        onChange={(value) => selectedCategory.set(value || '')}
      />

      <PageIndicator active={2} />
      {!data || !data.items.length
        ? (
          <div className='flex-center mt-8'>
            <span>No items are available yet for this category.</span>
          </div>
        )
        : (
          <div className='flex flex-wrap mt-8 justify-center items-center gap-5'>
            {data.items.map((item) => (
              <FreeStuffItem
                contributionPercentage={data.contributionPercentage}
                data={item}
                onClick={() => (
                  item.purchased || item.price <= 0
                    ? onDownload(item.id!, item.file)
                    : setPaying(item.id!)
                )}
              />
            ))}

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
