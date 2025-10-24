import { computed } from "vue"
import { useRuntimeConfig } from "#imports"

export function useTile(tile: any) {
  const base = useRuntimeConfig()?.public?.strapi?.url || ""
  const imageUrl = computed(() => {
    const p = tile?.value || tile?.picture || tile
    if (!p) return ""
    const pic = p.picture || p
    let url = pic.url || pic.formats?.thumbnail?.url || ""
    if (!url) return ""
    // Only prepend base if url is relative
    if (/^https?:\/\//.test(url)) {
      return url
    }
    return base.replace(/\/$/, "") + url
  })
  return { imageUrl }
}
