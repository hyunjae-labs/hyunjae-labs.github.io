import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Header } from '@/components/layout/Header';
import { SimpleFooter } from '@/components/layout/SimpleFooter';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
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

async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'content', 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      let parsedContent;
      
      // TOML 형식 확인 (+++)
      if (fileContent.startsWith('+++')) {
        parsedContent = parseTOMLFrontmatter(fileContent);
      } else {
        // YAML 형식 (---)
        parsedContent = matter(fileContent);
      }
      
      const { data, content } = parsedContent;
      
      // excerpt 생성
      const contentWithoutFrontmatter = content;
      const firstParagraph = contentWithoutFrontmatter
        .split('\n\n')
        .find(p => p.trim() && !p.startsWith('#'))?.trim() || '';
      const excerpt = data.description || data.excerpt || 
        firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : '');
      
      // 읽기 시간 계산
      const wordCount = contentWithoutFrontmatter.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);
      
      // 날짜 처리
      let date = data.date || data.publishedAt || new Date().toISOString().split('T')[0];
      if (date instanceof Date) {
        date = date.toISOString().split('T')[0];
      } else if (typeof date === 'string' && date.includes('T')) {
        date = date.split('T')[0];
      }
      
      return {
        slug: filename.replace('.md', ''),
        title: data.title || filename.replace('.md', ''),
        excerpt: excerpt,
        date: date,
        readTime: `${readTime} min read`,
        author: data.author || 'Hyunjae Lim'
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return posts;
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div className="page__container light-theme">
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
            </Link> / <b><span style={{ color: '#000' }}>Posts</span></b>
          </div>

          <h1 className="hero__title">Posts</h1>
        </div>
      </section>
      
      {/* Posts List */}
      <main className="article__main">
        <div className="article__container">
          <div className="posts-list">
            {posts.map(post => (
              <article key={post.slug} className="post-item">
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <span className="post-author">{post.author}</span>
                    <span className="post-separator">•</span>
                    <span className="post-date">{post.date}</span>
                    <span className="post-separator">•</span>
                    <span className="post-readtime">{post.readTime}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      
      <SimpleFooter />
      
      <style jsx>{`
        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .post-item {
          padding: 2rem;
          border: 1px solid var(--color-border-primary);
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .post-item:hover {
          border-color: var(--color-border-secondary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .post-item a {
          text-decoration: none;
          color: inherit;
        }
        
        .post-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
        }
        
        .post-excerpt {
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .post-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
        }
        
        .post-separator {
          color: var(--color-text-quaternary);
        }
      `}</style>
    </div>
  );
}
