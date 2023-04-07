import {
  FaFacebookF,
  FaPinterestP,
  FaInstagram,
  FaLinkedinIn,
  FaMediumM,
  FaRedditAlien,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
  FaTwitter,
} from 'react-icons/fa'
import type { ReactElement, RefAttributes } from 'react'
import { IconProps } from 'phosphor-react'

export interface RenderIconByNameProps
  extends IconProps,
    RefAttributes<SVGSVGElement> {
  name: string
}

const Icons = {
  FacebookLogo: FaFacebookF,
  InstagramLogo: FaInstagram,
  LinkedinLogo: FaLinkedinIn,
  MediumLogo: FaMediumM,
  PinterestLogo: FaPinterestP,
  RedditLogo: FaRedditAlien,
  SnapchatLogo: FaSnapchatGhost,
  TiktokLogo: FaTiktok,
  TwitterLogo: FaTwitter,
  YoutubeLogo: FaYoutube,
}

export function RenderIconByName(props: RenderIconByNameProps): ReactElement {
  const Component = (Icons as any)[props.name]
  return <Component {...props} />
}
