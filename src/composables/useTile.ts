import { computed } from "vue"
import { useRuntimeConfig } from "#imports"

export function useTile(tile: any) {
  const imageUrl = computed(() => {
    const p = tile?.value || tile?.picture || tile
    if (!p) return ""
    const pic = p.picture || p
    let url = pic.url || pic.formats?.thumbnail?.url || ""
    return url || ""
  })
  return { imageUrl }
}
