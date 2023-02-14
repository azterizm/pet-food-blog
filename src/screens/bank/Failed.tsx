import { SmileyBlank } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'

export function FailedBank(): ReactElement {
  return (
    <div className='bg-white p-6  md:mx-auto min-h-screen flex items-center pt-36 flex-col'>
      <SmileyBlank className='text-red-600 w-20 h-20 mx-auto my-6' />

      <div className='text-center'>
        <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>
          Bank could not be linked.
        </h3>
        <p className='text-gray-600 my-2 max-w-30rem'>
          It seems you have left the process in the middle. That's okay. You can
          continue later at anytime from creator panel.
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
