# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev`: Start development server on port 3003
- `npm run build`: Build the application for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code quality checks
- `npm run type-check`: Run TypeScript type checking

## Architecture Overview

This is a Next.js 14 blog application using the App Router with a clean, monochrome design focused on readability and performance.

### Key Technical Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with custom color palette (primary, neutral, accent)
- **State Management**: Zustand for client state
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for server state
- **Authentication**: NextAuth.js

### Project Structure

```
src/
├── app/           # App Router pages and layouts
│   ├── blog/      # Blog post pages ([slug])
│   ├── contact/   # Contact page
│   ├── search/    # Search functionality
│   └── api/       # API routes
├── components/    # Reusable UI components
│   ├── blog/      # Blog-specific components
│   ├── layout/    # Layout components (Header, Footer, Sidebar)
│   └── ui/        # Generic UI components
├── data/          # Mock data for development
├── lib/           # Utility functions and data layer
├── types/         # TypeScript type definitions
└── styles/        # Global CSS styles
```

### Data Architecture

The application currently uses mock data (`src/data/mockData.ts`) for development. The data layer in `src/lib/data.ts` provides a clean API that can be easily swapped with real backend integration.

**Core Types:**
- `BlogPost`: Main content entity with full metadata
- `Category`: Content categorization
- `Tag`: Content tagging system
- `Author`: Content authorship
- `Comment`: User comments (with approval system)

### Design System

**Colors:** Uses a carefully designed monochrome palette with primary (blue), neutral (grays), and accent (yellow) colors defined in Tailwind config.

**Typography:** Inter font for sans-serif, JetBrains Mono for monospace code.

**Components:** All UI components use consistent prop interfaces and follow compound component patterns where appropriate.

### Data Fetching Patterns

- Uses async Server Components for initial data loading
- Implements proper loading states with Suspense boundaries
- Pagination is handled server-side with URL parameters
- Search and filtering maintain URL state for bookmarkability

### Key Features

- **SEO Optimization**: Comprehensive metadata handling with Open Graph and Twitter cards
- **Responsive Design**: Mobile-first approach with grid layouts
- **Search & Filter**: Category and tag-based filtering with search functionality
- **Comments System**: Comment approval workflow
- **Accessibility**: Semantic HTML structure and ARIA attributes

## Development Notes

- Port 3003 is used for development to avoid conflicts
- TypeScript strict mode is enabled - avoid `any` types
- Components export from index.ts files for clean imports
- Mock data simulates real API delays for realistic development experience
- All forms use React Hook Form with Zod validation schemas