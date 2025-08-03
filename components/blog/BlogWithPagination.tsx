"use client";

import React from 'react';
import { Search, Calendar, User, ArrowRight, Menu, ChevronDown, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BlogPost {
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
  tags: string[];
  image: string;
  featured?: boolean;
}

interface VercelBlogProps {
  posts?: BlogPost[];
  currentPage?: number;
  totalPages?: number;
}

const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const VercelBlog: React.FC<VercelBlogProps> = ({
  posts = [
    {
      id: '1',
      title: 'Building the Future of Web Development with Next.js 14',
      excerpt: 'Discover the latest features and improvements in Next.js 14, including the new App Router, Server Components, and enhanced performance optimizations that are revolutionizing how we build web applications.',
      author: {
        name: 'Lee Robinson',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: '2024-01-15',
      readTime: '8 min read',
      category: 'Engineering',
      tags: ['Next.js', 'React', 'Performance'],
      image: '/api/placeholder/600/300',
      featured: true
    },
    {
      id: '2',
      title: 'Scaling Frontend Infrastructure at Vercel',
      excerpt: 'Learn how we built and scaled our frontend infrastructure to serve millions of developers worldwide, including our approach to edge computing and global distribution.',
      author: {
        name: 'Guillermo Rauch',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: '2024-01-12',
      readTime: '12 min read',
      category: 'Infrastructure',
      tags: ['Edge Computing', 'CDN', 'Performance'],
      image: '/api/placeholder/600/300'
    },
    {
      id: '3',
      title: 'The Evolution of React Server Components',
      excerpt: 'A deep dive into React Server Components and how they are changing the way we think about server-side rendering and client-server boundaries in modern web applications.',
      author: {
        name: 'Sebastian Markbåge',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: '2024-01-10',
      readTime: '15 min read',
      category: 'React',
      tags: ['React', 'Server Components', 'SSR'],
      image: '/api/placeholder/600/300'
    },
    {
      id: '4',
      title: 'Optimizing Core Web Vitals for Better User Experience',
      excerpt: 'Practical strategies and techniques for improving your Core Web Vitals scores, including real-world examples and performance optimization tips.',
      author: {
        name: 'Katie Hempenius',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: '2024-01-08',
      readTime: '10 min read',
      category: 'Performance',
      tags: ['Web Vitals', 'Performance', 'UX'],
      image: '/api/placeholder/600/300'
    },
    {
      id: '5',
      title: 'Building Accessible Components with Radix UI',
      excerpt: 'How to create accessible, unstyled UI components using Radix UI primitives and integrate them seamlessly with your design system.',
      author: {
        name: 'Pedro Duarte',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: '2024-01-05',
      readTime: '7 min read',
      category: 'Design Systems',
      tags: ['Accessibility', 'Radix UI', 'Components'],
      image: '/api/placeholder/600/300'
    },
    {
      id: '6',
      title: 'The Future of Edge Computing',
      excerpt: 'Exploring how edge computing is transforming web development and enabling new possibilities for global applications with reduced latency.',
      author: {
        name: 'Malte Ubl',
        avatar: '/api/placeholder/32/32'
      },
      publishedAt: '2024-01-03',
      readTime: '9 min read',
      category: 'Edge Computing',
      tags: ['Edge', 'Performance', 'Global'],
      image: '/api/placeholder/600/300'
    }
  ],
  currentPage = 1,
  totalPages = 3
}) => {
  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <span className="text-background font-bold text-sm">▲</span>
              </div>
              <span className="font-semibold text-lg">Vercel</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                Products
              </a>
              <a href="#" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                Solutions
              </a>
              <a href="#" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                Resources
              </a>
              <a href="#" className="text-sm font-medium text-foreground border-b-2 border-foreground pb-4">
                Blog
              </a>
              <a href="#" className="text-sm font-medium hover:text-foreground/80 transition-colors">
                Pricing
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search blog posts..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="sm">
              Contact
            </Button>
            <Button size="sm">
              Sign Up
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              The Vercel Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stories and insights from the team building the platform for frontend developers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 w-80"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-40">
                    All Categories
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Engineering</DropdownMenuItem>
                  <DropdownMenuItem>Infrastructure</DropdownMenuItem>
                  <DropdownMenuItem>React</DropdownMenuItem>
                  <DropdownMenuItem>Performance</DropdownMenuItem>
                  <DropdownMenuItem>Design Systems</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                Featured
              </Badge>
              <h2 className="text-2xl font-bold mb-4">Latest Story</h2>
            </div>
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-[16/9] md:aspect-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{featuredPost.category}</Badge>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <img src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{featuredPost.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(featuredPost.publishedAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by Date
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem>Most Popular</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[16/9]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg leading-tight hover:text-primary cursor-pointer">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <img src={post.author.avatar} alt={post.author.name} />
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest posts delivered right to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="flex-1"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                  <span className="text-background font-bold text-xs">▲</span>
                </div>
                <span className="font-semibold">Vercel</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The platform for frontend developers, providing the speed and reliability innovators need.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Templates</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Guides</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Vercel Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VercelBlog;
