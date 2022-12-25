import { API_ENDPOINT } from '../constants/api'
import { IUser } from '../types/auth'

export async function logoutUser() {
  const data = await fetch(API_ENDPOINT + '/auth/logout', {
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    method: 'post',
  }).then((r) => r.json())
  if (data.error) return window.alert(data.info)
  localStorage.removeItem('user')
  window.location.href = '/'
}

export async function getUser(force: boolean = false): Promise<IUser | null> {
  let user = localStorage.getItem('user')

  if (!user || user === 'null' || force) {
    const data = await fetch(API_ENDPOINT + '/auth/user', {
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    }).then((r) => r.json())

    if (data.error) {
      return null
    }

    user = data
    localStorage.setItem('user', JSON.stringify(data))
  } else {
    const parsedUser = JSON.parse(user)
    if (parsedUser.error) {
      localStorage.clear()
      window.alert(parsedUser.info)
      return null
    } else user = parsedUser
  }

  return user as any
}
