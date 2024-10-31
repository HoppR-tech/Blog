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

    // Préserver le frontmatter et convertir uniquement le contenu
    const updatedContent = mainContent
        .replace(/'([^']+)'/g, '« $1 »')
        .replace(/"([^"]+)"/g, '« $1 »')

    // Reconstruire le fichier
    const newContent = `---\n${frontmatter}---\n${updatedContent}`
    
    writeFileSync(filePath, newContent)
    console.log(`Processed: ${filePath}`)
}

function processAllMarkdownFiles() {
    const dirs = readdirSync(blogsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    for (const dir of dirs) {
        const indexPath = join(blogsDir, dir, 'index.md')
        try {
            processMarkdownFile(indexPath)
        } catch (error) {
            console.error(`Error processing ${indexPath}:`, error)
        }
    }
}

processAllMarkdownFiles()
