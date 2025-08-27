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

1. **Landing Page** → 2. **Demographics** 3. **PVQ-RR Questionnaire** → 4. **Viz Task Instructions** → 5. **2D + 3D Visualization Exploration** → 6. **Post-Task Questionnaire** (the user should be able to toggle back and forth between feedback and the two visualizations)

### Data Storage Strategy

- **Primary:** React Context API for state management
- **Persistence:** localStorage (implemented) → Supabase sync (simple minimalist model, direct connection with nextjs server api - not implemented)
- **Question:** What Context values exactly should persist in DB? When should they sync! I think single calls to the db at the end of each phase should be sufficient.

## Phase 2: Research & Data Structure **Design**

### Correlation Matrix Strategy

#### Problem

- Need 19x19 correlation matrix (171 unique correlations)
- Schwartz et al. (2012) only provides summary statistics
- Raw data not publicly available

#### Solution Approach

- Implemented hierarchical Correlation pattern
- In the refined 19 value circumplex higher order groupings (domains) exist which can be used for clustering
- The Circumplex also includes 2 additional layers for these dimensions: 1. Social focus vs Personal Focus and 2. Growth (Anxiety-Free) vs Self-Protection (Anxiety-Avoidance)
- For now the higher order values will be used used and the other 2 dimensions might be added later!
- If I get my hands on the empirical data from Schwartz et. al I might consider using those!

#### Status

- [x] Contacted Schwartz for original data (12.09.2025)
- [x] Lucas said to use the hierarchical clusters
- [ ] Force simulation uses hierarchical information

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
- **Languages:** 40+ languages available (ONLY english will be used)
- **Normalization:** Instructions available, scoring implemented and saved in ValueProfile

### Technical Priorities

- **Current Focus:**
  - Refactor Correlation interface to use Hierarchical approach and no Strategy pattern
  - Build basic force simulation
  - Test with simple circumplex data
- **Delay:** Exact relationship matrices until data from Cieciuch/Vecchione is available (Using hierarchical model (2012) until then)
- **Flexibility:** Exact visual properties to be determined through experimentation

## Key Research Questions

### Data Storage

- **Context Persistence:** What data should be stored on the supabase DB?
- **User Login:** NO user login is needed simple direct api calls with validation and built in security from supabase is sufficient!
- **Sync Strategy:** When exactly to handle Context ↔ Supabase connection? What to store at each step!

### Schwartz Implementation

- **Matrix Existence:** Does a standard 19x19 compatibility matrix exist? Not publicly!
- **Graph Translation:** How to convert circular model to network layout?
- **Force Calculations:** What algorithms best represent value relationships?

### User Study Design

- **Task Definition:** Should I ask users to do specific exploration tasks for 2D vs 3D comparison
- **Metrics:** Time, interactions, insights, user preferences
- **Feedback Collection:** Structure for qualitative insights
- **Demographic Data:** Include a non-binary and prefer not to say option, and add third gender neutral version of the questionnaire which should be loaded when the non binary or prefer not to say is selected!

## Backend Decision: Supabase

- **Rationale:** TypeScript support, real-time capabilities, ease of setup
- **Implementation:** After Context API and localStorage strategy are finalized
