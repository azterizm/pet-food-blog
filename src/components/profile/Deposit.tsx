import { ReactElement, useState } from 'react'
import { API_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'
import { ApiProcess } from '../../types/api'

export function Deposit(): ReactElement {
  const [user, changeUser] = useAuth()
  const [addMode, setAddMode] = useState(false)
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  if (!user) return <span>Loading...</span>

  async function onSubmit() {
    if (!amount) return
    setLoading(true)

    const data: ApiProcess = await fetch(API_ENDPOINT + '/user/deposit', {
      body: JSON.stringify({ amount }),
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      method: 'post',
    }).then((r) => r.json())
    setLoading(false)

    if (data.error) return alert(data.info)
    const newUser = !user
      ? null
      : {
          ...user,
          deposit: user.deposit + amount,
        }

    if (newUser) {
      changeUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    }

    setAddMode(false)
    setAmount(0)
  }
  return (
    <div className='flex items-start flex-col gap-1 mt-5'>
      <span className='uppercase c-primary text-xl font-bold'>Deposit</span>
      {addMode ? (
        <div className='flex items-start gap-2 flex-col'>
          <div className='flex items-start flex-col'>
            <label htmlFor='amount'>Enter amount</label>
            <input
              name='amount'
              id='amount'
              type='number'
              value={amount.toString()}
              onChange={(e) => setAmount(Number(e.target.value))}
              className='p-2 rounded-lg border-neutral-300 border-1'
            />
          </div>
          <button
            onClick={onSubmit}
            className='bg-transparent c-primary font-bold border-none p-0'
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      ) : (
        <span>${user.deposit}</span>
      )}

      <button onClick={() => setAddMode((e) => !e)} className='fill-btn'>
        {addMode ? 'Cancel deposit' : 'Add deposit'}
      </button>
    </div>
  )
}
