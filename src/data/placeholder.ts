/* ==========================================================================
   FreelanceFlow - Placeholder Data
   Mock data for dashboard components - Replace with actual API calls
   ========================================================================== */

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface StatData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: 'clients' | 'projects' | 'revenue' | 'invoices';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'in-progress' | 'completed' | 'on-hold' | 'pending';
  deadline: string;
  budget: number;
  progress: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  issuedDate: string;
  workItems: WorkItem[];
  logoUrl?: string;
  notes?: string;
  taxRate?: number;
}

export interface WorkItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ProjectStatusData {
  name: string;
  value: number;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: 'active' | 'inactive';
}

export interface Activity {
  id: string;
  type: 'payment' | 'project' | 'client' | 'invoice' | 'message';
  title: string;
  description: string;
  timestamp: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

// ==========================================================================
// Stats Data
// ==========================================================================

export const statsData: StatData[] = [
  {
    id: '1',
    title: 'Total Clients',
    value: '48',
    change: 12,
    changeType: 'increase',
    icon: 'clients',
  },
  {
    id: '2',
    title: 'Active Projects',
    value: '12',
    change: 8,
    changeType: 'increase',
    icon: 'projects',
  },
  {
    id: '3',
    title: 'Monthly Revenue',
    value: '$24,580',
    change: 15.3,
    changeType: 'increase',
    icon: 'revenue',
  },
  {
    id: '4',
    title: 'Unpaid Invoices',
    value: '7',
    change: 3,
    changeType: 'decrease',
    icon: 'invoices',
  },
];

// ==========================================================================
// Clients Data
// ==========================================================================

export const clientsData: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    company: 'TechCorp Inc.',
    phone: '+1 (555) 123-4567',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@startupxyz.com',
    company: 'StartupXYZ',
    phone: '+1 (555) 234-5678',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@localbusiness.com',
    company: 'Local Business Co.',
    phone: '+1 (555) 345-6789',
    status: 'active',
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@enterprise.com',
    company: 'Enterprise Ltd.',
    phone: '+1 (555) 456-7890',
    status: 'active',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@growthhub.com',
    company: 'GrowthHub',
    phone: '+1 (555) 567-8901',
    status: 'active',
  },
];

// ==========================================================================
// Projects Data
// ==========================================================================

export const projectsData: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Redesign',
    client: 'TechCorp Inc.',
    status: 'in-progress',
    deadline: '2026-02-28',
    budget: 15000,
    progress: 65,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: 'StartupXYZ',
    status: 'in-progress',
    deadline: '2026-03-15',
    budget: 25000,
    progress: 40,
  },
  {
    id: '3',
    name: 'Brand Identity Package',
    client: 'Local Business Co.',
    status: 'completed',
    deadline: '2026-01-30',
    budget: 5000,
    progress: 100,
  },
  {
    id: '4',
    name: 'Website Maintenance',
    client: 'Enterprise Ltd.',
    status: 'on-hold',
    deadline: '2026-04-01',
    budget: 2500,
    progress: 20,
  },
  {
    id: '5',
    name: 'SEO Optimization',
    client: 'GrowthHub',
    status: 'pending',
    deadline: '2026-02-15',
    budget: 3500,
    progress: 0,
  },
];

// ==========================================================================
// Invoices Data
// ==========================================================================

export const invoicesData: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-001',
    client: 'TechCorp Inc.',
    amount: 7500,
    status: 'paid',
    dueDate: '2026-02-15',
    issuedDate: '2026-01-15',
    workItems: [
      {
        id: '1',
        description: 'Website Development',
        quantity: 40,
        rate: 150,
        amount: 6000,
      },
      {
        id: '2',
        description: 'UI/UX Design',
        quantity: 20,
        rate: 75,
        amount: 1500,
      },
    ],
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iOCIgZmlsbD0iIzNDNTBFMCIvPgo8dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZGCjwvdGV4dD4KPHN2Zz4K',
    notes: 'Thank you for your business!',
    taxRate: 0.08,
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-002',
    client: 'StartupXYZ',
    amount: 12500,
    status: 'pending',
    dueDate: '2026-02-28',
    issuedDate: '2026-01-28',
    workItems: [
      {
        id: '1',
        description: 'Mobile App Development',
        quantity: 80,
        rate: 125,
        amount: 10000,
      },
      {
        id: '2',
        description: 'API Integration',
        quantity: 20,
        rate: 125,
        amount: 2500,
      },
    ],
    notes: 'Payment due within 30 days.',
    taxRate: 0.08,
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-003',
    client: 'Local Business Co.',
    amount: 5000,
    status: 'paid',
    dueDate: '2026-01-30',
    issuedDate: '2026-01-01',
    workItems: [
      {
        id: '1',
        description: 'E-commerce Setup',
        quantity: 50,
        rate: 100,
        amount: 5000,
      },
    ],
    notes: 'Payment received - thank you!',
    taxRate: 0.08,
  },
  {
    id: '4',
    invoiceNumber: 'INV-2026-004',
    client: 'Enterprise Ltd.',
    amount: 1250,
    status: 'overdue',
    dueDate: '2026-01-20',
    issuedDate: '2025-12-20',
    workItems: [
      {
        id: '1',
        description: 'Consulting Services',
        quantity: 10,
        rate: 125,
        amount: 1250,
      },
    ],
    notes: 'Payment is overdue. Please contact us.',
    taxRate: 0.08,
  },
  {
    id: '5',
    invoiceNumber: 'INV-2026-005',
    client: 'GrowthHub',
    amount: 3500,
    status: 'pending',
    dueDate: '2026-03-01',
    issuedDate: '2026-02-01',
    workItems: [
      {
        id: '1',
        description: 'SEO Optimization',
        quantity: 25,
        rate: 140,
        amount: 3500,
      },
    ],
    notes: 'Monthly SEO services.',
    taxRate: 0.08,
  },
];

// ==========================================================================
// Revenue Chart Data
// ==========================================================================

export const revenueData: RevenueData[] = [
  { month: 'Aug', revenue: 18500, expenses: 8200 },
  { month: 'Sep', revenue: 22300, expenses: 9100 },
  { month: 'Oct', revenue: 19800, expenses: 7800 },
  { month: 'Nov', revenue: 26400, expenses: 10500 },
  { month: 'Dec', revenue: 31200, expenses: 12300 },
  { month: 'Jan', revenue: 24580, expenses: 9800 },
];

// ==========================================================================
// Project Status Chart Data
// ==========================================================================

export const projectStatusData: ProjectStatusData[] = [
  { name: 'In Progress', value: 5, color: '#3C50E0' },
  { name: 'Completed', value: 8, color: '#10B981' },
  { name: 'On Hold', value: 2, color: '#F59E0B' },
  { name: 'Pending', value: 3, color: '#64748B' },
];

// ==========================================================================
// Activity Feed Data
// ==========================================================================

export const activityData: Activity[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Payment Received',
    description: 'TechCorp Inc. paid invoice #INV-2026-001',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'project',
    title: 'Project Milestone',
    description: 'E-Commerce Redesign reached 65% completion',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    type: 'client',
    title: 'New Client Added',
    description: 'GrowthHub was added as a new client',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    type: 'invoice',
    title: 'Invoice Created',
    description: 'Invoice #INV-2026-005 sent to GrowthHub',
    timestamp: '1 day ago',
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message',
    description: 'StartupXYZ sent feedback on mobile app design',
    timestamp: '2 days ago',
  },
  {
    id: '6',
    type: 'project',
    title: 'Project Completed',
    description: 'Brand Identity Package marked as complete',
    timestamp: '3 days ago',
  },
];

// ==========================================================================
// Navigation Items
// ==========================================================================

export const navigationItems: NavigationItem[] = [
  { id: '1', label: 'Dashboard', icon: 'dashboard', href: '/' },
  { id: '2', label: 'Projects', icon: 'projects', href: '/projects', badge: 12 },
  { id: '3', label: 'Clients', icon: 'clients', href: '/clients' },
  { id: '4', label: 'Invoices', icon: 'invoices', href: '/invoices', badge: 3 },
  { id: '5', label: 'Calendar', icon: 'calendar', href: '/calendar' },
  { id: '6', label: 'Messages', icon: 'messages', href: '/messages', badge: 5 },
  { id: '7', label: 'Reports', icon: 'reports', href: '/reports' },
  { id: '8', label: 'Settings', icon: 'settings', href: '/settings' },
];

// ==========================================================================
// User Data (for header)
// ==========================================================================

export const userData = {
  name: 'John Doe',
  email: 'john@freelanceflow.com',
  avatar: '/avatar-placeholder.png',
  role: 'Freelancer',
};
