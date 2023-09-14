import { ArticleStatus } from '@backend/models'
import classNames from 'classnames'
import type { ReactElement } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { Portal } from 'react-portal'

export interface UnpublishedBannerProps {
  status: ArticleStatus
  contentType?: string
  containerClass?: string
}

export default function UnpublishedBanner(
  props: UnpublishedBannerProps,
): ReactElement {
  const messageContentType = props.contentType?.toLowerCase() || 'recipe'
  return (
    <Portal>
      <div
        className={classNames(
          'fixed bottom-5 lg:bottom-25 right-5 p-5 rounded-lg bg-blue-700 text-white max-w-[24rem]',
          props.containerClass,
        )}
      >
        <div className='flex items-center gap-4'>
          <FaExclamationTriangle size={24} />
          <p className='m-0 text-lg font-bold'>
            {props.contentType || 'Recipe'} cannot be seen by public yet
          </p>
        </div>
        <p className='m-0 mt-4'>
          {props.status === 'pending'
            ? `Your ${messageContentType} is being reviewed by So Pawlicious Team. Please be patient.`
            : props.status === 'scheduled'
            ? `The ${messageContentType} is scheduled to be posted later.`
            : `This ${messageContentType} is not completed and saved temporarily.`}
        </p>
      </div>
    </Portal>
  )
}
