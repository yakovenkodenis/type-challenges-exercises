import { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'
import { full as emoji } from 'markdown-it-emoji'
import styled from '@emotion/styled';

type Props = {
  content: string;
};

export default function MarkdownPreview(props: Props) {
  const { content } = props;

  const [markdownContent, setMarkdownContent] = useState<string>('');

  useEffect(() => {
      const mdParser = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value;
            } catch {
              return '';
            }
          }
      
          return ''; // use external default escaping
        }
      }).use(emoji);
      const renderedMarkdown = mdParser.render(content);
      setMarkdownContent(renderedMarkdown);
  }, [content]);

  return (
    <MarkdownBlock dangerouslySetInnerHTML={{ __html: markdownContent }}
  />
  )
}

const MarkdownBlock = styled.div`
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  font-family: 'Courier New', Courier, monospace;
  overflow-y: auto;
  border: 1px solid #333;

  h1, h2, h3 {
    color: #569cd6;
  }
  a {
    color: #4ec9b0;
    text-decoration: none;
  }
  pre {
    background-color: #2d2d2d;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }
`;
