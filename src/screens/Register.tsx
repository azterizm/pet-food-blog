import { ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Register(): ReactElement {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/login')
  }, [])
  return <></>
}
