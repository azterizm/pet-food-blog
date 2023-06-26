import classNames from 'classnames'
import { CheckCircle, XCircle } from 'phosphor-react'
import type { ReactElement } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function Donate(): ReactElement {
  const [searchParams] = useSearchParams()

  const success = searchParams.get('status') === 'success'

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      {success ? (
        <CheckCircle className='text-green-600 text-5xl' />
      ) : (
        <XCircle className='text-red-600 text-5xl' />
      )}
      <h1
        className={classNames(
          success ? 'text-green-600' : 'text-red-600',
          'font-bold',
        )}
      >
        Donation {success ? 'successful' : 'failed'}
      </h1>
      <p className='font-medium'>
        {success ? 'You have successfully donated' : 'Donation failed for'} $
        {searchParams.get('amount')} to{' '}
        <Link to={`/authors/${searchParams.get('authorId')}`}>
          {searchParams.get('authorName')}
        </Link>
        . {!success ? "It's okay! You can try again later at any time." : ''}
      </p>
      <Link
        to={`/recipes/read/${searchParams.get('recipeId')}`}
        className='px-5 py-3 my-2 rounded-full bg-primary text-white no-underline'
      >
        Continue reading the recipe
      </Link>
    </div>
  )
}
