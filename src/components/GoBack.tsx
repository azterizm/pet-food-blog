import { CaretLeft } from 'phosphor-react'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

export interface GoBackProps {}

export function GoBack(props: GoBackProps): ReactElement {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(-1)}
      className='flex items-center cursor-pointer gap-2'
    >
      <CaretLeft size={16} />
      <span>Go back</span>
    </div>
  )
}
