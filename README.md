# FreelanceFlow

A modern SaaS dashboard for freelancers to manage clients, projects, and invoices.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Dark Mode

FreelanceFlow includes a complete dark mode implementation with the following features:

### Features

- ✅ **Theme Toggle:** Sun/moon icon in the header for switching themes
- ✅ **System Preference Detection:** Automatically detects user's system theme preference
- ✅ **Persistent Storage:** Theme choice is saved in localStorage
- ✅ **Smooth Transitions:** All theme changes are animated
- ✅ **Complete Coverage:** All components support both light and dark modes
- ✅ **Auth Pages:** Login, signup, and password recovery pages support dark mode

### Theme Implementation

- **CSS Variables:** Uses CSS custom properties for theme colors
- **Tailwind Classes:** Leverages Tailwind's dark mode utilities
- **Context API:** React context for theme state management
- **Hydration Safe:** Prevents flash of incorrect theme on page load

### Color Scheme

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#F1F5F9` | `#0F172A` |
| Surface | `#FFFFFF` | `#1E293B` |
| Text Primary | `#1E293B` | `#F8FAFC` |
| Text Secondary | `#64748B` | `#CBD5E1` |
| Borders | `#E2E8F0` | `#334155` |

## Authentication

FreelanceFlow includes a complete authentication system with professional login and signup pages.

### Auth Pages

- **Login:** `/auth/login` - User sign-in with email/password
- **Signup:** `/auth/signup` - User registration with validation
- **Forgot Password:** `/auth/forgot-password` - Password recovery

### Features

- ✅ Form validation with real-time error feedback
- ✅ Professional design matching the dashboard theme
- ✅ Social login buttons (Google, GitHub) - UI ready
- ✅ Responsive design for all screen sizes
- ✅ Loading states and success feedback
- ✅ Password strength requirements
- ✅ Terms of service agreement
- ✅ Remember me functionality

### Auth Layout

Auth pages use a dedicated layout (`src/app/auth/layout.tsx`) that excludes the main dashboard navigation, providing a clean authentication experience.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── layout.tsx              # Auth pages layout (no dashboard nav)
│   │   ├── login/
│   │   │   └── page.tsx            # Login page with dark mode
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup page with dark mode
│   │   └── forgot-password/
│   │       └── page.tsx            # Password recovery with dark mode
│   ├── layout.tsx                  # Root layout with theme provider
│   ├── page.tsx                    # Dashboard page
│   └── globals.css                 # Global styles & theme variables
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   ├── Header.tsx              # Top header with theme toggle
│   │   └── DashboardLayout.tsx     # Main layout wrapper
│   ├── cards/
│   │   └── StatCard.tsx            # Statistics cards
│   ├── tables/
│   │   ├── ProjectsTable.tsx    # Projects data table
│   │   └── InvoicesTable.tsx    # Invoices data table
│   ├── charts/
│   │   ├── RevenueChart.tsx     # Revenue area chart
│   │   └── ProjectStatusChart.tsx # Project status donut chart
│   ├── activity/
│   │   └── ActivityFeed.tsx # Activity timeline feed
│   └── ui/
│       ├── Button.tsx       # Reusable button component
│       ├── Card.tsx         # Reusable card component
│       ├── Badge.tsx        # Status badge component
│       ├── Input.tsx        # Form input component
│       └── ThemeToggle.tsx  # Dark/light mode toggle
├── contexts/
│   ├── ThemeContext.tsx     # Theme state management
│   └── ProjectContext.tsx   # Project state management
```

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | #3C50E0 | Main actions, links |
| Primary Dark | #2E3FAE | Hover states |
| Success | #10B981 | Positive status |
| Warning | #F59E0B | Pending status |
| Danger | #EF4444 | Error, overdue |
| Background | #F1F5F9 | Page background |
| Sidebar | #1C2434 | Sidebar background |

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** Bold, 900 weight
- **Body:** Regular, 400 weight

### Spacing

- Base unit: 4px
- Component padding: 16px - 24px
- Grid gaps: 16px - 24px

### Border Radius

- Small: 4px
- Medium: 8px
- Large: 12px

## Components

### Layout Components

- **Sidebar:** Collapsible navigation with icons and badges
- **Header:** Sticky header with search, notifications, user menu
- **DashboardLayout:** Wrapper that combines Sidebar and Header

### Card Components

- **StatCard:** Displays metrics with icons and change indicators

### Table Components

- **ProjectsTable:** Shows projects with progress bars and actions
- **InvoicesTable:** Displays invoices with status badges

### Chart Components

- **RevenueChart:** Area chart showing revenue vs expenses
- **ProjectStatusChart:** Donut chart showing project distribution

### UI Components

- **Button:** Multiple variants (primary, secondary, outline, ghost, danger)
- **Card:** Flexible card with header, body, footer
- **Badge:** Status indicators (success, warning, danger, info)
- **Input:** Form inputs with labels and validation

## Responsive Design

- **Mobile:** < 640px - Single column layout
- **Tablet:** 640px - 1024px - Two column layout
- **Desktop:** > 1024px - Full dashboard layout

## Connecting to Backend

All data is currently using placeholder data from `src/data/placeholder.ts`. To connect to your backend:

1. Replace placeholder data with API calls
2. Use React Query or SWR for data fetching
3. Implement authentication
4. Add error handling and loading states

### Example API Integration

```typescript
// Replace placeholder data with API call
import { useQuery } from '@tanstack/react-query';

const { data: stats } = useQuery({
  queryKey: ['stats'],
  queryFn: () => fetch('/api/stats').then(res => res.json())
});
```

## Available Scripts

## 🌳 Git Branch Structure

This project follows a professional Git branching strategy:

### Main Branches
- **`main`** - Production-ready code (protected branch)
- **`develop`** - Main development branch

### Feature Branches
- **`feature/*`** - New features (e.g., `feature/user-authentication`)
- **`hotfix/*`** - Urgent bug fixes for production

### Workflow
1. Create feature branches from `develop`
2. Work on features in dedicated branches
3. Create Pull Requests to merge into `develop`
4. When ready for production, merge `develop` → `main`

### Example Commands
```bash
# Create a new feature branch
git checkout -b feature/my-new-feature

# Push your feature branch
git push -u origin feature/my-new-feature

# Create a Pull Request on GitHub
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **State Management:** React Context
- **Charts:** Recharts
- **Icons:** Heroicons

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── data/               # Mock data and constants
├── hooks/              # Custom React hooks
├── services/           # API services
└── utils/              # Utility functions
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

This project is private and proprietary.

## Customization

### Adding New Pages

1. Create a new file in `src/app/[page-name]/page.tsx`
2. Wrap content with `DashboardLayout`
3. Update navigation in `src/data/placeholder.ts`

### Adding New Components

1. Create component in appropriate folder under `src/components/`
2. Export from `src/components/index.ts`
3. Import and use in pages

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## License

MIT License - Feel free to use for personal or commercial projects.
