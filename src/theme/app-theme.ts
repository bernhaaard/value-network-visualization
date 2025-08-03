import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

/**
 * Core color palette for the application.
 */
const palette = {
  // Background colors
  bg: {
    primary: {
      light: { value: "#FEFCFA" },
      dark: { value: "#0F1419" },
    },
    secondary: {
      light: { value: "#F8F4F0" },
      dark: { value: "#1E2936" },
    },
    muted: {
      light: { value: "#f6f0ea" }, // Neutral slightly beige color
      dark: { value: "#17202A" }, // Cool neutral dark gray
    },
    accent: {
      light: { value: "hsl(30, 25%, 94%)" }, // Light orange tint for accent backgrounds
      dark: { value: "hsl(30, 15%, 16%)" }, // Dark orange tint for accent backgrounds
    },
    selected: {
      light: { value: "hsl(30, 30%, 90%)" }, // Orange for selected states
      dark: { value: "hsl(30, 30%, 20%)" }, // Orange for selected states
    },
    overlay: {
      light: { value: "rgba(255, 255, 255, 0.95)" },
      dark: { value: "rgba(15, 20, 25, 0.95)" },
    },
  },

  // Text colors
  text: {
    primary: {
      light: { value: "#2B1A0F" },
      dark: { value: "#E6E8EA" },
    },
    secondary: {
      light: { value: "#5B4A3F" },
      dark: { value: "#A8B2C1" },
    },
    subtle: {
      light: { value: "#8B7A6F" },
      dark: { value: "#7D8B9A" },
    },
  },

  // Orange accent scale for interactive elements
  orange: {
    darkest: {
      light: { value: "hsl(30, 85%, 28%)" }, // Rich, darker orange
      dark: { value: "hsl(30, 90%, 22%)" },
    },
    dark: {
      light: { value: "hsl(30, 90%, 42%)" }, // Vibrant medium orange
      dark: { value: "hsl(30, 85%, 38%)" },
    },
    primary: {
      light: { value: "hsl(30, 95%, 45%)" }, // Interactive - Intense but controlled
      dark: { value: "hsl(30, 95%, 52%)" },
    },
    light: {
      light: { value: "hsl(30, 80%, 60%)" }, // Warm light orange
      dark: { value: "hsl(30, 80%, 68%)" },
    },
    lightest: {
      light: { value: "hsl(30, 65%, 75%)" }, // Very light orange
      dark: { value: "hsl(30, 65%, 85%)" },
    },
  },

  // Status colors
  status: {
    error: {
      light: { value: "#DC2626" },
      dark: { value: "#FF3333" },
    },
    success: {
      light: { value: "#15803D" },
      dark: { value: "#32CD32" },
    },
    warning: {
      light: { value: "#CA8A04" },
      dark: { value: "#DAA520" },
    },
  },

  // UI colors
  border: {
    default: {
      light: { value: "hsl(30, 30%, 80%)" },
      dark: { value: "hsl(210, 15%, 25%)" },
    },
    subtle: {
      light: { value: "hsl(30, 20%, 88%)" },
      dark: { value: "hsl(210, 12%, 18%)" },
    },
  },

  // Interactive states
  interactive: {
    hover: {
      light: { value: "hsl(30, 90%, 42%)" },
      dark: { value: "hsl(30, 90%, 46%)" },
    },
    active: {
      light: { value: "hsl(30, 85%, 38%)" },
      dark: { value: "hsl(30, 85%, 48%)" },
    },
    disabled: {
      light: { value: "hsl(30, 20%, 80%)" },
      dark: { value: "hsl(30, 10%, 30%)" },
    },
  },
};

const themeConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Flatten the palette for token reference
        ...Object.entries(palette).reduce((acc: Record<string, any>, [category, values]) => {
          Object.entries(values).forEach(([name, modes]) => {
            acc[`${category}.${name}.light`] = modes.light;
            acc[`${category}.${name}.dark`] = modes.dark;
          });
          return acc;
        }, {}),
      },
    },
    semanticTokens: {
      colors: {
        // Background tokens
        "bg": {
          value: {
            base: "{colors.bg.primary.light}",
            _dark: "{colors.bg.primary.dark}",
          },
        },
        "bg.subtle": {
          value: {
            base: "{colors.bg.secondary.light}",
            _dark: "{colors.bg.secondary.dark}",
          },
        },
        "bg.muted": {
          value: {
            base: "{colors.bg.muted.light}",
            _dark: "{colors.bg.muted.dark}",
          },
        },
        "bg.accent": {
          value: {
            base: "{colors.bg.accent.light}",
            _dark: "{colors.bg.accent.dark}",
          },
        },
        "bg.selected": {
          value: {
            base: "{colors.bg.selected.light}",
            _dark: "{colors.bg.selected.dark}",
          },
        },
        "bg.overlay": {
          value: {
            base: "{colors.bg.overlay.light}",
            _dark: "{colors.bg.overlay.dark}",
          },
        },

        // Foreground/Text tokens
        "fg": {
          value: {
            base: "{colors.text.primary.light}",
            _dark: "{colors.text.primary.dark}",
          },
        },
        "fg.muted": {
          value: {
            base: "{colors.text.secondary.light}",
            _dark: "{colors.text.secondary.dark}",
          },
        },
        "fg.subtle": {
          value: {
            base: "{colors.text.subtle.light}",
            _dark: "{colors.text.subtle.dark}",
          },
        },
        "fg.inverted": {
          value: {
            base: "{colors.bg.primary.light}",
            _dark: "{colors.bg.primary.dark}",
          },
        },

        // Border tokens
        "border": {
          value: {
            base: "{colors.border.default.light}",
            _dark: "{colors.border.default.dark}",
          },
        },
        "border.subtle": {
          value: {
            base: "{colors.border.subtle.light}",
            _dark: "{colors.border.subtle.dark}",
          },
        },
        "border.accent": {
          value: {
            base: "{colors.orange.darkest.light}",
            _dark: "{colors.orange.darkest.dark}",
          },
        },

        // Orange accent tokens
        "orange": {
          value: {
            base: "{colors.orange.primary.light}",
            _dark: "{colors.orange.primary.dark}",
          },
        },
        "orange.darkest": {
          value: {
            base: "{colors.orange.darkest.light}",
            _dark: "{colors.orange.darkest.dark}",
          },
        },
        "orange.dark": {
          value: {
            base: "{colors.orange.dark.light}",
            _dark: "{colors.orange.dark.dark}",
          },
        },
        "orange.light": {
          value: {
            base: "{colors.orange.light.light}",
            _dark: "{colors.orange.light.dark}",
          },
        },
        "orange.lightest": {
          value: {
            base: "{colors.orange.lightest.light}",
            _dark: "{colors.orange.lightest.dark}",
          },
        },

        // Status tokens
        "status.error": {
          value: {
            base: "{colors.status.error.light}",
            _dark: "{colors.status.error.dark}",
          },
        },
        "status.success": {
          value: {
            base: "{colors.status.success.light}",
            _dark: "{colors.status.success.dark}",
          },
        },
        "status.warning": {
          value: {
            base: "{colors.status.warning.light}",
            _dark: "{colors.status.warning.dark}",
          },
        },

        // Interactive/Component tokens
        "interactive.primary": {
          value: {
            base: "{colors.orange.primary.light}",
            _dark: "{colors.orange.primary.dark}",
          },
        },
        "interactive.hover": {
          value: {
            base: "{colors.interactive.hover.light}",
            _dark: "{colors.interactive.hover.dark}",
          },
        },
        "interactive.active": {
          value: {
            base: "{colors.interactive.active.light}",
            _dark: "{colors.interactive.active.dark}",
          },
        },
        "interactive.disabled": {
          value: {
            base: "{colors.interactive.disabled.light}",
            _dark: "{colors.interactive.disabled.dark}",
          },
        },
      },
    },
  },
});

export const appTheme = createSystem(defaultConfig, themeConfig);
export default appTheme;
