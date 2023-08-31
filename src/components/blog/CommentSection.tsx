import { IAuthor } from '@backend/models/author'
import { IComment } from '@backend/models/comment'
import { Chat, ChatCircle, X } from 'phosphor-react'
import { useRef, useState } from 'react'
import { API_ENDPOINT } from '../../constants/api'
import { useOnClickOutside } from '../../hooks/ui'

interface Props {
  onClose: () => void
  authorProfileImage: string
  authorName: string
  postId: number | string
  data: (IComment & { author: IAuthor })[]
}

export default function CommentSection(props: Props) {
  const [collapse, setCollapse] = useState(false)
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(containerRef, props.onClose)

  async function onComment() {
    if (!text) return
    setLoading(true)
    const data = await fetch(`${API_ENDPOINT}/comment/add/blog`, {
      body: JSON.stringify({ id: props.postId, text }),
      method: 'post',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    }).then((r) => r.json())
    setLoading(false)
    if (data.error) return alert(data.info)
  }

  return (
    <div ref={containerRef} className='bg-white px-5 shadow-xl pb-3'>
      <div className='flex items-center gap-2 justify-between'>
        <p className='text-2xl font-bold'>Comments (0)</p>
        <button
          onClick={props.onClose}
          className='border-none bg-white text-2xl translate-y-1'
        >
          <X />
        </button>
      </div>
      {collapse
        ? (
          <button
            onClick={() => setCollapse(false)}
            className='bg-white text-left w-full py-3 border-none text-neutral-400'
          >
            What are your thoughts?
          </button>
        )
        : (
          <div className='p-4 rounded-lg shadow-lg my-4'>
            <div className='flex items-center gap-2'>
              <img
                className='aspect-square object-cover object-center w-14 rounded-full mr-2'
                src='https://images.unsplash.com/photo-1692879452826-649c6f685c37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
                alt='author profile image'
              />
              <p>{props.authorName}</p>
            </div>
            <textarea
              className='bg-white focus:outline-none mt-4 border-none w-full h-20 block font-sans placeholder:text-neutral-400'
              name='comment'
              id='comment'
              placeholder='What are your thoughts?'
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <div className='flex items-center w-full justify-end gap-2'>
              <button
                disabled={loading}
                onClick={() => setCollapse(true)}
                className='bg-white border-none'
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={onComment}
                className='bg-button text-white px-5 py-3 rounded-full border-none'
              >
                {loading ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          </div>
        )}
      <div className='divide-y grid grid-cols-1 mt-16'>
        {new Array(20).fill(
          props.data,
        ).flat()
          .map((r) => (
            <div key={r.id} className='pt-10 pb-6 border-gray-200'>
              <div className='flex items-center gap-2'>
                <img
                  className='aspect-square object-cover object-center w-14 rounded-full mr-2'
                  src='https://images.unsplash.com/photo-1692879452826-649c6f685c37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
                  alt='author profile image'
                />
                <div className='flex items-start flex-col'>
                  <p className='m-0 mb-2'>{r.author.name}</p>
                  <p className='m-0'>
                    {new Date(r.createdAt || '').toDateString()}
                  </p>
                </div>
              </div>
              <p>{r.text}</p>
              <div className='flex items-center gap-2 justify-between -ml-4'>
                <div className='flex items-center gap-2'>
                  <button className='flex items-center bg-white border-none'>
                    <img
                      src={'/icons/clap.png'}
                      alt='Clapping hands icon'
                      width='45'
                      className='group-active:scale-150 group-focus:scale-150 transition-transform -translate-y-1'
                    />
                    <span>{r.likes}</span>
                  </button>
                  <button className='flex items-center bg-white border-none gap-2'>
                    <ChatCircle size={20} />
                    <span>2 replies</span>
                  </button>
                </div>
                <button className='px-5 py-2 bg-white border-none font-medium'>
                  Reply
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
