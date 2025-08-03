import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'

// Custom plugin to enhance code blocks with copy buttons and metadata
function rehypeCodeBlocks() {
  return (tree: any) => {
    const visit = (node: any, parent: any, index: number) => {
      // Process children first to avoid infinite recursion
      if (node.children) {
        node.children.forEach((child: any, idx: number) => visit(child, node, idx))
      }
      
      if (node.type === 'element' && node.tagName === 'pre' && parent && typeof index === 'number') {
        const codeElement = node.children?.[0]
        if (codeElement?.tagName === 'code') {
          // Extract language from className
          const className = codeElement.properties?.className?.[0] || ''
          const languageMatch = className.match(/language-(\w+)/)
          const language = languageMatch ? languageMatch[1] : ''
          
          // Check if it's a terminal command
          const codeContent = codeElement.children?.[0]?.value || ''
          const isTerminal = language === 'bash' || language === 'sh' || language === 'terminal' ||
                            codeContent.startsWith('$') || codeContent.startsWith('npm ') || 
                            codeContent.startsWith('pnpm ') || codeContent.startsWith('yarn ')

          // Create wrapper div with metadata
          const wrapper = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['code-block-wrapper']
            },
            children: [
              {
                type: 'element',
                tagName: 'div',
                properties: {
                  className: isTerminal ? ['code-block-container', 'terminal'] : ['code-block-container'],
                  'data-language': language
                },
                children: [
                  // Language/Terminal header
                  ...(language || isTerminal ? [{
                    type: 'element',
                    tagName: 'div',
                    properties: { className: ['code-block-header'] },
                    children: [
                      {
                        type: 'element',
                        tagName: 'span',
                        properties: { className: ['code-block-lang'] },
                        children: [{ type: 'text', value: isTerminal ? 'Terminal' : language }]
                      }
                    ]
                  }] : []),
                  // Copy button
                  {
                    type: 'element',
                    tagName: 'button',
                    properties: {
                      className: ['code-block-copy'],
                      'aria-label': 'Copy code',
                      type: 'button'
                    },
                    children: [
                      {
                        type: 'element',
                        tagName: 'svg',
                        properties: {
                          width: '16',
                          height: '16',
                          viewBox: '0 0 16 16'
                        },
                        children: [
                          {
                            type: 'element',
                            tagName: 'path',
                            properties: {
                              d: 'M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z',
                              fill: 'currentColor'
                            }
                          }
                        ]
                      }
                    ]
                  },
                  // The actual pre/code block
                  node
                ]
              }
            ]
          }
          
          // Replace the node in parent's children array
          parent.children[index] = wrapper
        }
      }
    }
    
    visit(tree, null, 0)
  }
}

export async function processMarkdown(content: string): Promise<string> {
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeCodeBlocks)
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(content)

    return result.toString()
  } catch (error) {
    console.error('Error processing markdown:', error)
    // Fallback to basic processing
    const fallbackResult = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(content)
    
    return fallbackResult.toString()
  }
}
