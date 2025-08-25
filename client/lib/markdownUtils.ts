/**
 * Extract plain text preview from markdown content
 * Removes markdown formatting and returns first N characters
 */
export function getMarkdownPreview(markdown: string, maxLength: number = 150): string {
  // Remove markdown formatting
  let text = markdown
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold and italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '[code]')
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove lists
    .replace(/^\s*[\-\*\+]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove extra whitespace
    .replace(/\n\s*\n/g, '\n')
    .replace(/\n/g, ' ')
    .trim();

  // Truncate and add ellipsis
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }

  return text || 'Nội dung không có sẵn';
}

/**
 * Extract the first heading from markdown content as title
 */
export function getMarkdownTitle(markdown: string): string | null {
  const headingMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
  return headingMatch ? headingMatch[1].trim() : null;
}

/**
 * Count estimated reading time for markdown content
 */
export function getMarkdownReadingTime(markdown: string): number {
  const plainText = getMarkdownPreview(markdown, Infinity);
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = plainText.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
