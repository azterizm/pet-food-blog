import { IAuthor } from '@backend/models/author'
import Embed from '@editorjs/embed'
import { ILike } from '@backend/models/like'
import { IPost } from '@backend/models/post'
import List from '@editorjs/list'
import Delimiter from '@editorjs/delimiter'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import Quote from '@editorjs/quote'
import Underline from '@editorjs/underline'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Hero } from '../../components/home/Hero'
import { Loader } from '../../components/Loader'
import { Donate } from '../../components/recipe/Donate'
import { LikeSection } from '../../components/recipe/LikeSection'
import { API_ENDPOINT } from '../../constants/api'
import { donateAuthor } from '../../features/author'
import { useApi } from '../../hooks/api'
import { ApiProcess } from '../../types/api'
import { DonateStatus } from '../../types/ui'
import {
  ChatCircle,
  Circle,
  HandsClapping,
  Heart,
  ListBullets,
  Share,
} from 'phosphor-react'
import { GoBack } from '../../components/GoBack'

interface FetchData {
  author: IAuthor
  userLiked: boolean
  likes: ILike[]
}
export function Read(): ReactElement {
  const { id } = useParams()
  const [loaded, setLoaded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [donateStatus, setDonateStatus] = useState<DonateStatus>(
    DonateStatus.Idle,
  )

  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorJS>()

  const { data, loading, error } = useApi<IPost & FetchData>(
    '/blog/one/' + id,
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

  return (
    <div className='max-w-[42.5rem] mx-auto'>
      <GoBack/>
      <h1 className='text-5xl font-black block mt-16'>
        {data.title}
      </h1>
      <div className='flex items-center gap-2'>
        <img
          className='rounded-full aspect-sqaure object-cover object-center w-16'
          src={API_ENDPOINT + '/auth/profile/' + data.author.id}
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
              {new Date(data.createdAt || '').toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between border-y-2 border-gray-200 my-6 py-2'>
        <div className='flex items-center gap-6'>
          <button className='flex items-center gap-1 bg-white text-gray-600 border-none'>
            <HandsClapping size={20} />
            <span className='text-md'>
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
      <img src={API_ENDPOINT + data.mainImage} className='w-full' />
      <div className='font-sans' ref={editorContainerRef} />
    </div>
  )
}
