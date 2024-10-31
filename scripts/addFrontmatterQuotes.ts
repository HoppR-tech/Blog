import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import yaml from 'yaml'

const blogsDir = join(process.cwd(), 'content/blogs')

function processMarkdownFile(filePath: string) {
    const content = readFileSync(filePath, 'utf-8')
    
    // Séparer le frontmatter du contenu
    const parts = content.split(/---\n/)
    if (parts.length < 3) {
        console.warn(`Skipping ${filePath}: No valid frontmatter found`)
        return
    }

    const [_, frontmatterYaml, ...contentParts] = parts
    const mainContent = contentParts.join('---\n')

    try {
        // Parser le frontmatter YAML
        const frontmatterObj = yaml.parse(frontmatterYaml)

        // Ajouter des guillemets aux champs spécifiés s'ils existent
        const fieldsToQuote = ['title', 'description', 'alt']
        fieldsToQuote.forEach(field => {
            if (frontmatterObj[field]) {
                frontmatterObj[field] = `"${frontmatterObj[field]}"`
            }
        })

        // Reconvertir en YAML
        const updatedFrontmatter = yaml.stringify(frontmatterObj)

        // Reconstruire le fichier
        const newContent = `---\n${updatedFrontmatter}---\n${mainContent}`
        
        writeFileSync(filePath, newContent)
        console.log(`Processed: ${filePath}`)
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error)
    }
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
