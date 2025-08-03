import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { processMarkdown } from '@/lib/markdown';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SimpleFooter } from '@/components/layout/SimpleFooter';
import './vercel-about.css';

// TOML frontmatter를 파싱하는 함수
function parseTOMLFrontmatter(content: string): { data: any; content: string } {
  const lines = content.split('\n');
  let frontmatterStart = -1;
  let frontmatterEnd = -1;
  
  // TOML frontmatter 찾기 (+++)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '+++') {
      if (frontmatterStart === -1) {
        frontmatterStart = i;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }
  
  if (frontmatterStart === -1 || frontmatterEnd === -1) {
    return { data: {}, content };
  }
  
  const frontmatterLines = lines.slice(frontmatterStart + 1, frontmatterEnd);
  const contentLines = lines.slice(frontmatterEnd + 1);
  
  // 간단한 TOML 파서 (기본적인 key = "value" 형식만 지원)
  const data: any = {};
  frontmatterLines.forEach(line => {
    const match = line.match(/^(\w+)\s*=\s*"([^"]*)"$/);
    if (match) {
      data[match[1]] = match[2];
    } else {
      // 다른 형식 처리 (예: date = 2025-08-03T08:30:00+09:00)
      const simpleMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (simpleMatch) {
        const value = simpleMatch[2].trim();
        if (value.startsWith("'") && value.endsWith("'")) {
          data[simpleMatch[1]] = value.slice(1, -1);
        } else {
          data[simpleMatch[1]] = value;
        }
      }
    }
  });
  
  return {
    data,
    content: contentLines.join('\n').trim()
  };
}

async function getAboutContent() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'about', '_index.md');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    let parsedContent;
    
    // TOML 형식 확인 (+++)
    if (fileContent.startsWith('+++')) {
      parsedContent = parseTOMLFrontmatter(fileContent);
    } else {
      // 기본 처리
      parsedContent = { data: {}, content: fileContent };
    }
    
    const { data, content } = parsedContent;
    
    // Markdown 처리
    const processedContent = await processMarkdown(content);
    
    return {
      title: data.title || 'About',
      content: processedContent
    };
  } catch (error) {
    console.error('Error reading about content:', error);
    return null;
  }
}

export default async function AboutPage() {
  const about = await getAboutContent();
  
  if (!about) {
    notFound();
  }
  
  return (
    <div className="page__container light-theme">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero__section">
        <div className="hero__container">
          {/* Breadcrumb */}
          <div className="hero__breadcrumb">
            <Link href="/" className="hero__breadcrumb-link">
              <svg height="16" viewBox="0 0 16 16" width="16" style={{ width: '12px', height: '12px' }}>
                <path d="M6.46966 13.7803L6.99999 14.3107L8.06065 13.25L7.53032 12.7197L3.56065 8.75001H14.25H15V7.25001H14.25H3.56065L7.53032 3.28034L8.06065 2.75001L6.99999 1.68935L6.46966 2.21968L1.39644 7.2929C1.00592 7.68342 1.00592 8.31659 1.39644 8.70711L6.46966 13.7803Z" fill="currentColor"></path>
              </svg>
              Blog
            </Link> / <b><span style={{ color: '#000' }}>About</span></b>
          </div>

          {/* Title */}
          <h1 className="hero__title">
            {about.title}
          </h1>
        </div>
      </section>

      {/* Main Article */}
      <main className="article__main">
        <article className="article__container">
          {/* Main Content */}
          {about.content && (
            <div className="article__content">
              <div 
                dangerouslySetInnerHTML={{ __html: about.content }}
                className="markdown-content"
              />
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
}
