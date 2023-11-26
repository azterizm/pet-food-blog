import { IFreeItem } from '@backend/models/freeItem'
import { useHookstate } from '@hookstate/core'
import { ReactElement, useEffect, useState } from 'react'
import { categories } from '../../../../src/constants/info'
import FreeStuffItem from '../../components/free_stuff/FreeStuffItem'
import List from '../../components/home/List'
import PageIndicator from '../../components/home/PageIndicator'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { useFade } from '../../hooks/state'
import { categoryLabel } from '../../types/api'
import Dialog from './Dialog'
import { handlePayment } from './payment'

export function FreeStuff(): ReactElement {
  const [paying, setPaying] = useState(0)
  const [payLoading, setPayLoading] = useState(false)
  const fade = useFade()
  const selectedCategory = useHookstate('')

  const { data, loading } = useApi<
    {
      items: (IFreeItem & {
        author?: { name: string; id: number }
        purchased: boolean
        file: string
      })[]
      contributionPercentage: number
    }
  >(`/free_items/all/${selectedCategory.value}`, {}, [selectedCategory])

  async function onPayItem() {
    setPayLoading(true)

    const data = await handlePayment(paying)
    if (data.error) {
      setPayLoading(false)
      return alert(data.info)
    }

    window.location.href = (data as any).url
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

  if (loading) return <Loader />
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
                key={item.id}
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
                <Dialog
                  onCancel={() => setPaying(0)}
                  onPayItem={onPayItem}
                  loading={payLoading}
                />
              )
              : null}
          </div>
        )}
    </div>
  )
}
