import { ReactElement, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'

export function NotFound(): ReactElement {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const name = location.pathname.split('/').filter(Boolean)[0]
    if (!name) return
    fetch(`${API_ENDPOINT}/author/custom_url/${name}`).then((r) => r.json())
      .then((e) => {
        setLoading(false)
        const id = e.id
        if (id) navigate('/authors/' + id)
      })
  }, [])
  if (loading) return <Loader />
  return (
    <div className='min-h-70vh flex flex-col items-center'>
      <div className='mb-10 text-center'>
        <h1 className='uppercase'>404</h1>
        <span className='uppercase font-bold text-xl'>not found</span>
      </div>
      <span className='font-medium'>There's nothing here...</span>
      <button
        className='bg-primary c-white px-5 py-3 rounded-lg text-lg mt-10 border-none'
        onClick={() => (window.location.href = '/')}
      >
        Go home
      </button>
    </div>
  )
}
