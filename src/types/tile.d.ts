export type Tile = {
  id?: number
  title?: string
  content?: string
  link?: string
  link_target_type?: string
  picture?: {
    url?: string
    formats?: Record<string, { url?: string }>
  }
  // extend with other fields you use
}
