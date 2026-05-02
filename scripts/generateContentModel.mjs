import fs from 'node:fs'
import path from 'node:path'

const projectRoot = '/Users/atulpal/Downloads/CodeUntil/DSA/DSA_Pattern_Recognition'
const sourcePath = path.join(projectRoot, 'public', 'legacy-content.html')
const outputPath = path.join(projectRoot, 'src', 'contentModel.js')

const html = fs.readFileSync(sourcePath, 'utf8')

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i)
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i)

if (!styleMatch || !bodyMatch) {
  throw new Error('Could not extract style/body from legacy content')
}

const legacyStyles = styleMatch[1]
const bodyHtml = bodyMatch[1]

const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

function parseAttributes(rawAttrs) {
  const attrs = {}
  const attrRegex = /([^\s=]+)(?:="([^"]*)")?/g
  let match = attrRegex.exec(rawAttrs)
  while (match) {
    const name = match[1]
    const value = match[2] ?? ''
    attrs[name] = value
    match = attrRegex.exec(rawAttrs)
  }
  return attrs
}

function parseHtmlToTree(source) {
  const root = { type: 'element', tag: 'root', attrs: {}, children: [] }
  const stack = [root]
  const tokenRegex = /<!--[\s\S]*?-->|<\/?[a-zA-Z0-9:-]+(?:\s[^<>]*?)?>|[^<]+/g

  let tokenMatch = tokenRegex.exec(source)
  while (tokenMatch) {
    const token = tokenMatch[0]

    if (token.startsWith('<!--')) {
      tokenMatch = tokenRegex.exec(source)
      continue
    }

    if (token.startsWith('</')) {
      const tagName = token.slice(2, -1).trim().toLowerCase()
      while (stack.length > 1) {
        const top = stack.pop()
        if (top.tag === tagName) {
          break
        }
      }
      tokenMatch = tokenRegex.exec(source)
      continue
    }

    if (token.startsWith('<')) {
      const openingMatch = token.match(/^<([a-zA-Z0-9:-]+)\s*([^>]*)>$/)
      if (!openingMatch) {
        tokenMatch = tokenRegex.exec(source)
        continue
      }
      const tagName = openingMatch[1].toLowerCase()
      let rawAttrs = openingMatch[2] ?? ''
      const selfClosing = rawAttrs.endsWith('/') || voidTags.has(tagName)
      if (rawAttrs.endsWith('/')) {
        rawAttrs = rawAttrs.slice(0, -1).trim()
      }

      const node = {
        type: 'element',
        tag: tagName,
        attrs: parseAttributes(rawAttrs),
        children: [],
      }
      stack[stack.length - 1].children.push(node)
      if (!selfClosing) {
        stack.push(node)
      }
      tokenMatch = tokenRegex.exec(source)
      continue
    }

    if (!/^\s+$/.test(token)) {
      stack[stack.length - 1].children.push({ type: 'text', text: token })
    }

    tokenMatch = tokenRegex.exec(source)
  }

  return root.children
}

const legacyTree = parseHtmlToTree(bodyHtml)

const modelSource = `export const legacyStyles = ${JSON.stringify(legacyStyles)};\n\nexport const legacyTree = ${JSON.stringify(legacyTree)};\n`
fs.writeFileSync(outputPath, modelSource)

console.log(`Generated content model at ${outputPath}`)
