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
import { stripHTML } from '../../util/seo'

export const Sharing = ({
  disableSharing,
  recipe,
}: {
  disableSharing?: boolean
  recipe: Pick<IRecipe, 'title' | 'mainImage' | 'intro' | 'tags' | 'id'>
}) => {
  const attr = {
    url: window.location.href,
    quote: recipe.title,
    title: recipe.title,
    summary: stripHTML(recipe.intro),
    source: window.location.href,
    media: API_ENDPOINT + recipe.mainImage,
    hashtags: recipe.tags.map((r) => '#' + r),
    subject: 'You got to see this website for dog recipes',
    body:
      'Hey! Check out this amazing website for dog recipes: ' +
      window.location.href,
    beforeOnClick: disableSharing
      ? undefined
      : async () => {
          try {
            await fetch(API_ENDPOINT + '/recipe/share/' + recipe.id, {
              credentials: 'include',
              method: 'post',
            })
              .then((r) => r.text())
              .catch((_) => null)
          } catch (error) {
            console.error(error)
          }
        },
  }
  return (
    <div className='flex items-center gap-5 flex-wrap text-3xl ml-5 my-auto justify-center'>
      <FacebookShareButton {...attr}>
        <FaFacebookF size={20} className='text-button' />
      </FacebookShareButton>
      <PinterestShareButton {...attr}>
        <FaPinterestP size={20} className='text-button' />
      </PinterestShareButton>
      <TwitterShareButton {...attr}>
        <FaTwitter size={20} className='text-button' />
      </TwitterShareButton>
      <LinkedinShareButton {...attr}>
        <FaLinkedinIn size={20} className='text-button' />
      </LinkedinShareButton>
      <RedditShareButton {...attr}>
        <FaRedditAlien size={20} className='text-button' />
      </RedditShareButton>
      <WhatsappShareButton {...attr}>
        <FaWhatsapp size={20} className='text-button' />
      </WhatsappShareButton>
      <EmailShareButton {...attr}>
        <FaEnvelope size={20} className='text-button' />
      </EmailShareButton>
    </div>
  )
}
