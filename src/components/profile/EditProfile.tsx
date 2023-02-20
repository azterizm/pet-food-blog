import _ from 'lodash'
import { Camera, WarningCircle } from 'phosphor-react'
import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { API_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'
import { useFade } from '../../hooks/state'
import { ProfileImage } from '../ProfileImage'

interface Inputs {
  name: string
}

const inputs = ['name']

export function EditProfile(): ReactElement {
  const [user] = useAuth()
  console.log('user:', user)
  const profileImage = useRef<HTMLInputElement>(null)
  const [newProfile, setNewProfile] = useState('')
  const [newProfileDialog, setNewProfileDialog] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const fade = useFade()
  const { register, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues: _.pick(user, inputs) as Inputs,
  })

  useEffect(() => {
    if (user) {
      inputs.forEach((input) => setValue(input as any, (user as any)[input]))
    }
  }, [user])

  async function submitEdit(values: Inputs) {
    if (!editMode) return
    setLoading(true)

    const form = new FormData()
    if (newProfile) {
      const blob = await fetch(newProfile).then((r) => r.blob())
      form.append('profile', blob)
    }
    form.append('document', JSON.stringify(values))

    const data = await fetch(API_ENDPOINT + '/auth/edit_profile', {
      method: 'post',
      body: form,
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return alert(data.info)
    setEditMode(false)
    localStorage.removeItem('user')
    window.location.reload()
  }

  function addProfileImage() {
    const file = profileImage.current?.files?.item(0)
    if (!file) return
    const imageURL = URL.createObjectURL(file)
    setNewProfile(imageURL)
    setNewProfileDialog(imageURL)
    fade.show()
    profileImage.current!.value = ''
  }

  function handleChangeEditMode() {
    if (editMode) {
      if (user) {
        inputs.forEach((input) => setValue(input as any, (user as any)[input]))
      }
    }
    setEditMode((e) => !e)
  }

  return (
    <form
      onSubmit={handleSubmit(submitEdit)}
      className='flex items-start gap-2 flex-col'
    >
      <div
        className='relative mb-5 cursor-pointer'
        onClick={() => (!editMode ? null : profileImage.current?.click())}
      >
        {newProfile ? (
          <img
            src={newProfile}
            alt='new profile picture'
            className='object-cover rounded-full shadow-lg min-w-50 w-50 h-50 min-h-50'
          />
        ) : (
          <ProfileImage className='min-w-50 w-50 h-50 min-h-50' />
        )}
        {editMode ? (
          <div className='p-5 bg-white rounded-full absolute-center flex-center gap-2'>
            <Camera size={36} />
            <span>Change</span>
          </div>
        ) : null}
        <input
          type='file'
          name='profile'
          id='profile'
          className='hidden'
          onChange={addProfileImage}
          ref={profileImage}
        />
      </div>
      <div className='flex items-start flex-col gap-1'>
        <span className='uppercase c-primary text-sm font-bold'>Name</span>
        {editMode ? (
          <input
            className='p-2 rounded-lg border-neutral-300 border-1'
            type='text'
            {...register('name', {
              minLength: 3,
              required: false,
              disabled: !editMode,
            })}
          />
        ) : (
          <span className='text-sm'>{user?.name}</span>
        )}
      </div>
      <div className='flex items-start flex-col gap-1 mt-2'>
        <span className='uppercase c-primary text-sm font-bold'>Email</span>
        <span className='text-sm'>{user?.email}</span>
        {editMode ? (
          <div className='flex items-center gap-2'>
            <WarningCircle />
            <span className='text-neutral-600 text-sm max-w-80'>
              Email is taken from your connected account (Google, Apple) so it
              cannot be changed.
            </span>
          </div>
        ) : null}
      </div>

      {editMode ? (
        <button
          disabled={loading}
          className='px-5 py-3 rounded-full bg-primary c-white font-medium border-none mt-2'
        >
          {loading ? 'Saving changes...' : 'Save changes'}
        </button>
      ) : null}
      <button
        onClick={handleChangeEditMode}
        className='bg-primary px-5 py-3 rounded-lg c-white font-bold mt-2'
        type='button'
      >
        {editMode ? 'Cancel edit' : 'Edit profile'}
      </button>
      {newProfileDialog ? (
        <div className='fixed-center bg-white w-80vw py-5 z-101 px-5 rounded-lg'>
          <span className='font-medium font-lg pb-5 block'>
            Change profile picture
          </span>
          <img
            className='max-h-80% object-contain max-w-80% aspect-video block mx-auto my-0'
            src={newProfileDialog}
            style={{ width: 'calc(100% + 2.5rem)' }}
          />
          <div className='flex items-center justify-between mt-5'>
            <button
              onClick={() => (
                setNewProfile(''),
                setNewProfileDialog(''),
                fade.hide(),
                (profileImage.current!.value = '')
              )}
              className='bg-white c-primary text-md border-0 font-medum'
            >
              Cancel
            </button>
            <div className='flex justify-end items-center gap-5'>
              <button
                onClick={() => (
                  setNewProfileDialog(''),
                  setNewProfile(''),
                  (profileImage.current!.value = ''),
                  profileImage.current!.click()
                )}
                className='c-primary bg-white font-medium border-0'
              >
                Change
              </button>
              <button
                onClick={() => (
                  setNewProfileDialog(''),
                  (profileImage.current!.value = ''),
                  fade.hide()
                )}
                className='bg-primary c-white font-bold rounded-lg px-5 py-3 border-0'
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  )
}
