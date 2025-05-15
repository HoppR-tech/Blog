import process from 'node:process'
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const config = useRuntimeConfig()

export const GITHUB_OWNER = process.env.GITHUB_OWNER || config.github.owner || 'HoppR-tech'
export const GITHUB_REPO = process.env.GITHUB_REPO || config.github.repo || 'blog'

/**
 * Détecte la branche Git courante
 *
 * @returns Le nom de la branche courante ou null si non détectable
 */
function getCurrentGitBranch(): string | null {
  try {
    // Vérifie si nous sommes dans un dépôt Git
    const rootDir = process.cwd()
    if (!existsSync(join(rootDir, '.git'))) {
      console.log('Not in a Git repository, using default branch')
      return null
    }

    // Exécute la commande git pour obtenir la branche courante
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
    console.log(`Detected current Git branch: ${branch}`)
    return branch
  } catch (error) {
    console.error('Error detecting Git branch:', error)
    return null
  }
}

// Utilise la branche courante si elle est détectée, sinon utilise la valeur de configuration
const currentBranch = getCurrentGitBranch()
export const GITHUB_BRANCH = process.env.GITHUB_BRANCH ||
                             config.github.branch ||
                             (currentBranch && currentBranch !== 'HEAD' ? currentBranch : 'main')

// Log la branche utilisée pour le débogage
console.log(`Using GitHub branch: ${GITHUB_BRANCH} ${currentBranch ? '(detected from Git)' : '(from config)'}`)

export const GITHUB_APP_ID = Number(process.env.GITHUB_APP_ID) || Number(config.github.appId)
export const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY || config.github.privateKey as string

if (!GITHUB_APP_ID || !GITHUB_PRIVATE_KEY) {
  console.error('GITHUB_APP_ID and GITHUB_PRIVATE_KEY must be set')
  process.exit(1)
}
