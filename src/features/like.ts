import { warn } from 'console'
import { API_ENDPOINT } from '../constants/api'
import { ApiProcess } from '../types/api'

export async function handleLike(
  id: string | number,
  contentType: 'blog' | 'recipe',
) {
  const data: ApiProcess = await fetch(
    API_ENDPOINT + `/${contentType}/like/` + id,
    {
      method: 'post',
      credentials: 'include',
    },
  ).then((r) => r.json())
  console.log({data})

  if (data.error) return { error: true, info: data.info }
  return { error: false }
}
