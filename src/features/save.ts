import { ISave } from '@backend/models/save'
import { API_ENDPOINT } from '../constants/api'
import { IUser } from '../types/auth'

export async function onSaveRecipe({
  user,
  id,
}: {
  user: IUser | null
  id?: number | string
}) {
  if (!user || !id) return (window.location.href = '/login')

  const data = await fetch(API_ENDPOINT + '/save/add/recipe/' + id, {
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

export async function onSavePost(id?: number | string, user?: IUser | null) {
  if (!user || !id) return (window.location.href = '/login')
  const data = await fetch(API_ENDPOINT + '/save/add/post/' + id, {
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

export async function getSaves(user?: IUser | null) {
  if (!user) return (window.location.href = '/login')
  const data = await fetch(API_ENDPOINT + '/save/list', {
    credentials: 'include',
    method: 'get',
  })
    .then((r) => r.json())
    .catch(() => ({ error: true }))

  if (data.error) {
    alert(data.info)

    return null
  }

  return data
}

export function isSavedRecipe({
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
      r[user.type === 'author' ? 'authorId' : 'userId'] === user.id,
  )

  return Boolean(save)
}

export function isSavedPost({
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
      r.postId === id &&
      r[user.type === 'author' ? 'authorId' : 'userId'] === user.id,
  )

  return Boolean(save)
}
