import { Eyeglasses, PencilCircle } from 'phosphor-react'
import type { ReactElement } from 'react'
import { CREATOR_ENDPOINT } from '../constants/api'
import { AuthType } from '../types/auth'

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
        <Eyeglasses size={36} />
        <span className='font-medium text-sm'>Reader</span>
      </div>
      <div
        onClick={() => window.location.href = CREATOR_ENDPOINT + '/#/login'}
        className={
          'rounded-lg flex flex-col items-center gap-2 cursor-pointer p-5 ' +
          (type === 'author' ? 'bg-element' : '')
        }
      >
        <PencilCircle size={36} />
        <span className='font-medium text-sm'>Author</span>
      </div>
    </div>
  )
}
