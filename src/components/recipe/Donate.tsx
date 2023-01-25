import { useState } from 'react'
import { DonateStatus } from '../../types/ui'
import { Loader } from '../Loader'

interface Props {
  name: string
  onDonate: (amount: number) => void
  status: DonateStatus
  onReset?: () => void
}

export const Donate = (props: Props) => {
  const [selectedAmount, setSelectedAmount] = useState<null | number>(null)
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [note, setNote] = useState('')

  function onConfirm() {
    if (!selectedAmount) return
    props.onDonate(selectedAmount)
  }
  function onAddNote() {
    setShowNoteInput(true)
  }

  function onCancelNote() {
    setShowNoteInput(false)
  }

  function onReset() {
    setShowNoteInput(false)
    setSelectedAmount(null)
    setNote('')
    if (props.onReset) props.onReset()
  }

  return (
    <div>
      <h3 className='text-xl font-bold bg-neutral-200 ml--10 pl-10 py-3 w-full'>
        Do you want to support {props.name}?
      </h3>

      <p>
        {props.name} is supported by generiosity of her <b>So Pawlicious</b>{' '}
        followers like you.
      </p>
      {props.status === DonateStatus.Idle ? (
        <div className='flex-center gap-2'>
          {[2, 5, 20].map((r, i) => (
            <button
              key={i}
              onClick={() => setSelectedAmount(r)}
              className={
                'c-secondary px-5 py-3 rounded-lg bg-neutral-200 border-0 text-xl font-bold ' +
                (selectedAmount === r ? 'opacity-100' : 'opacity-50')
              }
            >
              {r - 0.01}$
            </button>
          ))}
        </div>
      ) : props.status === DonateStatus.Process ? (
        <Loader />
      ) : props.status === DonateStatus.Done ? (
        <div className='flex-center flex-col'>
          <p className='text-xl font-bold'>
            Successfully Donated {selectedAmount || '0'}$!
          </p>
          <button
            onClick={onReset}
            className='bg-white c-secondary font-bold border-0 text-lg'
          >
            Donate again
          </button>
        </div>
      ) : null}
      {selectedAmount && props.status === DonateStatus.Idle ? (
        <>
          <button
            onClick={onConfirm}
            className='uppercase c-white bg-secondary text-xl font-bold mt-5 border-0 mx-auto block px-5 py-3 rounded-full'
          >
            Confirm your donation
          </button>
          {showNoteInput ? (
            <div>
              <textarea
                className='p-2 min-h-30 bg-neutral-200 rounded-lg block mx-auto border-0 mt-5 w-full font-sans'
                placeholder='Type your note here...'
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button
                onClick={onCancelNote}
                className='c-secondary bg-white border-0 text-lg mx-auto block px-5 py-3 rounded-full'
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={onAddNote}
              className='c-secondary bg-white border-0 text-lg mx-auto block px-5 py-3 rounded-full'
            >
              Add a note of gratitude
            </button>
          )}
        </>
      ) : null}
    </div>
  )
}
