import { Dog, Eyeglasses, PencilCircle } from 'phosphor-react'
import type { ReactElement } from 'react'
import { API_ENDPOINT, CREATOR_ENDPOINT } from '../constants/api'
import { AuthType } from '../types/auth'
import { Chef } from './icons/Chef'

interface Props {
  type: AuthType
  onChange: (arg: AuthType) => void
  containerClass?: string
}

export function AuthTypeSelector({
  containerClass,
  type,
  onChange,
}: Props): ReactElement {
  return (
    <div className={'flex justify-between items-center ' + containerClass}>
      <div
        onClick={() => onChange('user')}
        className={
          'rounded-lg flex flex-col items-center gap-2 cursor-pointer p-5 ' +
          (type === 'user' ? 'bg-primary c-white' : 'bg-white c-primary')
        }
      >
        {type === 'user' ? (
          <span className='uppercase text-sm font-bold'>selected</span>
        ) : null}
        <Dog size={36} />
        <span className='font-medium text-sm'>Pet Parent</span>
      </div>
      <div
        onClick={() => onChange('author')}
        className={
          'rounded-lg flex flex-col items-center gap-2 cursor-pointer p-5 px-10 ' +
          (type === 'author' ? 'bg-primary c-white' : 'bg-white c-primary')
        }
      >
        {type === 'author' ? (
          <span className='uppercase text-sm font-bold'>selected</span>
        ) : null}
        <Chef width={36} height={36} selected={type === 'author'} />
        <span className='font-medium text-sm'>Chef</span>
      </div>
    </div>
  )
}
