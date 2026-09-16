import katex from 'katex'

// Only author-controlled mathematical expressions are rendered as HTML.
export function MathText({ expression }: { expression: string }) {
  return <div className="formula" dangerouslySetInnerHTML={{
    __html: katex.renderToString(expression, { throwOnError: false, trust: false, output: 'htmlAndMathml' }),
  }} />
}
