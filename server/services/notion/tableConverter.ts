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
  if (!isValidTableBlock(tableBlock)) {
    return createEmptyTable();
  }

  const rows = extractTableRows(tableBlock);
  if (!rows || rows.length === 0) {
    return createEmptyTable();
  }

  const { has_column_header } = tableBlock.table;
  return createMarkdownTable(rows, has_column_header);
}

function isValidTableBlock(tableBlock: TableBlockObjectResponse): boolean {
  if (!tableBlock || !tableBlock.table) {
    console.error('Invalid table block:', tableBlock);
    return false;
  }
  return true;
}

function createEmptyTable(): string {
  return '| | |\n| --- | --- |';
}

function extractTableRows(tableBlock: TableBlockObjectResponse): any[] {
  let rows: any[] = [];

  if ((tableBlock.table as any).children && (tableBlock.table as any).children.length > 0) {
    rows = (tableBlock.table as any).children;
    console.log(`Utilisation des données de table.children avec ${rows.length} lignes`);
  } else if ((tableBlock as any).children && (tableBlock as any).children.length > 0) {
    rows = (tableBlock as any).children;
    console.log(`Utilisation des données de block.children avec ${rows.length} lignes`);
  } else {
    console.log('Aucune donnée de tableau trouvée');
    return [];
  }

  return adaptRowStructure(rows);
}

function adaptRowStructure(rows: any[]): any[] {
  if (!rows[0].cells) {
    console.warn('No cells property found in rows. Trying to adapt structure...');
    if (rows[0].table_row && Array.isArray(rows[0].table_row.cells)) {
      console.log('Adapting structure from table_row format');
      return rows.map((row: any) => ({
        cells: row.table_row?.cells || []
      }));
    } else {
      console.warn('Unable to adapt row structure:', rows[0]);
      return [];
    }
  }
  return rows;
}

function createMarkdownTable(rows: any[], hasColumnHeader: boolean): string {
  const headerRow = rows[0];
  const columnCount = headerRow.cells.length;

  let markdownTable = createTableHeader(headerRow, columnCount);
  markdownTable += createTableRows(rows, hasColumnHeader);

  return markdownTable;
}

function createTableHeader(headerRow: any, columnCount: number): string {
  let header = '| ' + headerRow.cells.map((cell: string[]) => formatCellContent(cell)).join(' | ') + ' |\n';
  header += '| ' + Array(columnCount).fill('---').join(' | ') + ' |\n';
  return header;
}

function createTableRows(rows: any[], hasColumnHeader: boolean): string {
  const startIndex = hasColumnHeader ? 1 : 0;
  let tableRows = '';
  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row && row.cells) {
      tableRows += '| ' + row.cells.map((cell: string[]) => formatCellContent(cell)).join(' | ') + ' |\n';
    }
  }
  return tableRows;
}

/**
 * Formate le contenu d'une cellule de tableau
 *
 * @param cell - Le contenu de la cellule à formater
 * @returns Le contenu formaté
 */
function formatCellContent(cell: any[]): string {
  if (!cell || cell.length === 0) {
    return '';
  }

  // Extract text content from cell, handling rich text objects
  const content = extractTextFromCell(cell);

  return content.includes('• ') ? convertBulletListToHtml(content) : formatTechnicalReferences(content);
}

/**
 * Extrait le texte d'une cellule, en gérant les objets rich text de Notion
 *
 * @param cell - Le contenu de la cellule (peut être un tableau de chaînes ou d'objets rich text)
 * @returns Le texte extrait
 */
function extractTextFromCell(cell: any[]): string {
  return cell.map(item => {
    // Handle rich text objects from Notion API
    if (item && typeof item === 'object') {
      // If it's a rich text object with plain_text property
      if (item.plain_text) {
        return item.plain_text;
      }

      // If it's a rich text object with text.content property
      if (item.text && item.text.content) {
        return item.text.content;
      }

      // If it has a toString method, use it (fallback)
      return String(item);
    }

    // If it's already a string, return it directly
    return item;
  }).join(' ');
}

/**
 * Convertit une liste à puces en HTML
 *
 * @param content - Le contenu contenant une liste à puces
 * @returns La liste formatée en HTML
 */
function convertBulletListToHtml(content: string): string {
  const lines = content.split('\n');
  const { prefix, bulletLines } = extractPrefixAndBulletLines(lines);
  const listItems = createListItems(bulletLines);
  const htmlList = `<ul><li>${listItems.join('</li><li>')}</li></ul>`;
  return prefix ? `${prefix} ${htmlList}` : htmlList;
}

function extractPrefixAndBulletLines(lines: string[]): { prefix: string, bulletLines: string[] } {
  const startsWithBullet = lines[0].trim().startsWith('• ');
  if (!startsWithBullet && lines.length > 1) {
    return { prefix: lines[0], bulletLines: lines.slice(1) };
  }
  return { prefix: '', bulletLines: lines };
}

function createListItems(bulletLines: string[]): string[] {
  return bulletLines
    .filter(line => line.trim().startsWith('• '))
    .map(line => line.trim().substring(2).trim())
    .map(item => formatTechnicalReferences(item));
}

/**
 * Formate les références techniques avec des backticks
 *
 * @param text - Le texte contenant des références techniques
 * @returns Le texte avec les références techniques formatées
 */
function formatTechnicalReferences(text: string): string {
  const patterns = [
    /\b(info\/[a-zA-Z_-]+)\b/g,
    /\b(release\.mgmt\/[a-zA-Z_.-]+)\b/g,
    /\b(dora_metrics\.[a-zA-Z_]+)\b/g,
    /\b(environment\s*=\s*[a-zA-Z_]+)\b/g,
    /\b(status\s*=\s*[a-zA-Z_"]+)\b/g,
    /\b(is_config_only\s*=\s*[A-Z]+)\b/g
  ];

  return patterns.reduce((formattedText, pattern) => {
    return formattedText.replace(pattern, (match) => {
      return match.startsWith('`') && match.endsWith('`') ? match : `\`${match}\``;
    });
  }, text);
}

/**
 * Vérifie si un bloc est un tableau
 *
 * @param block - Le bloc à vérifier
 * @returns true si le bloc est un tableau, false sinon
 */
export function isTableBlock(block: any): boolean {
  return block && block.type === 'table';
}
