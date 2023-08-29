import Markdown from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import mie from 'markdown-it-emoji';
import mif from 'markdown-it-footnote';
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
const md: Markdown = new Markdown({
  linkify: true,
  html: true,
  typographer: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})
md.use(mie)
  .use(mif)
  .use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
  .use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

const highlightBlock = (str: string, lang?: string) => {
  return `<pre > <code class="hljs ${lang}" style="border-radius: 10px;" >${str}</code></pre>`
}
const render = (content: string) => {
  return md.render(content);
}

export {
  render
}
