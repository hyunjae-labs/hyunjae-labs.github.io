import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { processMarkdown } from '@/lib/markdown';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SimpleFooter } from '@/components/layout/SimpleFooter';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Hyunjae's Blog</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              {about.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {/* AI와 자동화를 좋아하는 개발자입니다. */}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <article>
          {about.content && (
            <div className="prose prose-lg max-w-none dark:prose-invert mb-16">
              <div 
                dangerouslySetInnerHTML={{ __html: about.content }}
              />
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg text-center border">
            <h3 className="text-2xl font-bold mb-4">
              Let's Connect
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {/* AI, 자동화, 또는 그냥 이야기하고 싶으시다면 언제든 연락주세요! */}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <a href="https://github.com/hyunjae-labs" target="_blank" rel="noopener noreferrer">
                  GitHub Profile
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:thecurrent.lim@gmail.com">
                  Send Email
                </a>
              </Button>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
}
