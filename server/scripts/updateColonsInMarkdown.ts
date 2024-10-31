import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const CONTENT_DIR = 'content/blogs'

function updateMarkdownFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8')
  
  // Mise à jour du frontmatter
  let updatedContent = content

  // Liste des champs à traiter
  const fields = ['title', 'description', 'alt']
  
  for (const field of fields) {
    // Ajoute des guillemets si absents et met à jour les deux-points
    updatedContent = updatedContent.replace(
      new RegExp(`(${field}:\\s*)(["']?)(.*?)(["']?)\\s*$`, 'gm'),
      (match, prefix, openQuote, value, closeQuote) => {
        const updatedValue = value.replace(/\s*:\s*/g, '\u00A0: ')
        return `${prefix}"${updatedValue}"`
      }
    )
  }

  // Mise à jour du contenu principal (après le frontmatter)
  const finalContent = updatedContent.replace(
    /^(---\n[\s\S]*?---\n\n)([\s\S]*?)$/,
    (match, frontmatter, mainContent) => {
      const updatedMainContent = mainContent.replace(/(?<!http)(?<!https)\s*:\s*/g, '\u00A0: ')
      return `${frontmatter}${updatedMainContent}`
    }
  )

  writeFileSync(filePath, finalContent)
  console.log(`Updated: ${filePath}`)
}

function processAllMarkdownFiles() {
  const dirs = readdirSync(CONTENT_DIR)
  
  for (const dir of dirs) {
    const mdFile = join(CONTENT_DIR, dir, 'index.md')
    try {
      updateMarkdownFile(mdFile)
    } catch (error) {
      console.error(`Error processing ${mdFile}:`, error)
    }
  }
}

// Exécuter le script
processAllMarkdownFiles()
