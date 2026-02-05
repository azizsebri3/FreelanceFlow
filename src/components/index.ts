/* ==========================================================================
   Components Index
   Re-export all components for easier imports
   ========================================================================== */

// Layout Components
export { default as Sidebar } from './layout/Sidebar';
export { default as Header } from './layout/Header';
export { default as DashboardLayout } from './layout/DashboardLayout';

// Card Components
export { default as StatCard } from './cards/StatCard';

// Table Components
export { default as ProjectsTable } from './tables/ProjectsTable';
export { default as InvoicesTable } from './tables/InvoicesTable';

// Chart Components
export { default as RevenueChart } from './charts/RevenueChart';
export { default as ProjectStatusChart } from './charts/ProjectStatusChart';
export { default as RevenueTrendChart } from './charts/RevenueTrendChart';
export { default as ProjectsByClientChart } from './charts/ProjectsByClientChart';
export { default as IncomeByTypeChart } from './charts/IncomeByTypeChart';

// Activity Components
export { default as ActivityFeed } from './activity/ActivityFeed';

// Message Components
export { MessageComposer, MessageList, ConversationView } from './messages';
export type { Message } from './messages';
