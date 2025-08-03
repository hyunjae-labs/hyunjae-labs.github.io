export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  featured?: boolean;
  slug: string;
  tags?: string[];
  image?: string;
}

export const blogPosts: BlogPost[] = [
  // Posts
  {
    id: '1',
    title: 'SuperGemini 개발 일지: SuperClaude 아키텍처 분석과 포팅',
    excerpt: 'LLM 평가 시스템을 만들던 중 SuperClaude를 발견하고 Gemini용으로 포팅한 과정',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-08-03',
    readTime: '10 min read',
    category: 'Posts',
    featured: true,
    slug: 'supergemini-development-journey',
    tags: ['개발일지', 'SuperGemini', 'LLM', '프롬프트평가', 'MCP', 'OpenSource']
  },
  {
    id: '2',
    title: 'PyPI 패키징 경험: notebook-convert-mcp 배포',
    excerpt: 'MCP 툴을 처음으로 PyPI에 배포하면서 겪은 과정과 배운 점들',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-08-02',
    readTime: '8 min read',
    category: 'Posts',
    slug: 'pypi-packaging-journey',
    tags: ['python', 'pypi', '패키징', '배포', 'mcp']
  },
  {
    id: '3',
    title: 'Notebook Convert MCP 개발',
    excerpt: 'Jupyter Notebook과 Markdown 간 변환을 위한 MCP 도구 개발 과정',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-08-01',
    readTime: '12 min read',
    category: 'Posts',
    slug: 'notebook-convert-mcp-development',
    tags: ['jupyter', 'markdown', 'conversion', 'mcp', '개발일지']
  },
  // Projects
  {
    id: '4',
    title: 'SuperGemini',
    excerpt: 'SuperClaude 아키텍처를 Gemini CLI에 포팅한 프레임워크. 17개 명령어와 11개 페르소나 제공.',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-08-03',
    readTime: '2 min read',
    category: 'Projects',
    slug: 'supergemini',
    tags: ['Gemini', 'Framework', 'CLI']
  },
  {
    id: '5',
    title: 'Notebook Convert MCP',
    excerpt: 'Jupyter Notebook과 Markdown 간 변환을 위한 MCP 서버',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-08-02',
    readTime: '2 min read',
    category: 'Projects',
    slug: 'notebook-convert-mcp',
    tags: ['jupyter', 'markdown', 'mcp', 'python']
  },
  // Resources
  {
    id: '6',
    title: 'Claude Code MCP Setup Guide',
    excerpt: 'Claude Code Model Context Protocol (MCP) 서버 설정 가이드. 범용 설치, 설정, 문제 해결 방법.',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-01-03',
    readTime: '15 min read',
    category: 'Resources',
    slug: 'claude-code-mcp-setup-guide',
    tags: ['claude-code', 'mcp', 'setup', 'configuration']
  },
  {
    id: '7',
    title: 'Gemini CLI MCP Setup Guide',
    excerpt: 'Gemini CLI Model Context Protocol (MCP) 서버 설정 가이드',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-01-02',
    readTime: '12 min read',
    category: 'Resources',
    slug: 'gemini-cli-mcp-setup-guide',
    tags: ['gemini-cli', 'mcp', 'setup', 'configuration']
  },
  {
    id: '8',
    title: 'SuperClaude Automerge',
    excerpt: 'SuperClaude 자동 병합 가이드',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-01-01',
    readTime: '10 min read',
    category: 'Resources',
    slug: 'superclaude-automerge',
    tags: ['superclaude', 'automation', 'claude']
  },
  // About
  {
    id: '9',
    title: 'About Me',
    excerpt: '/* AI와 자동화를 좋아하는 개발자입니다. */',
    author: {
      name: 'Hyunjae Lim',
      avatar: '/api/placeholder/32/32',
    },
    publishedAt: '2025-01-01',
    readTime: '1 min read',
    category: 'About',
    slug: 'about',
    tags: ['profile', 'introduction']
  }
];