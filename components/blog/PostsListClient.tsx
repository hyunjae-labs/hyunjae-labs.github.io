'use client';

import Link from 'next/link';

// Post 타입을 page.tsx와 동일하게 정의합니다.
interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
}

interface PostsListClientProps {
  posts: Post[];
}

export default function PostsListClient({ posts }: PostsListClientProps) {
  return (
    <>
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

      <style jsx>{`
        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .post-item {
          padding: 2rem;
          border: 1px solid #eee; /* var(--color-border-primary) 대신 기본값 사용 */
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .post-item:hover {
          border-color: #ddd; /* var(--color-border-secondary) 대신 기본값 사용 */
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
          color: #000; /* var(--color-text-primary) 대신 기본값 사용 */
        }
        .post-excerpt {
          color: #666; /* var(--color-text-secondary) 대신 기본값 사용 */
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .post-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #999; /* var(--color-text-tertiary) 대신 기본값 사용 */
        }
        .post-separator {
          color: #ccc; /* var(--color-text-quaternary) 대신 기본값 사용 */
        }
      `}</style>
    </>
  );
}
