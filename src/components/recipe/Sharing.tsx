import {
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaRedditAlien,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa'
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { API_ENDPOINT } from '../../constants/api'

export const Sharing = ({
  id,
  disableSharing,
}: {
  id: number | string
  disableSharing?: boolean
}) => {
  const attr = {
    url: window.location.href,
    onClick: disableSharing
      ? undefined
      : async () => {
          try {
            const data = await fetch(API_ENDPOINT + '/recipe/share/' + id, {
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
    <div className="flex items-center gap-5 flex-wrap text-3xl ml-5 my-auto justify-center">
      <FacebookShareButton {...attr}>
        <FaFacebookF size={20} className="text-button" />
      </FacebookShareButton>
      <TwitterShareButton {...attr}>
        <FaTwitter size={20} className="text-button" />
      </TwitterShareButton>
      <LinkedinShareButton {...attr}>
        <FaLinkedinIn size={20} className="text-button" />
      </LinkedinShareButton>
      <RedditShareButton {...attr}>
        <FaRedditAlien size={20} className="text-button" />
      </RedditShareButton>
      <WhatsappShareButton {...attr}>
        <FaWhatsapp size={20} className="text-button" />
      </WhatsappShareButton>
      <EmailShareButton {...attr}>
        <FaEnvelope size={20} className="text-button" />
      </EmailShareButton>
    </div>
  )
}
