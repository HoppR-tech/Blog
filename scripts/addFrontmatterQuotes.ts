import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const blogsDir = join(process.cwd(), 'content/blogs')

function processMarkdownFile(filePath: string) {
    const content = readFileSync(filePath, 'utf-8')
    
    // Séparer le frontmatter du contenu
    const parts = content.split(/---\n/)
    if (parts.length < 3) {
        console.warn(`Skipping ${filePath}: No valid frontmatter found`)
        return
    }

    const [_, frontmatter, ...contentParts] = parts
    const mainContent = contentParts.join('---\n')

    // Ajouter des guillemets aux champs spécifiés et échapper les guillemets existants
    const updatedFrontmatter = frontmatter
        .replace(/^(title:\s*)(.+)$/m, (_, prefix, content) => `${prefix}"${content.replace(/"/g, '\\"')}"`)
        .replace(/^(description:\s*)(.+)$/m, (_, prefix, content) => `${prefix}"${content.replace(/"/g, '\\"')}"`)
        .replace(/^(alt:\s*)(.+)$/m, (_, prefix, content) => `${prefix}"${content.replace(/"/g, '\\"')}"`)

    // Reconstruire le fichier
    const newContent = `---\n${updatedFrontmatter}---\n${mainContent}`
    
    writeFileSync(filePath, newContent)
    console.log(`Processed: ${filePath}`)
}

function processAllMarkdownFiles() {
    const files = readdirSync(blogsDir, { recursive: true })
    files.forEach((file) => {
        if (typeof file === 'string' && file.endsWith('.md')) {
            const filePath = join(blogsDir, file)
            processMarkdownFile(filePath)
        }
    })
}

processAllMarkdownFiles()
