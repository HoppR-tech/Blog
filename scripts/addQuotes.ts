import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const blogsDir = join(process.cwd(), 'content/blogs')

function processMarkdownFile(filePath: string) {
    const content = readFileSync(filePath, 'utf-8')
    
    // Remplacer les guillemets simples par des guillemets français
    const updatedContent = content
        .replace(/'([^']+)'/g, '« $1 »')
        .replace(/"([^"]+)"/g, '« $1 »')

    writeFileSync(filePath, updatedContent)
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
