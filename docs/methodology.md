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
- Normalized scores (Bias correction)
- Individual value profile

### Output: Network Properties (WiP - Not Final)

- **Node size:** Personal importance score
- **Node color:** Higher-order value domain
- **Node position:** Force-directed layout based on relationships
- **Edge strength:** Perhaps theoretical relationship weight (not clear yet)

## Implementation Requirements

### Core Components

- [x] PVQ-RR questionnaire interface
- [ ] Custom physics engine for positioning
- [ ] Three.js network renderer (2D/3D modes)
- [x] User study data collection interface (demographics)

### Research Validation

- [ ] Identical interaction patterns between 2D/3D
- [ ] Deterministic force calculations for reproducible layouts
- [ ] Measurable exploration metrics (time, (interactions?))
- [ ] Qualitative insight collection methods

## Technical Justification

**Why Three.js for both 2D and 3D?**
*(may still be changed though)*

- Eliminates library differences as confounding variable,
- Identical interaction experience for users
- Academic validity through controlled comparison

**Why custom physics over D3 force simulation?**

- Complete control over relationship modeling
- Theory-driven force calculations
- Consistent behavior across 2D/3D modes
- No external dependency issues
