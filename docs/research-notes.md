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

### Coordinate System (Three.js Mathematical Convention)

**Cartesian Coordinates (Right-Hand Rule):**

- **X-axis**: Right direction (positive = right)
- **Y-axis**: Up direction (positive = up)
- **Z-axis**: Forward direction (positive = toward viewer)

**Spherical Coordinates ([Three.js docs](https://threejs.org/docs/#api/en/math/Spherical)):**

- **radius**: Distance from origin
- **phi**: Polar angle from Y-axis (0 = top, π/2 = XZ-plane, π = bottom)
- **theta**: Azimuthal angle around Y-axis (0 = +Z, π/2 = +X, π = -Z, 3π/2 = -X)

**Value Network Layout:**

- **2D**: Values arranged in XZ-plane (phi = π/2) around Y-axis
- **3D**: Values can spread along Y-axis via clustering forces (variable phi)
- **Quadrants**: Theta ranges map to Schwartz domains in XZ-plane

### Network Architecture

**Ego Network Structure:**

- **20 Total Nodes**: 1 central "You" node + 19 Schwartz value nodes
- **Hub-Spoke Topology**: Only primary edges (center ↔ values), no value-to-value connections in base layout
- **No MRAT Centering**: Use raw value scores directly (mean of 3 questions per value)

**Distance Formula:**

```math
baseDistance = 0.08 * canvasWidth \\
distanceIncrement = 0.08 * canvasWidth \\\\
distance = baseDistance + (maxScore - currentScore) * distanceIncrement
```

**Polar Positioning System:**

- **4 Quadrants (90° each)**:
  - Openness to Change: θ = 0-90°
  - Self-Transcendence: θ = 90-180°
  - Conservation: θ = 180-270°
  - Self-Enhancement: θ = 270-360°
- **2D**: Polar coordinates (r, θ)
- **3D**: Spherical coordinates (r, θ, φ) - φ determined by domain clustering forces

### Visual Specifications

**Node Colors:**

- Openness-to-change: `hsla(30, 95%, 52%, 1)`
- Self-enhancement: `hsla(0, 95%, 55%, 1)`
- Conservation: `hsla(210, 92%, 58%, 1)`
- Self-transcendence: `hsla(125, 90%, 48%, 1)`
- "You" node: White for maximum contrast

**Node Sizing:**

- **Value Nodes**: Scaled by raw importance score (same formula as distance, but for node radius)
- **"You" Node**: Diameter = 2x largest value node radius
- **All Shapes**: Perfect circles (2D) / spheres (3D)

**Hover Interactions:**

- **Primary Edge**: Thicker line + node highlight with backdrop glow
- **Secondary Edges**: all-to-all within same domain, 1/3 thickness, domain color
- **Dimming Effect**: Non-highlighted nodes slightly dimmed for contrast

### Technical Implementation

**Canvas Integration:**

- **Location**: Inside existing Box container in VisualizationView.tsx
- **Size**: 1000x1000px base, dynamically scaled to fit parent
- **Responsive**: 90% viewport (small screens), 70% viewport (large screens), max-width 1000px
- **Component Structure**: Single smart component in `src/components/visualization/` (no subdirs)

**r3f-forcegraph Configuration:**

- **Library**: r3f-forcegraph v1.1.1
- **Mode Switching**: `numDimensions` prop (2 or 3)
- **Force Engine**: d3 with custom physics for domain clustering
- **Fixed Center**: "You" node at [0,0,0], values cluster by domain
- **Physics**: Hierarchical forces affect φ and θ only, not r

**Data Pipeline:**

- **Transformation**: ValueProfile → GraphData in `src/lib/schwartz/`
- **Physics**: Force calculations in `src/lib/physics/`
- **Integration**: VisualizationContext for state management

## Current Decisions

### Questionnaire

- **Items:** Full 57-item PVQ-RR questionnaire
- **Languages:** 40+ languages available (ONLY english will be used)
- **Normalization:** Instructions available, scoring implemented and saved in ValueProfile

### Academic Considerations

**Node Size Scaling Decision:**

- **Research Question Context**: "To what extent do 3D network visualizations affect users' comprehension of their personal values?"
- **Academic Approach**: Use adapted distance formula for size scaling - maintains interpretability and consistency
- **Formula**: `nodeSize = baseSize + (maxScore - rawValueScore) * sizeIncrement` where higher scores = larger nodes

**Physics Strategy Decision:**

- **Approach**: Hybrid physics with fixed radial distances but flexible angular clustering
- **Implementation**: Secondary edges as invisible springs for domain clustering (visible only on hover)
- **Constraint**: Angular forces affect φ only, θ and r remain consistent per specifications
- **Goal**: Natural domain clustering while maintaining quadrant structure and utilizing the full angular space around the center node! But having the consistent distance scaling from center to encode importance is crucial!

### Technical Priorities

- **Current Focus:**
  - Implement ego network with r3f-forcegraph v1.1.1
  - Build hierarchical clustering physics system
  - Integrate with existing VisualizationContext
- **Architecture**: Single smart component for 2D/3D rendering
- **Data Flow**: Raw scores → polar/spherical positioning → r3f-forcegraph format

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
