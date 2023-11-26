import { API_ENDPOINT } from '../../constants/api'

export async function handlePayment(itemId: string | number) {
  const data = await fetch(API_ENDPOINT + '/donate/item/' + itemId, {
    method: 'post',
    credentials: 'include',
  }).then((r) => r.json())

  return data
}
