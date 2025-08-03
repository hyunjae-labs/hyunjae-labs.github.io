import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './content';

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

// 마크다운 파일에서 메타데이터 추출
function extractMetadata(filePath: string, category: string): BlogPost | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.md');
    
    let parsedContent;
    
    // TOML 형식 확인 (+++)
    if (fileContent.startsWith('+++')) {
      parsedContent = parseTOMLFrontmatter(fileContent);
    } else {
      // YAML 형식 (---)
      parsedContent = matter(fileContent);
    }
    
    const { data } = parsedContent;
    
    // excerpt 생성 (첫 150자 또는 첫 단락)
    const contentWithoutFrontmatter = parsedContent.content;
    const firstParagraph = contentWithoutFrontmatter
      .split('\n\n')
      .find(p => p.trim() && !p.startsWith('#'))?.trim() || '';
    const excerpt = data.description || data.excerpt || 
      firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : '');
    
    // 읽기 시간 계산 (단어 수 기준)
    const wordCount = contentWithoutFrontmatter.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200) + ' min read';
    
    return {
      id: fileName,
      title: data.title || fileName,
      excerpt: excerpt,
      author: {
        name: data.author || 'Hyunjae Lim',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: data.date || data.publishedAt || new Date().toISOString().split('T')[0],
      readTime: readTime,
      category: category,
      featured: data.featured || false,
      slug: fileName,
      tags: data.tags || [],
      image: data.image
    };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

// 디렉토리에서 모든 마크다운 파일 읽기
function getPostsFromDirectory(directory: string, category: string): BlogPost[] {
  try {
    const dirPath = path.join(process.cwd(), 'content', directory);
    
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory ${dirPath} does not exist`);
      return [];
    }
    
    const files = fs.readdirSync(dirPath);
    const posts: BlogPost[] = [];
    
    files.forEach(file => {
      if (file.endsWith('.md') && !file.startsWith('_index')) {
        const filePath = path.join(dirPath, file);
        const post = extractMetadata(filePath, category);
        if (post) {
          posts.push(post);
        }
      }
    });
    
    // 날짜 기준으로 정렬 (최신순)
    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

// 모든 블로그 포스트 가져오기
export function getAllBlogPosts(): BlogPost[] {
  const posts = getPostsFromDirectory('posts', 'Posts');
  const repositories = getPostsFromDirectory('projects', 'Repositories');
  const documents = getPostsFromDirectory('resources', 'Documents');
  
  // About 페이지 추가
  const aboutPost: BlogPost = {
    id: 'about',
    title: 'About Me',
    excerpt: 'AI와 자동화를 좋아하는 개발자입니다.',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32'
    },
    publishedAt: '2025-01-01',
    readTime: '1 min read',
    category: 'About',
    slug: 'about',
    tags: ['profile', 'introduction']
  };
  
  return [...posts, ...repositories, ...documents, aboutPost];
}

// 특정 카테고리의 포스트만 가져오기
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter(post => post.category === category);
}

// 특정 슬러그의 포스트 가져오기
export function getPostBySlug(slug: string, category?: string): BlogPost | undefined {
  const posts = getAllBlogPosts();
  if (category) {
    return posts.find(post => post.slug === slug && post.category === category);
  }
  return posts.find(post => post.slug === slug);
}

// 마크다운 파일의 전체 콘텐츠 가져오기
export function getPostContent(slug: string, category: string): { metadata: BlogPost | null; content: string } | null {
  try {
    let directory = '';
    switch (category.toLowerCase()) {
      case 'posts':
        directory = 'posts';
        break;
      case 'repositories':
        directory = 'projects';
        break;
      case 'documents':
        directory = 'resources';
        break;
      case 'about':
        const aboutPost = getPostBySlug(slug);
        return {
          metadata: aboutPost || null,
          content: `# About Me\n\nAI와 자동화를 좋아하는 개발자입니다.\n\n현재 다양한 프로젝트를 진행하며 개발 경험을 쌓아가고 있습니다.`
        };
      default:
        return null;
    }
    
    const filePath = path.join(process.cwd(), 'content', directory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    let parsedContent;
    
    // TOML 형식 확인 (+++)
    if (fileContent.startsWith('+++')) {
      parsedContent = parseTOMLFrontmatter(fileContent);
    } else {
      // YAML 형식 (---)
      parsedContent = matter(fileContent);
    }
    
    const metadata = extractMetadata(filePath, category);
    
    return {
      metadata,
      content: parsedContent.content
    };
  } catch (error) {
    console.error(`Error reading post content for ${slug}:`, error);
    return null;
  }
}
