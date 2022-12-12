import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  loggedIn: boolean
  onSubscribe: () => void
  onPurchase: () => void
  price: number
}
export function NotPaidDialog(props: Props): ReactElement {
  const navigate = useNavigate()
  return (
    <div className='relative bg-gradient-to-b from-indigo-400 to-indigo-600 p-10 rounded-8 c-white text-center translate-y--5'>
      <div className='flex-center flex-col z-2 gap-5'>
        <p className='text-xl font-bold'>
          This recipe must be paid or subscribed to be accessed
        </p>
        {props.loggedIn ? (
          <>
            <p>
              You can only purchase this recipe and read it anytime you want or
              subscribe author to unlock this recipe and all upcoming recipes by
              that author.
            </p>
            <button
              onClick={props.onSubscribe}
              className='bg-white border-none p-5 rounded-full font-bold tracking-0.5 pr-4 text-md'
            >
              Subscribe
            </button>
            <button
              onClick={props.onPurchase}
              className='font-bold bg-transparent border-none c-white'
            >
              Purchase this recipe only for {props.price}$
            </button>
          </>
        ) : (
          <>
            <p>
              Sign up now and deposit your account to unlock this recipe and get
              access to the full collection of recipes for paying subscribers
              only.
            </p>
            <button onClick={() => navigate('/register')}>Sign up now</button>
            <button onClick={() => navigate('/login')}>
              <span>Already have an account?</span> Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
