import type { ReactElement } from 'react'
import '../css/loader.css'

export function Loader(): ReactElement {
  return (
    <div className='loader'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
