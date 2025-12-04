import { PortableTextBlock } from 'next-sanity';

interface TextSpan {
  _type?: string;
  text?: string;
}

/**
 * Cleans Sanity strings by removing invisible/special characters
 */
const cleanSanityText = (text: string): string => {
  return text
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Replace non-breaking spaces with regular spaces
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    // Remove zero-width joiner and non-joiner
    .replace(/[\u200C\u200D]/g, '')
    // Remove left-to-right and right-to-left marks
    .replace(/[\u200E\u200F]/g, '')
    // Remove other invisible characters
    .replace(/[\u2060-\u206F]/g, '')
    // Normalize Unicode
    .normalize('NFKC')
    // Collapse multiple spaces into one
    .replace(/\s+/g, ' ')
    .trim();
};

const ReadingTime = ({ content, className }: { content: PortableTextBlock[], className?: string }) => {
  const wordsPerMinute = 225; // Average reading speed

  // Function to extract plain text from Sanity's portable text
  const getPlainText = (blocks: PortableTextBlock[]): string => {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    return blocks
      .map((block) => {
        // Only process text blocks
        if (block._type !== 'block') return '';
        
        const children = block.children as TextSpan[] | undefined;
        if (!children || !Array.isArray(children)) return '';
        
        return children
          .filter((span): span is TextSpan & { text: string } => 
            typeof span?.text === 'string'
          )
          .map((span) => cleanSanityText(span.text))
          .join(' ');
      })
      .filter(Boolean)
      .join(' ');
  };

  const plainText = getPlainText(content);
  // Split by whitespace and filter empty strings
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return (
    <p className={className}>{minutes} min read</p>
  );
};

export default ReadingTime;