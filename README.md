# Human Value System Visualization

Interactive 3D visualization of human value systems using Schwartz's framework - Bachelor thesis project comparing 2D vs 3D network representations.

## Project Overview

This thesis investigates whether 3D network visualizations of human value systems improve user comprehension compared to traditional 2D approaches, using Schwartz's refined 19-value framework and the PVQ-RR questionnaire.

**Key Innovation:** Relationship-driven network layout where similar values cluster spatially and opposing values are positioned apart, forming intuitive "value clouds."

## Technology Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Chakra UI v3
- **Visualization:** Three.js + React Three Fiber + Drei
- **Backend:** Supabase (PostgreSQL + Auth + API)
- **Physics:** Custom relationship-driven force calculations

## Technical Approach

- **Unified Rendering:** Three.js for both 2D (orthographic) and 3D (perspective) views
- **Theoretical Layout:** Schwartz relationship matrix drives spatial positioning
- **Individual Customization:** PVQ-RR responses affect node size, color, and positioning strength
- **Value Clusters:** Four higher-order domains form spatial clusters

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration (server-side only - never exposed to client)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
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

### 4. Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
npm run type-check   # Run TypeScript type checking
```

## Project Structure

```dir
.
├── .env.local
├── .gitignore
├── .prettierignore
├── .prettierrc
├── docs
│   ├── methodology.md
│   ├── PVQ-RR
│   │   ├── Analysis_instructions_PVQ-RR.md
│   │   └── PVQ-RR_Eng_M&F.md
│   └── research-notes.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   └── ValueNetworkExample*.png    # Network visualization previews
├── README.md
├── src
│   ├── app
│   │   ├── (study)                 # Complete user study flow
│   │   │   ├── questionnaire       # Demographics → PVQ-RR questions
│   │   │   └── visualization       # 2D/3D network exploration
│   │   ├── api
│   │   │   └── study               # Research data endpoints
│   │   │       ├── complete        # Final data submission
│   │   │       └── session         # Session management
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Landing page with consent
│   ├── components
│   │   ├── forms                   # Demographics & feedback forms
│   │   ├── ui                      # Base UI components + consent dialog
│   │   ├── views                   # Page view components
│   │   └── visualization           # Value network visualization
│   ├── hooks                       # Custom React hooks
│   ├── lib
│   │   ├── context                 # React Context API (questionnaire + viz)
│   │   ├── database                # Supabase integration & study service
│   │   ├── questionnaire           # PVQ-RR questionnaire data
│   │   ├── schwartz                # Schwartz framework scoring & types
│   │   ├── utils                   # Utility functions & session analytics
│   │   └── visualization           # Network positioning & value definitions
│   ├── theme                       # Chakra UI theme configuration
│   └── types                       # TypeScript type definitions
├── tsconfig.json
└── vitest.config.ts
```

## Research Documentation

- [Research Notes](./docs/research-notes.md) - Ongoing research decisions and findings
- [Methodology](./docs/methodology.md) - User study design and procedures
- [PVQ-RR Questionnaire](./docs/PVQ-RR/) - Portrait Values Questionnaire materials

## Academic Context

- **Student**: Bernhard Kofler
- **Program**: Creative Computing, St. Pölten University of Applied Sciences
- **Research Question**:
"To what extent do 3D network visualizations of human value systems, compared
to 2D approaches, affect users' comprehension of their personal values and their
connections to overarching societal values, as measured by exploration time and
self-reported insights?"

## License

MIT
