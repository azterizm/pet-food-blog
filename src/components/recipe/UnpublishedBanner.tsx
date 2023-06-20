import { ArticleStatus } from '@backend/models'
import type { ReactElement } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { Portal } from 'react-portal'

export interface UnpublishedBannerProps {
  status: ArticleStatus
}

export default function UnpublishedBanner(
  props: UnpublishedBannerProps,
): ReactElement {
  return (
    <Portal>
      <div className='fixed bottom-5 right-5 p-5 rounded-lg bg-blue-700 text-white max-w-[24rem]'>
        <div className='flex items-center gap-4'>
          <FaExclamationTriangle size={24} />
          <p className='m-0 text-lg font-bold'>
            Recipe cannot be seen by public yet
          </p>
        </div>
        <p className='m-0 mt-4'>
          {props.status === 'pending'
            ? 'Your recipe is being reviewed by So Pawlicious Team. Please be patient.'
            : props.status === 'scheduled'
            ? 'The recipe is scheduled to be posted later.'
            : 'This recipe is not completed and saved temporarily.'}
        </p>
      </div>
    </Portal>
  )
}
