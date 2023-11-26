import { Portal } from 'react-portal'
import { useAuth } from '../../hooks/api'

export default function (
  props: {
    loading: boolean
    onPayItem: () => void
    onCancel: () => void
  },
) {
  const [user] = useAuth()
  return (
    <Portal>
      <div className='fixed-center z-101 flex-center flex-col gap-5 bg-white border-2 border-primary px-10 py-5 rounded-lg z-101'>
        <p className='font-medium text-lg m-0'>
          Are you sure, you want to pay 2$ for this item?
        </p>
        {!user
          ? (
            <p className='text-md m-0'>
              <span className='text-red-600 font-bold'>
                Warning:{' '}
              </span>
              You are not logged in, so you will not be able to download this
              item again. <a href='/login'>Login here</a>.
            </p>
          )
          : (
            <p>
              You will be able to download this item again from your account.
            </p>
          )}
        <div className='flex-center'>
          {props.loading ? <p className='text-center'>Loading...</p> : (
            <>
              <button
                onClick={props.onCancel}
                className='bg-white text-primary px-5 py-2 text-lg border-none'
              >
                Cancel
              </button>
              <button
                onClick={props.onPayItem}
                className='bg-button text-white px-5 py-2 rounded-full text-lg border-none'
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </Portal>
  )
}
