import type { ReactElement } from 'react'

export function NotFound(): ReactElement {
  return (
    <div className='min-h-70vh flex flex-col items-center'>
      <div className='mb-10 text-center'>
        <h1 className='uppercase'>404 </h1>
        <span className='uppercase font-bold text-xl'>not found</span>
      </div>
      <span className='font-medium'>There's nothing here...</span>
      <button
        className='bg-primary c-white px-5 py-3 rounded-lg text-lg mt-10 border-none'
        onClick={() => (window.location.href = '/')}
      >
        Go home
      </button>
    </div>
  )
}
