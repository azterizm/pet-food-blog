import { FormEvent, ReactElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINT } from '../constants/api'
import { getUser } from '../features/auth'
import { useHeaderFooter } from '../hooks/state'

export function Onboard(): ReactElement {
  const [error, setError] = useState('')
  const header = useHeaderFooter()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getUser().then((auth) => {
      if (!auth) window.location.href = '/login'
      else if (auth.profile) navigate('/')
    })
    header.hide()
    return () => {
      header.show()
    }
  }, [])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = new FormData(e.target as any)
    const file = form.get('image') as File
    if (!file.name || !file.type.includes('image'))
      return setError('Please upload an image file')

    setLoading(true)
    const data = await fetch(API_ENDPOINT + '/auth/complete_profile', {
      body: form,
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return setError(data.info)
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <form className='min-h-100vh mt-20' onSubmit={submit}>
      <h1 className='text-center'>Welcome to So Pawlicious!</h1>
      <span className='text-lg font-medium text-center block'>
        Please complete your profile
      </span>
      <div className='mt-20'>
        <div className='flex items- w-80 flex-col gap-2 justify-center block mx-auto translate-x-8 mt-10'>
          <span>Profile image</span>
          <input type='file' name='image' id='image' />
        </div>
        <button className='rounded-lg border-none px-5 py-3 text-lg bg-blue-500 c-white block mx-auto mt-10'>
          Submit
        </button>
        {loading ? (
          <span className='text-center mt-5 block'>Loading...</span>
        ) : error ? (
          <span className='c-red text-center mt-5 block'>Error: {error}</span>
        ) : null}
      </div>
    </form>
  )
}
