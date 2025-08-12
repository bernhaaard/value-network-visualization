# Research Notes & Decisions

## Implementation Strategy

**Data-First Approach:** Implement questionnaire → analyze raw data → design visualization based on actual data structure

## Phase 1: Data Foundation & Directory Structure

### Immediate Tasks

- [x] Create organized directory structure with barrel exports
- [x] Download PVQ-RR questionnaire (57 items, English/German)
- [x] Implement questionnaire interface and data collection
- [x] Set up React Context API for state management
- [x] Research localStorage persistence strategy for Context

### User Flow Definition

1. **Signup** → 2. **PVQ-RR Questionnaire** → 3. **Task Instructions** → 4. **2D Visualization Tasks** → 5. **3D Visualization Tasks** → 6. **Post-Task Questionnaire** → 7. **Free Exploration Playground** (both 2D/3D) + **Optional Additional Feedback**

### Data Storage Strategy

- **Primary:** React Context API for state management
- **Persistence:** localStorage (implemented) → Supabase sync (decision pending, not implemented)
- **Question:** What Context should persist in DB? When should it sync!

## Phase 2: Research & Data Structure **Design**

### Correlation Matrix Strategy

#### Problem

- Need 19x19 correlation matrix (171 unique correlations)
- Schwartz et al. (2012) only provides summary statistics
- Raw data not publicly available

#### Solution Approach

- Implemented interchangeable correlation strategies
- Should be able to swap between approaches without changing visualization code
- Three strategies ready:
  1. Simple circumplex (r = cos(θ))
  2. Calibrated circumplex (r = 0.38*cos(θ) + 0.12)
  3. Empirical (ready for real data if available)

#### Status

- [x] Strategy pattern implemented
- [x] Force simulation supports strategy swapping
- [ ] Awaiting Lucas meeting for final decision
- [ ] Contacted Schwartz for original data (12.09.2025)

### Schwartz Framework Research Session

- [x] Analyze available 2D diagrams from papers
- [x] Research if 19x19 relationship matrix exists
- [ ] Design translation from circular model to network graph (I came up with a few ideas, but they need testing to choose which one)
- [ ] Define exact data structures based on questionnaire output

### Data Analysis

- [x] Examine raw PVQ-RR response structure (57 items)
- [x] Understand normalization process (0-1 scores)
- [ ] Map responses to 19 value dimensions
- [ ] Design network node properties (size, color, position)

## Phase 3: Visualization Implementation

### After Data Structure is Clear

- [ ] Three.js scene setup (2D/3D unified approach)
- [ ] Custom physics engine for relationship-driven layout
- [ ] Network rendering with actual user data
- [ ] Experimentation with visual properties

## Current Decisions

### Questionnaire

- **Items:** Full 57-item PVQ-RR questionnaire
- **Languages:** 40+ languages available (ONLY english implemented atm, german might be needed)
- **Normalization:** Instructions available, needs implementation

### Technical Priorities

- **Current Focus:**
  - Implement value score calculations from PVQ-RR
  - Data Normalization and visualization code
  - Create correlation strategy interface
  - Build basic force simulation
  - Test with simple circumplex
- **Delay:** Exact relationship matrices until data from Cieciuch/Vecchione is available (Using browne model (1992) until then)
- **Flexibility:** Visual properties to be determined through experimentation

## Key Research Questions

### Data Storage

- **Context Persistence:** What data should be stored on the supabase DB?
- **User Login:** Do I need user login or can I store data without users ever having to login simply syncing when all data needed is available on the website?
- **Sync Strategy:** How to handle Context ↔ Supabase synchronization?

### Schwartz Implementation

- **Matrix Existence:** Does a standard 19x19 compatibility matrix exist?
- **Graph Translation:** How to convert circular model to network layout?
- **Force Calculations:** What algorithms best represent value relationships?

### User Study Design

- **Task Definition:** Specific exploration tasks for 2D vs 3D comparison
- **Metrics:** Time, interactions, insights, user preferences
- **Feedback Collection:** Structure for qualitative insights
- **Demographic Data:** Does it make sense to collect Socioeconomic, Religious affiliations, or Political orientaion from participants?

## Backend Decision: Supabase

- **Rationale:** TypeScript support, real-time capabilities, ease of setup
- **Implementation:** After Context API and localStorage strategy are finalized
