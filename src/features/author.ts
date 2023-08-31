import { API_ENDPOINT } from '../constants/api'
import { IUser } from '../types/auth'

export async function donateAuthor({
  amount,
  id,
  user,
}: {
  amount: number | string
  id: string | number
  user?: IUser | null
}) {
  if (!user) return window.location.href = '/login'
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

export async function followAuthor(
  authorId?: string | number,
  user?: IUser | null,
  onError?: (message: string) => void,
) {
  if (!user || !authorId) return window.location.href = '/login'
  const response = await fetch(`${API_ENDPOINT}/follow/${authorId}`, {
    credentials: 'include',
    method: 'post',
  }).then((r) => r.json())
  if (response.error && onError) onError(response.info)
}
