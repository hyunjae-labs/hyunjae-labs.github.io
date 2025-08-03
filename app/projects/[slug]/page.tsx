import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { processMarkdown } from '@/lib/markdown';
import Link from 'next/link';
import Script from 'next/script';

import { HeroSection } from '@/components/layout/HeroSection';
import '../../posts/[slug]/vercel-blog.css';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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
      // tags 같은 배열 처리
      const arrayMatch = line.match(/^(\w+)\s*=\s*\[([^\]]*)\]$/);
      if (arrayMatch) {
        data[arrayMatch[1]] = arrayMatch[2]
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
    }
  });
  
  return {
    data,
    content: contentLines.join('\n').trim()
  };
}

async function getProject(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'projects', `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    let parsedContent;
    let contentForMarkdown;
    
    // TOML 형식 확인 (+++)
    if (fileContent.startsWith('+++')) {
      parsedContent = parseTOMLFrontmatter(fileContent);
      contentForMarkdown = parsedContent.content;
    } else {
      // YAML 형식 (---)
      parsedContent = matter(fileContent);
      contentForMarkdown = parsedContent.content;
    }
    
    const { data } = parsedContent;
    
    // excerpt 생성
    const firstParagraph = contentForMarkdown
      .split('\n\n')
      .find(p => p.trim() && !p.startsWith('#'))?.trim() || '';
    const excerpt = data.description || data.excerpt || data.summary ||
      firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : '');
    
    // 읽기 시간 계산
    const wordCount = contentForMarkdown.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200) + ' min read';
    
    // 날짜 처리
    let publishedAt = data.date || data.publishedAt || new Date().toISOString().split('T')[0];
    if (publishedAt instanceof Date) {
      publishedAt = publishedAt.toISOString().split('T')[0];
    } else if (typeof publishedAt === 'string' && publishedAt.includes('T')) {
      publishedAt = publishedAt.split('T')[0];
    }
    
    // Markdown 처리
    const processedContent = await processMarkdown(contentForMarkdown);
    
    return {
      title: data.title || slug,
      excerpt: excerpt,
      author: {
        name: data.author || 'Hyunjae Lim',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: publishedAt,
      readTime: readTime,
      category: 'Projects',
      slug: slug,
      tags: data.tags || [],
      content: processedContent
    };
  } catch (error) {
    console.error(`Error reading project ${slug}:`, error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="page__container light-theme">
      {/* Hero Section */}
      <HeroSection category="Projects" title={project.title} />

      {/* Main Article */}
      <main className="article__main">
        <article className="article__container">
          {/* Article metadata */}
          <div className="article__metadata">
            <div className="article__read-time">
              <svg height="16" viewBox="0 0 16 16" width="16" style={{ color: '#666' }}>
                <path d="M5.35066 2.06247C5.96369 1.78847 6.62701 1.60666 7.32351 1.53473L7.16943 0.0426636C6.31208 0.1312 5.49436 0.355227 4.73858 0.693033L5.35066 2.06247ZM8.67651 1.53473C11.9481 1.87258 14.5 4.63876 14.5 8.00001C14.5 11.5899 11.5899 14.5 8.00001 14.5C4.63901 14.5 1.87298 11.9485 1.5348 8.67722L0.0427551 8.83147C0.459163 12.8594 3.86234 16 8.00001 16C12.4183 16 16 12.4183 16 8.00001C16 3.86204 12.8589 0.458666 8.83059 0.0426636L8.67651 1.53473ZM2.73972 4.18084C3.14144 3.62861 3.62803 3.14195 4.18021 2.74018L3.29768 1.52727C2.61875 2.02128 2.02064 2.61945 1.52671 3.29845L2.73972 4.18084ZM1.5348 7.32279C1.60678 6.62656 1.78856 5.96348 2.06247 5.35066L0.693033 4.73858C0.355343 5.4941 0.131354 6.31152 0.0427551 7.16854L1.5348 7.32279ZM8.75001 4.75V4H7.25001V4.75V7.875C7.25001 8.18976 7.3982 8.48615 7.65001 8.675L9.55001 10.1L10.15 10.55L11.05 9.35L10.45 8.9L8.75001 7.625V4.75Z" fill="currentColor"></path>
              </svg>
              <p className="article__read-time-text">{project.readTime}</p>
            </div>
            <time className="article__date">
              {new Date(project.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          {/* Lead-in */}
          <div className="article__lead-in">
            <p>{project.excerpt}</p>
          </div>

          {/* Main Content */}
          {project.content && (
            <div className="article__content">
              <div 
                dangerouslySetInnerHTML={{ __html: project.content }}
                className="markdown-content"
              />
            </div>
          )}

        </article>
      </main>

      {/* Copy functionality script */}
      <Script 
        src="/posts/copy-code.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const projectsDir = path.join(process.cwd(), 'content', 'projects');
    const files = await fs.readdir(projectsDir);
    
    return files
      .filter(file => file.endsWith('.md') && !file.startsWith('_index'))
      .map(file => ({
        slug: file.replace('.md', ''),
      }));
  } catch (error) {
    console.error('Error generating static params for projects:', error);
    return [];
  }
}
