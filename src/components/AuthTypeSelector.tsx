import { Dog, Eyeglasses, PencilCircle } from 'phosphor-react'
import type { ReactElement } from 'react'
import { CREATOR_ENDPOINT } from '../constants/api'
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
          (type === 'user' ? 'bg-element' : '')
        }
      >
        <Dog size={36} />
        <span className='font-medium text-sm'>Pet Parents</span>
      </div>
      <div
        onClick={() => onChange('author')}
        className={
          'rounded-lg flex flex-col items-center gap-2 cursor-pointer p-5 ' +
          (type === 'author' ? 'bg-element' : '')
        }
      >
        <Chef width={36} height={36} />
        <span className='font-medium text-sm'>Chef</span>
      </div>
    </div>
  )
}
