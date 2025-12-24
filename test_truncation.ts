
import { describe, it, expect } from 'vitest'

function generateDescription(content: string): string {
  return content.replace(/#.*\n/g, '').replace(/\n/g, ' ').substring(0, 200)
}

function smartGenerateDescription(content: string): string {
  let cleaned = content.replace(/#.*\n/g, '').replace(/\n/g, ' ');
  const limit = 200;
  
  if (cleaned.length <= limit) return cleaned;
  
  // Find all links
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  let cutIndex = limit;
  
  while ((match = linkRegex.exec(cleaned)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      
      // If the link overlaps the cut point (starts before, ends after)
      if (start < limit && end > limit) {
          cutIndex = end;
          break; // Found the overlapping link, extend and stop
      }
  }
  
  return cleaned.substring(0, cutIndex);
}

describe('generateDescription', () => {
    it('truncates text at 200 chars', () => {
        const longText = 'a'.repeat(300);
        expect(generateDescription(longText).length).toBe(200);
    });

    it('breaks markdown links with naive truncation', () => {
        const prefix = 'a'.repeat(190);
        const link = '[label](https://example.com)';
        const text = prefix + link;
        // 190 + 28 = 218 chars. Cut at 200 breaks it.
        const result = generateDescription(text);
        expect(result).not.toContain(')');
        expect(result).toContain('[label](ht');
    });
});

describe('smartGenerateDescription', () => {
    it('extends truncation to include full markdown link', () => {
        const prefix = 'a'.repeat(190);
        const link = '[label](https://example.com)';
        const text = prefix + link;
        
        const result = smartGenerateDescription(text);
        expect(result).toContain(link);
        expect(result.length).toBeGreaterThan(200);
    });

    it('does not extend if no link is split', () => {
        const prefix = 'a'.repeat(210);
        const result = smartGenerateDescription(prefix);
        expect(result.length).toBe(200);
    });
});
