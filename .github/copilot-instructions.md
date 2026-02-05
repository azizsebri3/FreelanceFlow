# FreelanceFlow Dashboard - Copilot Instructions

## Project Overview
FreelanceFlow is a modern SaaS dashboard for freelancers built with Next.js 14+, TypeScript, and Tailwind CSS.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Recharts (charts)

## Design System
- Primary color: #3C50E0
- Secondary color: #64748B
- Background: #F1F5F9
- Cards: White with subtle shadows
- Border radius: 8px (rounded-lg)
- Consistent 16px/24px spacing

## Component Guidelines
- All components should be reusable and modular
- Use TypeScript interfaces for props
- Include hover, focus, and transition states
- Follow responsive design (mobile-first)
- Use 'use client' directive for client components

## Folder Structure
```
src/
├── app/           # Next.js pages and layouts
├── components/    # React components
│   ├── layout/    # Sidebar, Header, DashboardLayout
│   ├── cards/     # StatCard
│   ├── tables/    # ProjectsTable, InvoicesTable
│   ├── charts/    # RevenueChart, ProjectStatusChart
│   ├── activity/  # ActivityFeed
│   └── ui/        # Button, Card, Badge, Input
└── data/          # Placeholder data
```

## Coding Conventions
- Use functional components with TypeScript
- Export components as default exports
- Include JSDoc-style comments for sections
- Use Tailwind utility classes for styling
- Keep components focused and single-purpose

## When Adding New Features
1. Create component in appropriate folder
2. Add TypeScript interfaces for props
3. Include hover/focus/transition states
4. Make responsive for all screen sizes
5. Export from index.ts if needed
