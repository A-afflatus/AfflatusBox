import Markdown from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import mie from 'markdown-it-emoji';
import mif from 'markdown-it-footnote';
const md: Markdown = new Markdown({
  linkify: true,
  html: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>';
      } catch (__) {
        console.log()
      }
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})
md.use(mie)
.use(mif);

const render = (content: string) => {
  return md.render(content);
}


export {
  render
}
