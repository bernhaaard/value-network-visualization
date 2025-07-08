# Value Network Visualization

Interactive 2D/3D platform for value network analysis and exploration. Built for academic research with a focus on user studies and data visualization.

## Tech Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Chakra UI v3
- **Visualization:** Three.js + React Three Fiber + Drei
- **Backend:** Supabase (PostgreSQL + Auth + API)
- **Physics:** Custom relationship-driven force calculations

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get your Supabase credentials:**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose **"Use public schema for Data API"** when prompted
3. Navigate to **Settings > API** in your project dashboard
4. Copy the **Project URL** and **anon/public key**

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```dir
src/
├── app/                # Next.js App Router pages
├── components/
│   └── ui/             # Reusable UI components
├── lib/                # Utilities and configurations
└── docs/               # Documentation and SQL migrations
```

## Contributing

This is a bachelor thesis project for Creative Computing at FH St. Pölten.

## License

Academic use only.
