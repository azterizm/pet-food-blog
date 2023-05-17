import { IAuthor } from '@backend/models/author'
import { ILike } from '@backend/models/like'
import { IPost } from '@backend/models/post'
import { ReactElement, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hero } from '../../components/home/Hero'
import { Loader } from '../../components/Loader'
import { Donate } from '../../components/recipe/Donate'
import { HelpSection } from '../../components/recipe/HelpSection'
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
  const [likes, setLikes] = useState(0)
  const [donateStatus, setDonateStatus] = useState<DonateStatus>(
    DonateStatus.Idle
  )

  const navigate = useNavigate()

  const { data, loading, error } = useApi<IPost & FetchData>(
    '/blog/one/' + id,
    {
      onSuccess: (r) => {
        const d: FetchData = data || r
        if (d && !loaded) {
          setLiked(d.userLiked)
          setLikes(d.likes.length)
          setLoaded(true)
        }
      },
    },
    [id]
  )

  async function onLike() {
    if (!id) return navigate('/login')
    const data: ApiProcess = await fetch(API_ENDPOINT + '/blog/like/' + id, {
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
    if (data.error) {
      setLiked(!liked)
      alert(data.info)
      return
    }
    if (!liked) {
      setLikes((e) => e + 1)
      setLiked(true)
    } else {
      setLikes((e) => e - 1)
      setLiked(false)
    }
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
      <div className="flex-center absolute-center">
        <span className="c-red">{error}</span>
      </div>
    )

  return (
    <div>
      <Hero
        image={API_ENDPOINT + data.mainImage}
        publishedOn={data.createdAt!}
        title={data.title}
        author={data.author}
      />
      <article className="mt-20">
        <p>{data.intro}</p>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />

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
