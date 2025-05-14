import { describe, expect, it } from 'vitest'
import { convertTableToMarkdown, isTableBlock } from './tableConverter'
import type { TableBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

describe('tableConverter', () => {
  it('should convert a simple table to markdown', async () => {
    const tableBlock = buildTableBlock([
      [['Header 1'], ['Header 2']],
      [['Cell 1'], ['Cell 2']],
      [['Cell 3'], ['Cell 4']]
    ])
    
    const markdown = await convertTableToMarkdown(tableBlock)
    
    expect(markdown).toContain('| Header 1 | Header 2 |')
    expect(markdown).toContain('| --- | --- |')
    expect(markdown).toContain('| Cell 1 | Cell 2 |')
    expect(markdown).toContain('| Cell 3 | Cell 4 |')
  })
  
  it('should convert a table with bullet lists to markdown with HTML lists', async () => {
    const tableBlock = buildTableBlock([
      [['Header 1'], ['Header 2']],
      [['Cell 1'], ['• Item 1\n• Item 2\n• Item 3']],
      [['Cell 3'], ['Regular text']]
    ])
    
    const markdown = await convertTableToMarkdown(tableBlock)
    
    expect(markdown).toContain('| Header 1 | Header 2 |')
    expect(markdown).toContain('| --- | --- |')
    expect(markdown).toContain('| Cell 1 | <ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul> |')
    expect(markdown).toContain('| Cell 3 | Regular text |')
  })
  
  it('should format technical references with backticks', async () => {
    const tableBlock = buildTableBlock([
      [['Header 1'], ['Header 2']],
      [['info/product_id'], ['release.mgmt/deploy.src']],
      [['dora_metrics.deployments'], ['environment=prod']]
    ])
    
    const markdown = await convertTableToMarkdown(tableBlock)
    
    expect(markdown).toContain('| `info/product_id` | `release.mgmt/deploy.src` |')
    expect(markdown).toContain('| `dora_metrics.deployments` | `environment=prod` |')
  })
  
  it('should format technical references in bullet lists', async () => {
    const tableBlock = buildTableBlock([
      [['Header 1'], ['Header 2']],
      [['Cell 1'], ['• info/product_id : identifiant\n• release.mgmt/deploy.src : URL\n• environment=prod : environnement']]
    ])
    
    const markdown = await convertTableToMarkdown(tableBlock)
    
    expect(markdown).toContain('<ul><li>`info/product_id` : identifiant</li><li>`release.mgmt/deploy.src` : URL</li><li>`environment=prod` : environnement</li></ul>')
  })
  
  it('should handle empty tables', async () => {
    const tableBlock = buildTableBlock([])
    
    const markdown = await convertTableToMarkdown(tableBlock)
    
    expect(markdown).toBe('| | |\n| --- | --- |')
  })
  
  it('should correctly identify table blocks', () => {
    expect(isTableBlock({ type: 'table' })).toBe(true)
    expect(isTableBlock({ type: 'paragraph' })).toBe(false)
    expect(isTableBlock(null)).toBe(false)
  })
})

function buildTableBlock(rows: string[][][]): TableBlockObjectResponse {
  return {
    id: 'test-table',
    type: 'table',
    table: {
      has_column_header: true,
      has_row_header: false,
      children: rows.map(row => ({
        cells: row
      }))
    }
  } as TableBlockObjectResponse
}
