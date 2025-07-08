# Technical Methodology

## Visualization Approach

### Network Structure

- **19 individual values** as nodes (Schwartz's refined framework)
- **Relationship-driven positioning** based on theoretical compatibility/opposition
- **Value clouds** formed by spatial clustering of related values
- **Individual customization** through PVQ-RR importance scores

### Rendering Strategy

- **Three.js for both 2D and 3D** (eliminates technology as confounding variable)
- **2D Mode:** Orthographic camera, z=0 plane positioning
- **3D Mode:** Perspective camera, full 3D spatial arrangement
- **Consistent interaction patterns** across both modes

### Physics Implementation

- **Custom force calculations** (no external physics libraries)
- **Attraction forces** between similar values
- **Repulsion forces** between opposing values
- **Cluster forces** to maintain higher-order domain groupings
- **Individual weighting** based on personal importance scores

## Data Processing Pipeline

### Input: PVQ-RR Responses

- 57 questionnaire items → 19 value importance scores
- Normalized scores (0-1 range)
- Individual value profile generation

### Output: Network Properties

- **Node size:** Personal importance score
- **Node color:** Higher-order value domain
- **Node position:** Force-directed layout based on relationships
- **Edge strength:** Theoretical relationship weight

## Implementation Requirements

### Core Components

- [ ] PVQ-RR questionnaire interface
- [ ] Value relationship matrix (19x19)
- [ ] Custom physics engine for positioning
- [ ] Three.js network renderer (2D/3D modes)
- [ ] User study data collection interface

### Research Validation

- [ ] Identical interaction patterns between 2D/3D
- [ ] Consistent force calculations for reproducible layouts
- [ ] Measurable exploration metrics (time, interactions)
- [ ] Qualitative insight collection methods

## Technical Justification

**Why Three.js for both 2D and 3D?**

- Eliminates library differences as confounding variable
- Ensures identical interaction paradigms
- Unified codebase reduces complexity
- Academic validity through controlled comparison

**Why custom physics over D3 force simulation?**

- Complete control over relationship modeling
- Theory-driven force calculations
- Consistent behavior across 2D/3D modes
- No external dependency synchronization issues
