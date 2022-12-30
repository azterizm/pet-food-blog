import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { PriceType } from '../types/ui'

interface Props {
  loggedIn: boolean
  onSubscribe: () => void
  onPurchase: () => void
  price: number
  priceType: PriceType
  subscribeCost: number
}
export function NotPaidDialog(props: Props): ReactElement {
  const navigate = useNavigate()
  return (
    <div className='relative bg-gradient-to-b from-indigo-400 to-indigo-600 p-10 rounded-8 c-white text-center translate-y--5 mb-50vh'>
      <div className='flex-center flex-col z-2 gap-5'>
        <p className='text-xl font-bold m-0'>
          {props.priceType === 'subscribe'
            ? 'You must subscribe the chef to access this recipe'
            : 'This recipe must be paid to be accessed'}
        </p>
        {props.loggedIn ? (
          <>
            {props.priceType === 'paid' ? (
              <p>
                You can only purchase this recipe and read it anytime you want.
              </p>
            ) : props.priceType === 'subscribe' ? (
              <p>
                You must subscribe the chef of this recipe to get access to this
                recipe, the other recipes, and also the future recipes.
              </p>
            ) : null}
            <button
              onClick={
                props.priceType === 'paid'
                  ? props.onPurchase
                  : props.onSubscribe
              }
              className='bg-white border-none p-5 rounded-full font-bold tracking-0.5 pr-4 text-md'
            >
              {props.priceType === 'paid'
                ? `Purchase for ${props.price}$`
                : `Subscribe for ${props.subscribeCost}$/month`}
            </button>
          </>
        ) : (
          <>
            <p>
              Sign up now and deposit your account to unlock this recipe and get
              access to the full collection of recipes for paying subscribers
              only.
            </p>
            <button
              className='bg-white border-none p-5 rounded-full font-bold tracking-0.5 pr-4 text-md'
              onClick={() => navigate('/register')}
            >
              Sign up now
            </button>
            <button
              className='font-bold bg-transparent border-none c-white'
              onClick={() => navigate('/login')}
            >
              <span className='!font-medium'>Already have an account?</span>{' '}
              Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
