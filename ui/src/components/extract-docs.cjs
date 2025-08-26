const fs = require("fs")
const path = require("path")
const { parse } = require("@vue/compiler-sfc")

const COMPONENTS_DIR = path.join(__dirname, "./")
const OUTPUT_FILE = path.join(__dirname, "README.md")

function cleanComment(comment) {
  return comment
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trim())
    .join("\n")
}

function extractCommentsAndProps(filePath) {
  const content = fs.readFileSync(filePath, "utf-8")
  const { descriptor } = parse(content)

  const comments = []
  const props = []

  // Extract comments from the script or script setup block
  const scriptContent =
    descriptor.scriptSetup?.content || descriptor.script?.content
  if (scriptContent) {
    const commentRegex = /\/\*\*([\s\S]*?)\*\//g
    let match
    while ((match = commentRegex.exec(scriptContent)) !== null) {
      comments.push(cleanComment(match[1].trim()))
    }

    // Extract props from the script setup block
    const propsRegex = /defineProps\(([^)]*)\)/g
    const propsMatch = propsRegex.exec(scriptContent)
    if (propsMatch) {
      const propsContent = propsMatch[1]
      const propNames = propsContent.match(/['"`][\w-]+['"`]/g)
      if (propNames) {
        propNames.forEach((prop) => {
          props.push(prop.replace(/['"`]/g, ""))
        })
      }
    }
  }

  return { comments, props }
}

function generateDocs() {
  const files = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((file) => file.endsWith(".vue"))
  let markdown = "# Component Documentation\n\n"

  files.forEach((file) => {
    const filePath = path.join(COMPONENTS_DIR, file)
    const { comments, props } = extractCommentsAndProps(filePath)

    markdown += `## ${file}\n\n`
    if (comments.length > 0) {
      markdown += "### Description\n"
      comments.forEach((comment) => {
        markdown += `- ${comment.split("\n").join("\n  ")}\n`
      })
    }

    if (props.length > 0) {
      markdown += "\n### Props\n"
      props.forEach((prop) => {
        markdown += `- ${prop}\n`
      })
    }

    markdown += "\n"
  })

  fs.writeFileSync(OUTPUT_FILE, markdown, "utf-8")
  console.log(`Documentation written to ${OUTPUT_FILE}`)
}

generateDocs()
