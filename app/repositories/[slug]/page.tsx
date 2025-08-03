import { blogPosts } from '@/lib/content';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { processMarkdown } from '@/lib/markdown';
import Link from 'next/link';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/layout/HeroSection';
import './vercel-repositories.css';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProjectContent(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'projects', `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Parse frontmatter (TOML format with +++)
    const lines = fileContent.split('\n');
    let contentStart = 0;
    let frontmatterCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '+++') {
        frontmatterCount++;
        if (frontmatterCount === 2) {
          contentStart = i + 1;
          break;
        }
      }
    }
    
    // If no frontmatter found, try the entire content
    if (contentStart === 0) {
      console.warn(`No frontmatter found in ${slug}.md, processing entire content`);
      const processedContent = await processMarkdown(fileContent);
      return processedContent;
    }
    
    const content = lines.slice(contentStart).join('\n');
    const processedContent = await processMarkdown(content);
    
    return processedContent;
  } catch (error) {
    console.error(`Error reading project content for ${slug}:`, error);
    return null;
  }
}

export default async function RepositoryPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug && p.category === 'Repositories');
  
  if (!post) {
    notFound();
  }
  
  const content = await getProjectContent(slug);
  
  return (
    <div className="page__container light-theme">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection category="Repositories" title={post.title} />

      {/* Article */}
      <article className="article__main">
        <div className="article__container">
          <div className="article__metadata">
            <div className="article__read-time">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <p className="article__read-time-text">{post.readTime}</p>
            </div>
            <time className="article__date" dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>

          <p className="article__lead-in">{post.excerpt}</p>

          {post.tags && (
            <div className="tags__section">
              {post.tags.map((tag) => (
                <span key={tag} className="tag__item">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {content && (
            <>
              <div 
                className="article__content markdown-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />

            </>
          )}
        </div>
      </article>

    </div>
  );
}

export async function generateStaticParams() {
  return blogPosts
    .filter(post => post.category === 'Repositories')
    .map((post) => ({
      slug: post.slug,
    }));
}
