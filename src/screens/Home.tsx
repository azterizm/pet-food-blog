import { Recipes } from '../components/home/Recipes'
import '../css/home.css'

export function Home() {
  return (
    <div className='relative'>
      <div id='list_title'>
        <h1 className='m-0 text-center'>Discover</h1>
        <p style={{fontSize:'1.25rem'}} className='m-0 text-button font-medium text-center'>Yummy Recipes</p>
      </div>
      <Recipes />
    </div>
  )
}
