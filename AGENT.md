# Agent Configuration

## Commands
- **Development**: `npm run dev` (with Turbopack for faster builds)
- **Build**: `npm run build` (check TypeScript errors and build production)
- **Lint**: `npm run lint` (ESLint with Next.js config)
- **Start**: `npm start` (serve production build)
- **Type Check**: `npx tsc --noEmit`

## Architecture
- **Framework**: Next.js 15 App Router with React 19 and TypeScript
- **Content**: File-system based content in `/content` (posts, projects, resources, about)
- **Styling**: Tailwind CSS with custom CSS modules, Shadcn/ui components
- **Markdown**: Unified/remark/rehype pipeline with syntax highlighting and code enhancement
- **Components**: `/components/ui` (Shadcn/ui), `/components/layout`, `/components/blog`

## Code Style
- **Imports**: Use `@/*` paths for internal imports, group external/internal separately
- **Components**: Functional components with TypeScript interfaces, arrow functions preferred
- **Naming**: camelCase for variables/functions, PascalCase for components, kebab-case for files
- **TypeScript**: Strict mode enabled, use interfaces for props/data structures
- **CSS**: Tailwind classes in components, CSS modules for complex styling
- **Error Handling**: Try/catch with fallbacks, console.error for debugging
- **Frontmatter**: Support both TOML (`+++`) and YAML (`---`) formats
- **Content Structure**: BlogPost interface with id, title, excerpt, author, publishedAt, readTime, category, slug, tags
