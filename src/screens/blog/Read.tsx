import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IPost } from '@backend/models/post'
import Delimiter from '@editorjs/delimiter'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Underline from '@editorjs/underline'
import classNames from 'classnames'
import { ChatCircle, Heart, Share } from 'phosphor-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthorListItem from '../../components/blog/ListItem'
import { GoBack } from '../../components/GoBack'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { donateAuthor } from '../../features/author'
import { handleLike } from '../../features/like'
import { useApi } from '../../hooks/api'
import { ApiProcess } from '../../types/api'
import { DonateStatus } from '../../types/ui'

export function Read(): ReactElement {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [donateStatus, setDonateStatus] = useState<DonateStatus>(
    DonateStatus.Idle,
  )

  const navigate = useNavigate()
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorJS>()

  const { data, loading, error } = useApi<IPost & FetchData>(
    '/blog/one/' + id + '/true',
    {
      onSuccess: (r) => {
        const d: FetchData = data || r
        if (d && !loaded) {
          setLiked(d.userLiked)
          setLoaded(true)
        }
      },
    },
    [id],
  )
  console.log({ data })

  useEffect(() => {
    if (!editorContainerRef.current || !data) return
    if (editorRef.current) {
      editorRef.current.isReady.then(() => editorRef.current?.destroy()).then(
        () => initEditor(data?.body as any),
      )
    } else initEditor(data?.body as any)
  }, [editorContainerRef, editorRef, data])

  function initEditor(data?: OutputData) {
    if (!editorContainerRef.current) return

    const editor = new EditorJS({
      holder: editorContainerRef.current,
      tools: {
        header: Header,
        quote: Quote,
        delimiter: Delimiter,
        underline: Underline,
        embed: {
          class: Embed,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        image: {
          class: Image,
        },
      },
      logLevel: 'ERROR' as any,
      data,
      readOnly: true,
    })
    editorRef.current = editor
  }

  async function onDonate(amount: number) {
    if (!amount || !data) return
    setDonateStatus(DonateStatus.Process)
    const donateResponse: ApiProcess = await donateAuthor({
      id: data.author.id!,
      amount,
    })
    setDonateStatus(DonateStatus.Process)
    if (donateResponse.error) return alert(donateResponse.info)
    setDonateStatus(DonateStatus.Done)
  }

  if (loading) return <Loader />
  else if (!data || error) {
    return (
      <div className='flex-center absolute-center'>
        <span className='c-red'>{error}</span>
      </div>
    )
  }

  const interactButtons = (className?: string) => (
    <div
      className={classNames(
        'flex items-center justify-between border-gray-200 my-6 py-2',
        className,
      )}
    >
      <div className='flex items-center gap-6'>
        <button
          onClick={() => (setLiked((e) => !e), handleLike(data.id!, 'blog'))}
          className='flex items-center gap-1 bg-white text-gray-600 border-none group select-none whitespace-nowrap cursor-pointer'
        >
          <img
            src={liked ? '/icons/clap-active.png' : '/icons/clap.png'}
            alt='Clapping hands icon'
            width='45'
            style={{ transform: 'translateY(-2px)' }}
            className='group-active:scale-150 group-focus:scale-150 transition-transform'
          />
          <span
            className='text-md'
            style={{ marginLeft: -8 }}
          >
            4.7k
          </span>
        </button>

        <button className='flex items-center gap-1 bg-white border-none text-gray-600'>
          <ChatCircle size={20} />
          <span className='text-md'>
            56
          </span>
        </button>
      </div>
      <div className='flex items-center gap-6'>
        <button className='bg-white border-none text-gray-600'>
          <Heart size={20} />
        </button>
        <button className='bg-white border-none text-gray-600'>
          <Share size={20} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className='max-w-[42.5rem] mx-auto'>
        <GoBack />
        <h1 className='text-5xl font-black block mt-16'>
          {data.title}
        </h1>
        <div className='flex items-center gap-2'>
          <img
            className='rounded-full aspect-sqaure object-cover object-center w-16'
            src={data.author.profile}
            alt={`${data.author.name} profile`}
          />
          <div>
            <div className='flex items-center gap-2 text-lg'>
              <p className='m-0'>{data.author.name}</p>
              <span>&bull;</span>
              <button className='py-2 bg-white hover:underline text-blue-600 border-none text-lg font-bold'>
                Follow
              </button>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <p className='m-0'>11 min read</p>
              <span>&bull;</span>
              <p className='m-0'>
                {new Date(data.createdAt || '').toDateString()}
              </p>
            </div>
          </div>
        </div>
        {interactButtons('border-y-2')}

        <img src={API_ENDPOINT + data.mainImage} className='w-full' />
        <div className='font-sans' ref={editorContainerRef} />
        <div className='flex items-center gap-4'>
          {data.tags.map((r,i) => (
            <button
              key={i}
              onClick={() => navigate('/blog')}
              className='bg-gray-100 rounded-full px-5 py-2 border-none'
            >
              {r}
            </button>
          ))}
        </div>
        {interactButtons()}
      </div>

      <div className='mt-16 w-screen -ml-10 bg-gray-100'>
        <div className='py-16 max-w-[42.5rem] mx-auto'>
          <div className='my-8'>
            <img
              className='rounded-full aspect-sqaure object-cover object-center w-16 mb-4'
              src={data.author.profile}
              alt={`${data.author.name} profile`}
            />
            <div className='flex items-center justify-between'>
              <div>
                <p className='m-0 font-semibold text-2xl mb-2'>
                  Written by {data.author.name}
                </p>
                <p className='m-0 text-md'>145 Followers</p>
              </div>
              <div className='flex items-center gap-2'>
                <button className='px-5 font-medium py-3 rounded-full bg-black text-white border-none'>
                  Follow
                </button>
              </div>
            </div>
          </div>
          <div style={{ height: 2 }} className='w-full bg-gray-200' />
          <p className='text-xl font-medium my-8'>
            Recommended
          </p>
          <div className='grid grid-cols-2 gap-4'>
            {data.recommendations.map((r, i) => (
              <AuthorListItem
                key={i}
                title={r.title}
                image={API_ENDPOINT + r.mainImage}
                onClick={() => navigate('/blog/' + r.id)}
                authorName={r.author.name}
                likes={r.likesCount}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

interface FetchData {
  author: IAuthor
  userLiked: boolean
  recommendations: (IPost & { author: { name: string }; likesCount: number })[]
  likes: ILike[]
}
