import { CheckCircle } from 'phosphor-react'
import { ReactElement, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/api'

export function SuccessPayment(): ReactElement {
  const [query] = useSearchParams()
  const [user, changeUser] = useAuth()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const amountStr = query.get('amount')
    if (user && amountStr && !loaded) {
      changeUser({ ...user, deposit: user.deposit + parseInt(amountStr) })
      setLoaded(true)
    }
  }, [user])
  return (
    <div className='bg-white p-6  md:mx-auto min-h-screen flex items-center justify-center flex-col'>
      <CheckCircle className='text-green-600 w-20 h-20 mx-auto my-6' />

      <div className='text-center'>
        <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>
          Deposit complete!
        </h3>
        <p className='text-gray-600 my-2'>
          Now you can purchase recipes and subscribe to authors.
        </p>
        <p> Have a great day!</p>
        <div className='py-10 text-center'>
          <Link
            to='/'
            className='no-underline px-12 bg-primary rounded-full hover:bg-secondary text-white font-semibold py-3'
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
