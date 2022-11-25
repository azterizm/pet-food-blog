import { FacebookLogo, SnapchatLogo, YoutubeLogo } from 'phosphor-react'
import type { ReactElement } from 'react'

export function AuthorList(): ReactElement {
  return (
    <div className='mt-10 min-h-100vh flex flex-wrap gap-5 justify-center'>
      <div className='flex flex-col w-80'>
        <img
          className='object-cover w-80 object-cover rounded-t-lg'
          src='https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          alt='profile'
        />
        <div className='px-5 py-3 bg-neutral-300 rounded-b-lg'>
          <span className='text-2xl font-bold mt-5 block'>Test Person</span>
          <div className='flex items-center gap-5 my-5'>
            <FacebookLogo size={20} />
            <SnapchatLogo size={20} />
            <YoutubeLogo size={20} />
          </div>
          <span className='mb-10 block'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas animi
            magnam dolor, consequatur sed, est voluptates quo porro alias, sunt
            quis necessitatibus atque autem excepturi fuga nulla. Architecto,
            cum perferendis?
          </span>
        </div>
      </div>
      <div className='flex flex-col w-80'>
        <img
          className='object-cover w-80 object-cover rounded-t-lg'
          src='https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          alt='profile'
        />
        <div className='px-5 py-3 bg-neutral-300 rounded-b-lg'>
          <span className='text-2xl font-bold mt-5 block'>Test Person</span>
          <div className='flex items-center gap-5 my-5'>
            <FacebookLogo size={20} />
            <SnapchatLogo size={20} />
            <YoutubeLogo size={20} />
          </div>
          <span className='mb-10 block'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas animi
            magnam dolor, consequatur sed, est voluptates quo porro alias, sunt
            quis necessitatibus atque autem excepturi fuga nulla. Architecto,
            cum perferendis?
          </span>
        </div>
      </div>
      <div className='flex flex-col w-80'>
        <img
          className='object-cover w-80 object-cover rounded-t-lg'
          src='https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          alt='profile'
        />
        <div className='px-5 py-3 bg-neutral-300 rounded-b-lg'>
          <span className='text-2xl font-bold mt-5 block'>Test Person</span>
          <div className='flex items-center gap-5 my-5'>
            <FacebookLogo size={20} />
            <SnapchatLogo size={20} />
            <YoutubeLogo size={20} />
          </div>
          <span className='mb-10 block'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas animi
            magnam dolor, consequatur sed, est voluptates quo porro alias, sunt
            quis necessitatibus atque autem excepturi fuga nulla. Architecto,
            cum perferendis?
          </span>
        </div>
      </div>
    </div>
  )
}
