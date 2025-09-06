# Research Notes

## Project Overview

**Data-First Approach:** Implement questionnaire → analyze raw data → design visualization based on actual data structure

**Current Progress**: The visualization is working! I need to add proper data collection and fix a few UI issues before launching the user study.

## Implementation Achievements

### What's Working Now ✅

- **Questionnaire system** with all 57 PVQ-RR questions and proper scoring
- **2D/3D network visualization** that looks good enough and responds to user interactions
- **User flow:** landing page → demographics → questionnaire → visualization
- **Hover effects** with node highlighting and tooltips showing value information

### The Technical Approach ✅

- **Positioning logic**: Radial distance = importance, theta = domain, phi = anxiety-aversion
- **Consistent between modes**: Same core information, just different viewing angles, but 3D adds anxiety aversion dimension
- **Math implementation**: Using sin functions to map anxiety weights

## Technical Implementation Decisions

**Anxiety Mapping**: I tried multiple approaches, but ended up using a sin function approach where I split values into growth vs self-protection groups. Each group gets mapped to π radians which gives me the tilt effect.

**2D vs 3D Physics**: 2D locks positions in place, 3D lets the anxiety dimension move values vertically while keeping distances from center the same. This way both modes show identical importance relationships through radial distance from the ego node ("You" at the center).

## Open tasks

### Must-Have Before User Study

- Track how long users spend in each mode (this is the main research metric)
- Set up Supabase to actually save the relevant study data
- Fix the light mode colors - center node and links are barely visible
- Write better instructions so users know what they're looking at
- Add non-binary gender options

### Nice-to-Have

- Remove debug pages so users can't accidentally break things
- Clean up code comments for thesis review

## My Research Approach

**Study Design**: I'm letting users explore freely instead of giving them specific tasks. I think natural exploration will show me more about comprehension than forcing them through artificial exercises.

**What I'm Measuring**: Mainly time spent in each mode, plus their feedback on which one helped them understand their values better. Also tracking which values they actually look at.

**Data Strategy**: Saving everything at the end when they finish, not during the session. Simpler and less likely to break.

**The 3D Dimension**: Using the anxiety-aversion aspect from Schwartz theory gives 3D something meaningful that 2D can't show. It's not just adding a dimension for the sake of it.
