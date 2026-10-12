import { beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { DIAGRAM_NATURAL_WIDTH, mockColorMode, mockMermaid, setupComponentTests, waitForRender } from './test-helpers'

const { mount } = await setupComponentTests()
const mermaid = mockMermaid()
const { defineComponent, h, reactive } = await import('vue')
const { default: MermaidDiagram } = await import('~/components/blog/MermaidDiagram.vue')

const colorMode = reactive<{ value: 'light' | 'dark' }>({ value: 'dark' })
mockColorMode(colorMode)

const CODE = 'flowchart LR\n    A[Feedback explicite<br/>👍 / 👎] --> B[Agrégation + seuil]'

function mountDiagram(code = CODE) {
  return mount(MermaidDiagram, { props: { code } })
}

describe('MermaidDiagram (issue #117)', () => {
  beforeEach(() => {
    colorMode.value = 'dark'
    mermaid.initialize.mockClear()
    mermaid.render.mockClear()
  })

  it('should show a loading placeholder until Mermaid has drawn the diagram', () => {
    const wrapper = mountDiagram()

    expect(wrapper.find('[role="status"]').text()).toBe('Chargement du diagramme…')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('should draw the block source as an SVG diagram', async () => {
    // When: a mermaid block is rendered
    const wrapper = mountDiagram()
    await waitForRender()

    // Then: Mermaid receives the source and its SVG replaces the placeholder
    expect(mermaid.render).toHaveBeenCalledTimes(1)
    expect(mermaid.render.mock.calls[0]?.[1]).toBe(CODE)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('should give each diagram a unique id usable as a CSS selector', async () => {
    // Given: two diagrams in the same article
    mount(defineComponent(() => () => [h(MermaidDiagram, { code: CODE }), h(MermaidDiagram, { code: CODE })]))
    await waitForRender()

    // Then: Mermaid scopes its styles with `#id`, so ids must be distinct and selector-safe
    const ids = mermaid.render.mock.calls.map(([id]) => id)
    expect(new Set(ids).size).toBe(2)
    for (const id of ids)
      expect(id).toMatch(/^mermaid-[\w-]+$/)
  })

  it('should render with the strict security level and without Mermaid\'s own error diagram', async () => {
    mountDiagram()
    await waitForRender()

    expect(mermaid.initialize).toHaveBeenCalledWith(expect.objectContaining({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
    }))
  })

  it.each([
    ['dark', 'dark'],
    ['light', 'default'],
  ] as const)('should use the matching Mermaid theme in %s mode', async (mode, theme) => {
    colorMode.value = mode

    mountDiagram()
    await waitForRender()

    expect(mermaid.initialize).toHaveBeenLastCalledWith(expect.objectContaining({ theme }))
  })

  it('should redraw the diagram with the new theme when the color mode changes', async () => {
    // Given: a diagram drawn in dark mode
    const wrapper = mountDiagram()
    await waitForRender()

    // When: the reader switches to light mode
    colorMode.value = 'light'
    await waitForRender()

    // Then: the diagram is drawn again, with the light theme and a fresh id
    expect(mermaid.render).toHaveBeenCalledTimes(2)
    expect(mermaid.initialize).toHaveBeenLastCalledWith(expect.objectContaining({ theme: 'default' }))
    const [firstId, secondId] = mermaid.render.mock.calls.map(([id]) => id)
    expect(secondId).not.toBe(firstId)
    expect(wrapper.find('svg').attributes('id')).toBe(secondId)
  })

  it('should never shrink a wide diagram below 60% of its natural width', async () => {
    const wrapper = mountDiagram()
    await waitForRender()

    const svg = wrapper.find('svg').element as SVGSVGElement
    expect(svg.style.minWidth).toBe(`${DIAGRAM_NATURAL_WIDTH * 0.6}px`)
  })

  it('should emit an error instead of drawing when Mermaid cannot parse the diagram', async () => {
    // Given: Mermaid rejects the source (syntax error)
    const parseError = new Error('Parse error on line 2')
    mermaid.render.mockImplementationOnce(async () => {
      throw parseError
    })
    const warn = spyOn(console, 'warn').mockImplementation(() => {})

    // When: the block is rendered
    const wrapper = mountDiagram('flowchart TD\n    A[Start --> B((oops')
    await waitForRender()

    // Then: the parent is told, so it can fall back to the source code
    expect(wrapper.emitted('error')).toEqual([[parseError]])
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })
})
