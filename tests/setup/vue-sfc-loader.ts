import { plugin } from 'bun'
import { compileScript, parse } from 'vue/compiler-sfc'

const VUE_FILE = /\.vue$/

/**
 * Lets `bun test` import `.vue` single-file components (preloaded from bunfig.toml).
 * Only the `<script setup>` + template are compiled, styles are ignored.
 * Component tests simulate the browser: `import.meta.client` is true, like in Nuxt's client build.
 */
plugin({
  name: 'vue-sfc',
  setup(build) {
    build.onLoad({ filter: VUE_FILE }, async ({ path }) => {
      const { descriptor, errors } = parse(await Bun.file(path).text(), { filename: path })
      if (errors.length > 0)
        throw errors[0]

      const { content } = compileScript(descriptor, { id: path, inlineTemplate: true })
      return {
        contents: content.replaceAll('import.meta.client', 'true'),
        loader: 'ts',
      }
    })
  },
})
