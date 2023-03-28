import { useState } from 'react'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/api'
import { DonateStatus } from '../../types/ui'
import { AuthorProfileImage } from '../AuthorProfileImage'
import { Loader } from '../Loader'
import { ProfileImage } from '../ProfileImage'

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
  const [user] = useAuth()
  const navigate = useNavigate()
  const params = useParams()

  function onConfirm() {
    if (!selectedAmount) return
    if (!user)
      return navigate('/login', {
        state: {
          redirect: params?.id ? '/recipes/read/' + params?.id : '',
        },
      })
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
      <h3 className='text-xl font-bold text-button bg-white border-y-1 border-gray-200 py-3 w-full'>
        Do you want to support {props.name}?
      </h3>

      <ProfileImage className='w-30 h-30 rounded-full mx-auto block' />

      <p className='text-center'>
        {props.name} is supported by generiosity of followers like you.
      </p>
      {props.status === DonateStatus.Idle ? (
        <div className='flex-center gap-2'>
          {[2, 5, 20].map((r, i) => (
            <button
              key={i}
              onClick={() => setSelectedAmount(r)}
              className={
                'text-white px-5 py-3 rounded-full bg-neutral-200 border-0 text-xl font-bold ' +
                (selectedAmount === r ? 'opacity-100' : 'opacity-50')
              }
              style={{ backgroundColor: ['#72c9c3', '#45b2ab', '#3a9691'][i] }}
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
