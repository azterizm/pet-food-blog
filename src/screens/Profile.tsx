import _ from 'lodash'
import { Camera } from 'phosphor-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { GoBack } from '../components/GoBack'
import { ProfileImage } from '../components/ProfileImage'
import { API_ENDPOINT } from '../constants/api'
import { logoutUser } from '../features/auth'
import { useAuth } from '../hooks/api'

export interface ProfileProps {}

interface Inputs {
  email: string
  name: string
  username: string
  phone: string
}

const inputs = ['email', 'name', 'username', 'phone']
const emailReg =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function Profile({}: ProfileProps): ReactElement {
  const [user] = useAuth()
  const [editMode, setEditMode] = useState(false)
  const { register, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues: _.pick(user, inputs) as Inputs,
  })
  const [loading, setLoading] = useState(false)
  const profileImage = useRef<HTMLInputElement>(null)
  const [newProfile, setNewProfile] = useState('')

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
    setNewProfile(URL.createObjectURL(file))
  }

  function handleChangeEditMode() {
    if (editMode) {
      if (user) {
        inputs.forEach((input) => setValue(input as any, (user as any)[input]))
      }
    }
    setEditMode((e) => !e)
  }

  if (!user) return <span>Loading...</span>
  return (
    <div className='min-h-100vh w-full'>
      <GoBack />
      <h1>Your account</h1>
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
        {[
          ['Name', 'name'],
          ['Username', 'username'],
          ['Email address', 'email'],
          ['Phone', 'phone'],
        ].map(([label, value], i) => (
          <div className='flex items-start flex-col gap-1' key={i}>
            <span className='uppercase c-primary text-sm font-bold'>
              {label}
            </span>
            <input
              className='p-2 rounded-lg border-neutral-300 border-1'
              type={value === 'email' ? 'email' : 'text'}
              {...register(value as any, {
                minLength: value === 'phone' ? 11 : 3,
                required: false,
                pattern: value === 'email' ? emailReg : undefined,
                disabled: !editMode,
              })}
            />
          </div>
        ))}
        {editMode ? (
          <button
            disabled={loading}
            className='px-5 py-3 rounded-full bg-primary c-white font-medium border-none mt-2'
          >
            {loading ? 'Saving changes...' : 'Save changes'}
          </button>
        ) : null}
      </form>

      <div className='flex items-start flex-col gap-1 mt-5'>
        <span className='uppercase c-primary text-sm font-bold'>Deposit</span>
        <span>${user.deposit}</span>
      </div>
      <div className='mt-5 block'>
        <a
          onClick={(e) => (e.preventDefault(), handleChangeEditMode())}
          className='bg-primary block mb-5 c-white font-bold w-max font-medium no-underline px-5 py-3 border-none rounded-lg cursor-pointer hover:brightness-75 text-md'
          href='#'
        >
          {!editMode ? 'Edit profile' : 'Cancel edit'}
        </a>
        {[
          ['Add deposit', '/deposit'],
          ['See recent purchases', '/purchases'],
          ['Subscribed authors', '/subscribed'],
        ].map(([label, link], i) => (
          <Link
            to={link}
            className='bg-primary block mb-5 c-white font-bold w-max font-medium no-underline px-5 py-3 border-none rounded-lg cursor-pointer hover:brightness-75 text-md'
            key={i}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className='mt-5 block'>
        <button
          onClick={logoutUser}
          className='bg-transparent hover:underline cursor-pointer c-primary text-lg border-none'
        >
          Logout
        </button>
      </div>
    </div>
  )
}
