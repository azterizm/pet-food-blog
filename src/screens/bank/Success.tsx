import { Bank } from 'phosphor-react'
import { ReactElement } from 'react'
import { Link } from 'react-router-dom'

export function SuccessBank(): ReactElement {
  return (
    <div className='bg-white p-6  md:mx-auto min-h-screen flex items-center pt-36 flex-col'>
      <Bank className='text-green-600 w-20 h-20 mx-auto my-6' />

      <div className='text-center'>
        <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>
          Bank successfully linked
        </h3>
        <p className='text-gray-600 my-2 max-w-30rem'>
          Now you can make transfers to your account and create straight payouts
          to your personal bank account!
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
