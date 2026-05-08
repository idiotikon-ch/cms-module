import markdownit from "markdown-it"

/**
 * Converts markdown text to plain text by rendering to HTML and extracting text content
 */
export function getMarkdownAsPlainText(mdText: string): string {
  const md = markdownit({ html: true })
  const rendered_html = md.render(mdText)
  const parser = new DOMParser()
  const parsed = parser.parseFromString(rendered_html, "text/html")
  return parsed.body?.innerText || parsed.body?.textContent || ""
}

/**
 * Extracts a plain text teaser from markdown content, truncated at word boundary
 * @param mdText - The markdown text to extract from
 * @param limit - Maximum character length for the teaser
 * @returns Truncated plain text with ellipsis
 */
export function getPlainTxtTeaser(mdText: string, limit: number = 180): string {
  const plainText = getMarkdownAsPlainText(mdText)

  if (plainText.length <= limit) {
    return plainText
  }

  const truncated = plainText.substring(0, limit)
  const lastSpace = truncated.lastIndexOf(" ")

  // If we found a space, truncate there; otherwise use the full limit
  const finalText =
    lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated

  return finalText + " …"
}
