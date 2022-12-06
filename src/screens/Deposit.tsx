import { CurrencyDollar } from 'phosphor-react'
import { ReactElement, useCallback, useState } from 'react'
import { GoBack } from '../components/GoBack'
import { Loader } from '../components/Loader'
import { API_ENDPOINT } from '../constants/api'
import { ApiProcess } from '../types/api'

export function Deposit(): ReactElement {
  const [input, setInput] = useState('0')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = useCallback(async () => {
    const amount = parseInt(input)
    if (!amount || amount <= 0) return
    setLoading(true)
    const data: ApiProcess = await fetch(API_ENDPOINT + '/user/deposit', {
      method: 'post',
      body: JSON.stringify({ amount }),
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return setError(data.info)
    localStorage.removeItem('user')
    setInput('0')
    setDone(true)
  }, [input])

  return (
    <div>
      <GoBack />
      <h1>Deposit</h1>
      <p>Add funds for purchasing recipes and subscribing to chefs.</p>
      <div className='flex items-center gap-2 justify-center'>
        <input
          type='number'
          className='large-input'
          value={input}
          onChange={(e) => (setInput(e.target.value), setDone(false))}
          min={0}
        />
        <CurrencyDollar size={20} className='translate-y-5' />
      </div>
      <button
        onClick={submit}
        className='bg-primary c-white px-5 py-3 rounded-lg border-none block mx-auto font-bold text-md translate-x--5'
      >
        Submit
      </button>
      {loading ? (
        <Loader />
      ) : error ? (
        <p className='c-red font-bold text-center text-sm'>{error}</p>
      ) : done ? (
        <p className='c-green font-bold text-sm text-center'>
          Funds are successfully added
        </p>
      ) : null}
    </div>
  )
}
