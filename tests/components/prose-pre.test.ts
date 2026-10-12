import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { mockColorMode, mockMermaid, setupComponentTests, waitForRender } from './test-helpers'

const { mount } = await setupComponentTests()
const mermaid = mockMermaid()
mockColorMode({ value: 'dark' })
const { default: ProsePre } = await import('~/components/content/ProsePre.vue')
const { default: MermaidDiagram } = await import('~/components/blog/MermaidDiagram.vue')

const MERMAID_SOURCE = 'flowchart TD\n    PROD[Système en production] --> B1'

/** Renders a fenced code block the way Nuxt Content does: raw source in `code`, highlighted lines in the slot. */
function mountCodeBlock(language: string, code: string) {
  return mount(ProsePre, {
    props: { code, language },
    slots: { default: () => code },
    global: { components: { BlogMermaidDiagram: MermaidDiagram } },
  })
}

describe('ProsePre - mermaid code blocks (issue #117)', () => {
  beforeEach(() => {
    mermaid.render.mockClear()
  })

  it('should render a mermaid block as a diagram instead of code', async () => {
    // When: an article contains a ```mermaid block
    const wrapper = mountCodeBlock('mermaid', MERMAID_SOURCE)
    await waitForRender()

    // Then: the diagram is drawn and the source is not shown as code
    expect(mermaid.render.mock.calls[0]?.[1]).toBe(MERMAID_SOURCE)
    expect(wrapper.find('figure svg').exists()).toBe(true)
    expect(wrapper.find('.prose-pre-wrapper').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('flowchart TD')
  })

  it('should keep rendering other languages as code blocks', async () => {
    const wrapper = mountCodeBlock('ts', 'const answer = 42')
    await waitForRender()

    expect(mermaid.render).not.toHaveBeenCalled()
    expect(wrapper.find('.prose-pre-wrapper').exists()).toBe(true)
    expect(wrapper.find('.prose-pre-lang').text()).toBe('ts')
    expect(wrapper.find('pre').text()).toBe('const answer = 42')
  })

  it('should fall back to the code block with the diagram source when Mermaid cannot render it', async () => {
    // Given: a mermaid block Mermaid cannot parse
    mermaid.render.mockImplementationOnce(async () => {
      throw new Error('Parse error on line 2')
    })
    const warn = spyOn(console, 'warn').mockImplementation(() => {})

    // When: the block is rendered
    const wrapper = mountCodeBlock('mermaid', MERMAID_SOURCE)
    await waitForRender()

    // Then: the reader still gets the source, as a regular code block with its copy button
    expect(wrapper.find('figure').exists()).toBe(false)
    expect(wrapper.find('.prose-pre-lang').text()).toBe('mermaid')
    expect(wrapper.find('pre').text()).toBe(MERMAID_SOURCE)
    expect(wrapper.find('button').text()).toContain('Copier')
    warn.mockRestore()
  })
})
