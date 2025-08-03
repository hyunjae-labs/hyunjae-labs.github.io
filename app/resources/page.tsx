import VercelBlogWithPrivacy from "@/components/blog/VercelBlogWithPrivacy";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/lib/content';

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
    
    // 날짜를 문자열로 변환
    let publishedAt = data.date || data.publishedAt || new Date().toISOString().split('T')[0];
    if (publishedAt instanceof Date) {
      publishedAt = publishedAt.toISOString().split('T')[0];
    } else if (typeof publishedAt === 'string' && publishedAt.includes('T')) {
      publishedAt = publishedAt.split('T')[0];
    }
    
    return {
      id: fileName,
      title: data.title || fileName,
      excerpt: excerpt,
      author: {
        name: data.author || 'Hyunjae Lim',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: publishedAt,
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

export default function ResourcesPage() {
  const resources = getPostsFromDirectory('resources', 'Resources');
  
  return <VercelBlogWithPrivacy initialPosts={resources} />;
}
