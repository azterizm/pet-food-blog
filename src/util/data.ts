export function stripHTMLTags(arg: string) {
  return arg.replace(/<\/?[^>]+(>|$)/g, '')
}
