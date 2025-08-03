# Research Notes & Decisions

## Updated Implementation Strategy

**Data-First Approach:** Implement questionnaire → analyze raw data → design visualization based on actual data structure

## Phase 1: Data Foundation & Directory Structure

### Immediate Tasks

- [x] Create organized directory structure with barrel exports
- [x] Download PVQ-RR questionnaire (57 items, English/German)
- [ ] Implement questionnaire interface and data collection
- [x] Set up React Context API for state management
- [x] Research localStorage persistence strategy for Context

### User Flow Definition

1. **Signup** → 2. **PVQ-RR Questionnaire** → 3. **Task Instructions** → 4. **2D Visualization Tasks** → 5. **3D Visualization Tasks** → 6. **Post-Task Questionnaire** → 7. **Free Exploration Playground** (both 2D/3D) + **Optional Additional Feedback**

### Data Storage Strategy

- **Primary:** React Context API for state management
- **Persistence:** localStorage (decision pending) → Supabase sync
- **Question:** Should Context persist via localStorage before DB connection?

## Phase 2: Research & Data Structure **Design**

### Schwartz Framework Research Session

- [ ] Analyze available 2D diagrams from papers
- [ ] Research if 19x19 relationship matrix exists
- [ ] Design translation from circular model to network graph
- [ ] Define exact data structures based on questionnaire output

### Data Analysis

- [ ] Examine raw PVQ-RR response structure (57 items)
- [ ] Understand normalization process (0-1 scores)
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
- **Languages:** English/German available (40+ others if needed)
- **Normalization:** Instructions available, needs implementation

### Technical Priorities

- **Focus:** Directory structure and questionnaire implementation first
- **Delay:** Exact relationship matrices until raw data analysis
- **Flexibility:** Visual properties to be determined through experimentation

## Key Research Questions

### Data Storage

- **Context Persistence:** Should React Context use localStorage backup?
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
