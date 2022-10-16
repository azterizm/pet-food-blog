import { Star } from 'phosphor-react'
export function Hero() {
	return (
      <div className='flex items-center ml-10 gap-20'>
        <img
          className='w-50% h-70vh rounded-lg object-right aspect-video object-cover'
          src='./images/main.jpg'
          alt=''
        />
        <div className='c-primary w-120'>
          <div className='flex items-center bg-primary px-3 py-2 rounded-full w-max gap-2'>
            <Star weight='fill' className='c-white' />
            <span className='uppercase font-bold text-sm c-white'>Featured</span>
          </div>
          <h1 className='text-5xl leading-15'>I am passionate about the food and the tradition of making it.</h1>
          <span>
            by <b>Sean Hamilton</b> 5 years ago
          </span>
        </div>
      </div>
	)
}
