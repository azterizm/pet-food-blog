export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || ('' as string)
export const CREATOR_ENDPOINT =
  import.meta.env.VITE_CREATOR_ENDPOINT || ('' as string)
export const PAGE_OFFSET = 20
export const AuthorSortValues = ['new', 'popular', 'liked'] as const
