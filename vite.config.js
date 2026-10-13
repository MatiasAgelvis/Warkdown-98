import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 98.css ships `@media (not(hover))` — valid Media Queries Level 4, which
// every current browser accepts. lightningcss's parser only implements the
// Level 3 grammar, where `not` must be followed by a space (`(not (hover))`)
// or an `all` qualifier (`not all and (hover)`), so it hard-fails the build.
// Rewriting it here, in the PostCSS stage, keeps lightningcss minification
// and changes nothing observable in the browser.
const notHoverNeedsSpace = {
  postcssPlugin: 'fix-98css-not-hover',
  Once(root) {
    root.walkAtRules('media', (rule) => {
      if (rule.params.includes('(not(')) {
        rule.params = rule.params.replaceAll('(not(', '(not (')
      }
    })
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [notHoverNeedsSpace],
    },
  },
})
