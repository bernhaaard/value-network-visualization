# Research Notes & Decisions

## Immediate Research Tasks

- [ ] PVQ-RR scoring methodology
- [ ] Schwartz 19-value framework implementation
- [ ] Backend service selection (Firebase vs Supabase)

## Immediate Technical Tasks

- [ ] Create React TypeScript app
- [ ] Install Three.js and component library dependencies
- [ ] Research PVQ-RR scoring methodology (57 items → 19 values)
- [ ] Define Schwartz relationship matrix values

## Implementation Priorities

### Phase 1: Foundation

- [ ] Basic Three.js scene setup
- [ ] Simple node rendering (spheres/circles)
- [ ] Camera switching (orthographic ↔ perspective)

### Phase 2: Data Integration

- [ ] PVQ-RR questionnaire form
- [ ] Response processing to value scores
- [ ] Node property mapping (size, color, position)

### Phase 3: Physics System

- [ ] Relationship matrix implementation
- [ ] Custom force calculation functions
- [ ] Dynamic layout updates

### Phase 4: User Study

- [ ] Task definition for both visualizations
- [ ] Timing and interaction tracking
- [ ] Insight collection interface

## Key Research Questions

- **Schwartz relationships:** How to quantify compatibility/opposition between specific value pairs?
- **Force balance:** What force strengths create stable, intuitive layouts?
- **Individual weighting:** How much should personal importance affect positioning?
- **Convergence criteria:** When does the layout reach stable equilibrium?

## Backend Decision: Firebase vs Supabase

- **Consider:** Real-time capabilities, ease of setup, TypeScript support
- **Timeline:** Decision needed before user study implementation
- **Current lean:** Firebase (familiar, extensive documentation)
