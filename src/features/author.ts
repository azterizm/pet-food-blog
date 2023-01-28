import { API_ENDPOINT } from '../constants/api'

export async function donateAuthor({
  amount,
  id,
}: {
  amount: number | string
  id: string | number
}) {
  const r = await fetch(API_ENDPOINT + '/author/donate', {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({
      id: Number(id),
      amount: parseInt(amount.toString()),
    }),
    headers: { 'content-type': 'application/json' },
  })
  return await r.json()
}
