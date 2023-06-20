import type { ReactElement } from 'react'
import { Portal } from 'react-portal'

export interface PurchaseDialogProps {
  onPurchase: () => void
  onCancel: () => void
}

export default function PurchaseDialog(
  props: PurchaseDialogProps,
): ReactElement {
  return (
    <Portal>
      <div className='shadow-lg fixed-center bg-white p-8 rounded-lg text-center c-primary max-w-100'>
        <h3>Are you sure that you want to purchase this recipe?</h3>
        <div className='flex gap-5 justify-center'>
          <button
            onClick={props.onPurchase}
            className='rounded-lg font-bold px-5 py-3 c-white bg-secondary border-none'
          >
            Purchase
          </button>
          <button
            onClick={props.onCancel}
            className='bg-transparent c-primary font-bold border-none'
          >
            Cancel
          </button>
        </div>
      </div>
    </Portal>
  )
}
