import { computed } from "vue"

export function useTile(tile: any) {
  const base = useRuntimeConfig()?.public?.strapi?.url || ""
  const imageUrl = computed(() => {
    const p = tile?.value || tile?.picture || tile
    if (!p) return ""
    const pic = p.picture || p
    return base + (pic.url || pic.formats?.thumbnail?.url || "")
  })
  return { imageUrl }
}
