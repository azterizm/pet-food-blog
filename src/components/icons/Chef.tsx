import type { DetailedHTMLProps, ImgHTMLAttributes, ReactElement } from 'react'

export function Chef(
  props: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & { selected?: boolean }
): ReactElement {
  return (
    <img
      {...props}
      src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAChElEQVRoge2ZzU4UQRDHf6ISiaxhJUriUQ/sO6hLwgPwBBqDET3ozRjlQfAhvIg3UQzCEo1fB01UPC7evICBxNuuh6pmBlxmenp2e9phfsmkN9sf9a/t6uruWagoP2eA28AzoA380acNLAJzQK0wdRYcA+4BW0A35dkC7mqfoDgHLBEJfQPMAheBU/pcAm4Cb2PtnmvfIKgBHxFhm0DTos+Utu0CH/AUanXk110ENoBd4DfwGVgAVlTQOnA2w7jjyMx1dYwF4IuOvau2nqrteh4HRoB5YJv0mG8D5x1sTGhfmzX1CAnRTFxAptwMtATcAiaB0/pMIhnosX52paFjzB0Yv6E2X8R0vFdt1k6Y+N0AruQQ2S+uIlrMOkx1ZoRoJlaAsUGqy8gY8BrR9o6UMJvXht8JywlDHfiBaHyY1Mgs7BDC6TCmiBJAz2w2S7SwQ+clovWG+WIoVjmj5ROfihwxGmd6VZrYy5NKfdEgyqr/sKOVoz4VOTKKaN0xX8RD67iWHZ+KcrJ3eo478ktL652zQIxGo3mfI5+0vOxNjjtGo9G8zxGTdq95k+POdS17bhU15AjdIexZaSILfZuExPSAKK2FfkS5n9TwJHJB6gKrhOVMHWgh2lqI1kQmgG9EM2NzdR00TaKZ+EqGe/448Eo7doBlYHoAAtOYVtsd1bJMtus0IJvNHeAnB3ZRj5jTxibyrizX66NhoqvmYawiF7J+1hGzO5yi0Zo0R5LqXets6vcYSm/yf1AaR070aRyz9/jq54x1rPagBawVYNfPgP22W5o1UjkSGqVxJGv6LWLBW3FkZ8T3n5fWEVCaGakcCY3KkdA4cvvI+kBVJNMq0HaFM38B6/6/GcCMACcAAAAASUVORK5CYII='
      style={{
        filter: props.selected
          ? 'invert(100%)'
          : 'invert(12%) sepia(9%) saturate(4911%) hue-rotate(197deg) brightness(93%) contrast(100%)',
      }}
    />
  )
}
