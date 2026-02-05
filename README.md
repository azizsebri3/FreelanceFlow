# FreelanceFlow

A modern SaaS dashboard for freelancers to manage clients, projects, and invoices.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
