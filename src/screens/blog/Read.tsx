import { IAuthor } from '@backend/models/author'
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
  }, [editorContainerRef,  editorRef, data])

  function initEditor(data?: OutputData) {
    if (!editorContainerRef.current) return

    const editor = new EditorJS({
      holder: editorContainerRef.current,
      tools: {
        header: Header,
        quote: Quote,
        delimiter: Delimiter,
        underline: Underline,
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
  else if (!data || error)
    return (
      <div className='flex-center absolute-center'>
        <span className='c-red'>{error}</span>
      </div>
    )

  return (
    <div>
      <Hero
        image={API_ENDPOINT + data.mainImage}
        publishedOn={data.createdAt!}
        title={decodeURIComponent(data.title)}
        author={data.author}
        tags={data.tags}
      />
      <LikeSection blog liked={liked} onLike={setLiked}/>
      <article className='mt-20'>
      <div className='font-sans' ref={editorContainerRef} />
        <Donate
          name={data.author.name}
          status={donateStatus}
          onReset={() => setDonateStatus(DonateStatus.Idle)}
          onDonate={onDonate}
        />
      </article>
    </div>
  )
}
