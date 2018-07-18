
import * as React from 'react'
import * as DomServer from 'react-dom/server'

interface HtmlArticle {
  title: string
  by: string
  pubDate: string
  content: string
}

export function getHtml (article: HtmlArticle) {
  return DomServer.renderToStaticMarkup((
    <html>
      <body>
        <h1 style={{ textAlign: 'center' }}>{article.title}</h1>
        <hr />
        <h2 style={{ textAlign: 'center' }}>{article.by}</h2>
        <h3 style={{ textAlign: 'center' }}>{article.pubDate}</h3>
        <div>
          {
            article.content.split(/\n/g).map(paragraph => (
              <p>
                {paragraph}
              </p>
            ))
          }
        </div>
      </body>
    </html>
  ))
}

export function generatePDF (article: HtmlArticle) {
  return pdf.fromData(getHtml(article), {
    documentSize: 'A4',
    type: 'share',
  })
}
