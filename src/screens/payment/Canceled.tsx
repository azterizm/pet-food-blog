import { XCircle } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

export function CanceledPayment(): ReactElement {
  return (
    <div className='bg-white p-6  md:mx-auto min-h-screen flex items-center justify-center flex-col'>
      <XCircle className='text-red-600 w-20 h-20 mx-auto my-6' />

      <div className='text-center'>
        <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>
          Deposit Canceled.
        </h3>
        <p className='text-gray-600 my-2'>
          You can still continue using So Pawlicious and deposit whenever you
          like.
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
