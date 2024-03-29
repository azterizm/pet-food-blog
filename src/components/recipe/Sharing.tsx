import { IRecipe } from '@backend/models/recipe'
import {
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa'
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { API_ENDPOINT } from '../../constants/api'

export const Sharing = ({
  disableSharing,
  data,
  contentType,
}: {
  disableSharing?: boolean
  data: Pick<IRecipe, 'title' | 'mainImage' | 'tags' | 'id'>
  contentType: 'recipe' | 'post'
}) => {
  async function onBeforeOnClick(platform: string) {
    if (disableSharing) return
    try {
      await fetch(`${API_ENDPOINT}/share/${contentType}/${data.id}`, {
        credentials: 'include',
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ platform }),
      })
        .then((r) => r.text())
        .catch((_) => null)
    } catch (error) {
      console.error(error)
    }
  }

  const attr = {
    url: window.location.href,
    quote: data.title,
    title: data.title,
    source: window.location.href,
    media: API_ENDPOINT + data.mainImage,
    hashtags: data.tags.map((r) => '#' + r),
    subject: 'You got to see this website for dog recipes and articles',
    body: 'Hey! Check out this amazing website for dog recipes and articles: ' +
      window.location.href,
  }
  return (
    <div className='flex items-center gap-5 flex-wrap text-3xl ml-5 my-auto justify-center'>
      <FacebookShareButton
        {...attr}
        beforeOnClick={() => onBeforeOnClick('facebook')}
      >
        <FaFacebookF size={20} className='text-button' />
      </FacebookShareButton>
      <PinterestShareButton
        {...attr}
        beforeOnClick={() => onBeforeOnClick('pinterest')}
      >
        <FaPinterestP size={20} className='text-button' />
      </PinterestShareButton>
      <TwitterShareButton
        {...attr}
        beforeOnClick={() => onBeforeOnClick('twitter')}
      >
        <FaTwitter size={20} className='text-button' />
      </TwitterShareButton>
      <LinkedinShareButton
        {...attr}
        beforeOnClick={() => onBeforeOnClick('linkedin')}
      >
        <FaLinkedinIn size={20} className='text-button' />
      </LinkedinShareButton>
      <RedditShareButton
        {...attr}
        beforeOnClick={() => onBeforeOnClick('reddit')}
      >
        <FaRedditAlien size={20} className='text-button' />
      </RedditShareButton>
      <WhatsappShareButton
        {...attr}
        beforeOnClick={() => onBeforeOnClick('whatsapp')}
      >
        <FaWhatsapp size={20} className='text-button' />
      </WhatsappShareButton>
      <EmailShareButton
        {...attr}
        beforeOnClick={() => onBeforeOnClick('email')}
      >
        <FaEnvelope size={20} className='text-button' />
      </EmailShareButton>
    </div>
  )
}
