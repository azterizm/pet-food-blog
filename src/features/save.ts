import { ISave } from '@backend/models/save'
import { API_ENDPOINT } from '../constants/api'
import { IUser } from '../types/auth'

export async function onSave({
  user,
  id,
}: {
  user: IUser | null
  id?: number | string
}) {
  if (!user || !id) return (window.location.href = '/login')

  const data = await fetch(API_ENDPOINT + '/recipe/save/' + id, {
    credentials: 'include',
    method: 'post',
  })
    .then((r) => r.json())
    .catch(() => ({ error: true }))

  if (data.error) {
    alert(data.info)

    return
  }
}

export function isSaved({
  user,
  id,
  data,
}: {
  user: IUser | null
  id?: number
  data: { saves: ISave[] }
}) {
  if (!id || !user) return false

  const save = data?.saves.find(
    (r) =>
      r.recipeId === id &&
      r[user.type === 'author' ? 'authorId' : 'userId'] === user.id
  )

  return Boolean(save)
}
