import { ReactElement, useEffect, useState } from 'react'
import { Portal } from 'react-portal'
import { API_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'
import { useFade } from '../../hooks/state'

export function Deposit(): ReactElement {
  const [user] = useAuth()
  const [showPrices, setShowPrices] = useState(false)
  const fade = useFade()
  useEffect(() => {
    if (showPrices) fade.show()
    else fade.hide()
    return () => fade.hide()
  }, [])

  return (
    <div className='flex items-start flex-col gap-1 mt-5'>
      <span className='uppercase c-primary text-xl font-bold'>Deposit</span>
      <span>${user?.deposit || '0'}</span>
      <button
        onClick={() => (setShowPrices((e) => !e), fade.show())}
        className='fill-btn'
      >
        Add deposit
      </button>
      {showPrices ? (
        <Portal>
          <div className='fixed-center bg-white p-7 z-101 rounded-lg w-80'>
            <h1 className='m-0 text-center'>Deposit</h1>
            <p>Please select your amount</p>
            <div className='flex items-center gap-2 flex-wrap justify-center'>
              {[25, 50, 100, 250, 500, 1000].map((r) => (
                <form
                  action={API_ENDPOINT + '/payment_processor/deposit/' + r}
                  method='post'
                >
                  <button className='border-0 hover:bg-neutral-400 block px-5 rounded-full bg-neutral-200'>
                    ${r}
                  </button>
                </form>
              ))}
              <button
                className='block w-full mt-5 bg-primary rounded-lg border-0 c-white text-lg py-5'
                onClick={() => (setShowPrices(false), fade.hide())}
              >
                Cancel
              </button>
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  )
}
