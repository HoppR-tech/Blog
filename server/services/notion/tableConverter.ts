/**
 * Module pour améliorer la conversion des tableaux Notion vers Markdown
 *
 * Ce module fournit des fonctions pour :
 * 1. Convertir les listes à puces dans les cellules des tableaux en HTML
 * 2. Formater les références techniques avec des backticks
 * 3. Assurer que les bordures et alignements des tableaux sont corrects
 */

import type { TableBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

/**
 * Convertit un bloc tableau Notion en Markdown amélioré
 *
 * @param tableBlock - Le bloc tableau Notion à convertir
 * @returns Le tableau formaté en Markdown avec des listes HTML et des références techniques correctement formatées
 */
export async function convertTableToMarkdown(tableBlock: TableBlockObjectResponse): Promise<string> {
  // Vérifier si le bloc tableau est valide
  if (!tableBlock || !tableBlock.table) {
    console.error('Invalid table block:', tableBlock);
    return '| | |\n| --- | --- |';
  }

  const { table } = tableBlock;
  const { has_column_header } = table;

  // Récupérer les données du tableau
  // Dans l'API Notion, les données du tableau peuvent être dans différentes propriétés
  // selon la version de l'API et le contexte
  let rows: any[] = [];

  // Essayer de récupérer les données du tableau depuis différentes propriétés possibles
  // Utiliser 'as any' pour contourner les vérifications de type TypeScript
  // car la structure exacte peut varier selon la version de l'API Notion
  if ((tableBlock.table as any).children && (tableBlock.table as any).children.length > 0) {
    rows = (tableBlock.table as any).children;
  } else if ((tableBlock as any).children && (tableBlock as any).children.length > 0) {
    rows = (tableBlock as any).children;
  } else {
    // Si aucune donnée n'est disponible, créer un tableau vide avec 2 colonnes
    const columnCount = (table as any).table_width || 2;

    // Créer un tableau vide avec le bon nombre de colonnes
    let emptyTable = '|';
    for (let i = 0; i < columnCount; i++) {
      emptyTable += ' |';
    }
    emptyTable += '\n|';

    // Ajouter la ligne de séparation
    for (let i = 0; i < columnCount; i++) {
      emptyTable += ' --- |';
    }

    return emptyTable;
  }

  // Si nous n'avons pas de lignes valides, retourner un tableau vide
  if (!rows || rows.length === 0 || !rows[0].cells) {
    console.warn('No valid rows found in table block:', tableBlock);
    return '| | |\n| --- | --- |';
  }

  // Construire l'en-tête du tableau
  const headerRow = rows[0];
  const columnCount = headerRow.cells.length;

  // Créer la première ligne du tableau (en-têtes)
  let markdownTable = '| ' + headerRow.cells.map((cell: string[]) => formatCellContent(cell)).join(' | ') + ' |\n';

  // Créer la ligne de séparation
  markdownTable += '| ' + Array(columnCount).fill('---').join(' | ') + ' |\n';

  // Ajouter les lignes de données (en sautant l'en-tête si nécessaire)
  const startIndex = has_column_header ? 1 : 0;
  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row && row.cells) {
      markdownTable += '| ' + row.cells.map((cell: string[]) => formatCellContent(cell)).join(' | ') + ' |\n';
    }
  }

  return markdownTable;
}

/**
 * Formate le contenu d'une cellule de tableau
 * - Convertit les listes à puces en HTML
 * - Formate les références techniques avec des backticks
 *
 * @param cell - Le contenu de la cellule à formater
 * @returns Le contenu formaté
 */
function formatCellContent(cell: string[]): string {
  // Si la cellule est vide, retourner une chaîne vide
  if (!cell || cell.length === 0) {
    return ''
  }

  // Joindre les éléments de la cellule
  const content = cell.join(' ')

  // Vérifier si la cellule contient une liste à puces
  if (content.includes('• ')) {
    return convertBulletListToHtml(content)
  }

  // Formater les références techniques
  return formatTechnicalReferences(content)
}

/**
 * Convertit une liste à puces en HTML
 *
 * @param content - Le contenu contenant une liste à puces
 * @returns La liste formatée en HTML
 */
function convertBulletListToHtml(content: string): string {
  // Diviser le contenu en lignes
  const lines = content.split('\n')

  // Vérifier si le contenu commence par une puce
  const startsWithBullet = lines[0].trim().startsWith('• ')

  // Si le contenu ne commence pas par une puce, il peut y avoir un texte avant la liste
  let prefix = ''
  let bulletLines = lines

  if (!startsWithBullet && lines.length > 1) {
    prefix = lines[0]
    bulletLines = lines.slice(1)
  }

  // Extraire les éléments de la liste
  const listItems = bulletLines
    .filter(line => line.trim().startsWith('• '))
    .map(line => line.trim().substring(2).trim())
    .map(item => formatTechnicalReferences(item))

  // Construire la liste HTML
  const htmlList = `<ul><li>${listItems.join('</li><li>')}</li></ul>`

  // Retourner le résultat final
  return prefix ? `${prefix} ${htmlList}` : htmlList
}

/**
 * Formate les références techniques avec des backticks
 *
 * @param text - Le texte contenant des références techniques
 * @returns Le texte avec les références techniques formatées
 */
function formatTechnicalReferences(text: string): string {
  // Liste des motifs de références techniques à entourer de backticks
  const patterns = [
    /\b(info\/[a-zA-Z_-]+)\b/g,                     // info/product_id, info/environment, etc.
    /\b(release\.mgmt\/[a-zA-Z_.-]+)\b/g,           // release.mgmt/deploy.src, release.mgmt/env, etc.
    /\b(dora_metrics\.[a-zA-Z_]+)\b/g,              // dora_metrics.deployments, dora_metrics.incidents, etc.
    /\b(environment\s*=\s*[a-zA-Z_]+)\b/g,          // environment=prod, etc.
    /\b(status\s*=\s*[a-zA-Z_"]+)\b/g,              // status="success", etc.
    /\b(is_config_only\s*=\s*[A-Z]+)\b/g            // is_config_only=TRUE, etc.
  ]

  let formattedText = text

  // Appliquer chaque motif
  patterns.forEach(pattern => {
    formattedText = formattedText.replace(pattern, (match) => {
      // Éviter de mettre des backticks si le texte en a déjà
      if (match.startsWith('`') && match.endsWith('`')) {
        return match
      }
      return '`' + match + '`'
    })
  })

  return formattedText
}

/**
 * Vérifie si un bloc est un tableau
 *
 * @param block - Le bloc à vérifier
 * @returns true si le bloc est un tableau, false sinon
 */
export function isTableBlock(block: any): boolean {
  return block && block.type === 'table'
}
