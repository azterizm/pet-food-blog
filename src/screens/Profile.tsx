import _ from 'lodash'
import { ReactElement, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { GoBack } from '../components/GoBack'
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

  useEffect(() => {
    if (user) {
      inputs.forEach((input) => setValue(input as any, (user as any)[input]))
    }
  }, [user])

  async function submitEdit(values: Inputs) {
    if (!editMode) return
    setLoading(true)
    const data = await fetch(API_ENDPOINT + '/auth/edit_profile', {
      method: 'post',
      body: JSON.stringify(values),
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return alert(data.info)
    setEditMode(false)
    localStorage.removeItem('user')
    window.location.reload()
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
          onClick={(e) => (setEditMode((e) => !e), e.preventDefault())}
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
