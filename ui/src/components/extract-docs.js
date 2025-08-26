const fs = require("fs")
const path = require("path")
const { parse } = require("@babel/parser")
const traverse = require("@babel/traverse").default

const COMPONENTS_DIR = path.join(__dirname, "./")
const OUTPUT_FILE = path.join(__dirname, "README.md")

function extractCommentsAndProps(filePath) {
  const content = fs.readFileSync(filePath, "utf-8")
  const comments = []
  const props = []

  // Extract comments and props using Babel parser
  const ast = parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  })

  traverse(ast, {
    enter(path) {
      if (path.node.leadingComments) {
        path.node.leadingComments.forEach((comment) => {
          comments.push(comment.value.trim())
        })
      }

      if (
        path.isObjectProperty() &&
        path.node.key.name === "props" &&
        path.node.value.type === "ObjectExpression"
      ) {
        path.node.value.properties.forEach((prop) => {
          props.push(prop.key.name)
        })
      }
    },
  })

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
        markdown += `- ${comment}\n`
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
