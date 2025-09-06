# Technical Methodology

## Visualization Architecture

**Ego Network Design**: I chose a simple hub-and-spoke layout with 20 nodes - one central "You" node connected to 19 Schwartz values. Distance from center shows how important each value is to you personally, while the angular position follows Schwartz's theoretical relationships.

**2D vs 3D Approach**: Both modes use the same Three.js rendering to avoid any technology differences that could mess up the comparison. 2D uses an orthographic camera looking down, 3D uses perspective with smooth transitions between them.

**3D Enhancement**: The third dimension maps values to their anxiety-aversion orientation (Growth vs Self-Protection) from Schwartz's refined theory. This gives the 3D version something meaningful that 2D can't show, without changing the core distance/importance relationships.

## Data Collection Framework

**Input Pipeline**: Demographics → PVQ-RR (57 items) → Value Profile calculation → Network visualization

**Quantitative Metrics**:

- Exploration time per mode (primary research outcome)
- Mode switching frequency and patterns  
- Node interaction coverage (which values explored)

**Qualitative Feedback**:

- Mode preference comparisons
- Self-reported value insights

## Research Validation Controls

**Keeping Things Consistent**: The most important thing is that node sizes, colors, and distances from center stay exactly the same between 2D and 3D. The only difference is that 3D spreads values vertically based on their anxiety orientation - this way I'm only testing the effect of dimensionality, not different information.

**Making Results Reliable**: I use mathematical functions instead of random positioning to show theoretical relationships, so users see the same general layouts but with differing distances/sizes for each value node!

**Why This Approach Works**: Using the same rendering engine for both modes eliminates technical differences. Users get identical interaction patterns (hover, zoom, etc.) so the only variable is the dimensional presentation.
