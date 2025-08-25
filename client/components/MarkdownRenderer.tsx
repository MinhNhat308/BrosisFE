import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom styling for different elements
          h1: ({ children, ...props }: any) => (
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }: any) => (
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }: any) => (
            <h3 className="text-xl font-medium text-gray-700 mb-3 mt-6" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }: any) => (
            <p className="text-gray-600 leading-relaxed mb-4" {...props}>
              {children}
            </p>
          ),
          blockquote: ({ children, ...props }: any) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-blue-800" {...props}>
              {children}
            </blockquote>
          ),
          strong: ({ children, ...props }: any) => (
            <strong className="font-bold text-gray-900" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }: any) => (
            <em className="italic text-gray-700" {...props}>
              {children}
            </em>
          ),
          ul: ({ children, ...props }: any) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }: any) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }: any) => (
            <li className="text-gray-600" {...props}>
              {children}
            </li>
          ),
          code: ({ node, inline, className, children, ...props }: any) => 
            inline ? (
              <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" {...props}>
                {children}
              </code>
            ),
          pre: ({ children, ...props }: any) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
              {children}
            </pre>
          ),
          a: ({ href, children, ...props }: any) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }: any) => (
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full h-auto rounded-lg shadow-md my-4"
              {...props}
            />
          ),
          table: ({ children, ...props }: any) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-300" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }: any) => (
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }: any) => (
            <td className="border border-gray-300 px-4 py-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
