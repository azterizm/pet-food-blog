import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
interface Props {
  text: string
  showLabel?: boolean
  showTryAgain?: boolean
}

export function ErrorDialog({
  showTryAgain = true,
  text,
  showLabel = true,
}: Props): ReactElement {
  const navigate = useNavigate()
  return (
    <div className='absolute-center text-center flex flex-col justify-center items-center gap-5'>
      <span className='c-red text-lg'>
        {showLabel ? 'Error occured: ' + text : text}
      </span>
      {showTryAgain ? <span>Please try again later</span> : null}
      <button
        onClick={() => navigate('/')}
        className='rounded-lg px-5 py-3 bg-blue-600 c-white border-none font-bold'
      >
        Go home
      </button>
    </div>
  )
}
