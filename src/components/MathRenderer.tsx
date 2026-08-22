import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  math?: string;
  inline?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  inline = true,
  className = '',
}) => {
  if (!math) return null;

  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: !inline,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, inline]);

  return (
    <span
      className={`inline-math font-mono ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      dir="ltr"
    />
  );
};
