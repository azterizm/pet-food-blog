import type { ReactElement } from 'react'
import { GoBack } from '../components/GoBack'
import { useApi } from '../hooks/api'
import { IDeposit } from '@backend/models/deposit'
import { Loader } from '../components/Loader'

export function PastDeposits(): ReactElement {
  const { data, loading, error } = useApi<IDeposit[]>('/user/past_deposit')
  return (
    <div>
      <GoBack />
      {loading ? (
        <Loader />
      ) : !data || !data.length || error ? (
        <span>No data available.</span>
      ) : null}
      <div className='overflow-x-auto min-h-screen mt-5'>
        <table className='min-w-full divide-y-2 divide-gray-200 text-sm'>
          <thead>
            <tr>
              <th className='whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900'>
                ID
              </th>
              <th className='whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900'>
                Amount
              </th>
              <th className='whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900'>
                Date
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {data?.map((r) => (
              <tr key={r.id}>
                <td className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>
                  {r.id}
                </td>
                <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                  {r.amount}
                </td>
                <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                  {new Date(r.createdAt || '').toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
