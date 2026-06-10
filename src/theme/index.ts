/**
 * Theme system for dynamic branding and styling
 * Converts config theme to CSS variables
 */

import { Theme } from '../config/types';

/**
 * Apply theme configuration as CSS variables
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-light', theme.colors.primaryLight);
  root.style.setProperty('--primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--surface', theme.colors.surface);
  root.style.setProperty('--surface-raised', theme.colors.surfaceRaised);
  root.style.setProperty('--ink', theme.colors.ink);
  root.style.setProperty('--ink-soft', theme.colors.inkSoft);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--line', theme.colors.line);
  root.style.setProperty('--deep', theme.colors.deep);
  root.style.setProperty('--success', theme.colors.success);
  root.style.setProperty('--warning', theme.colors.warning);
  root.style.setProperty('--error', theme.colors.error);
  root.style.setProperty('--sky', theme.colors.sky);

  // Typography
  root.style.setProperty('--font-family', theme.typography.fontFamily);
  root.style.setProperty('--heading-family', theme.typography.headingFamily);
  root.style.setProperty('--font-size-xs', theme.typography.fontSize.xs);
  root.style.setProperty('--font-size-sm', theme.typography.fontSize.sm);
  root.style.setProperty('--font-size-base', theme.typography.fontSize.base);
  root.style.setProperty('--font-size-lg', theme.typography.fontSize.lg);
  root.style.setProperty('--font-size-xl', theme.typography.fontSize.xl);
  root.style.setProperty('--font-size-xxl', theme.typography.fontSize.xxl);

  // Spacing
  root.style.setProperty('--space-xs', theme.spacing.xs);
  root.style.setProperty('--space-sm', theme.spacing.sm);
  root.style.setProperty('--space-md', theme.spacing.md);
  root.style.setProperty('--space-lg', theme.spacing.lg);
  root.style.setProperty('--space-xl', theme.spacing.xl);

  // Border radius
  root.style.setProperty('--radius-xs', theme.borderRadius.xs);
  root.style.setProperty('--radius-sm', theme.borderRadius.sm);
  root.style.setProperty('--radius-md', theme.borderRadius.md);
  root.style.setProperty('--radius-lg', theme.borderRadius.lg);
  root.style.setProperty('--radius-full', theme.borderRadius.full);

  // Shadows
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);
  root.style.setProperty('--shadow-xl', theme.shadows.xl);
}

/**
 * Export theme as CSS
 */
export function generateThemeCss(theme: Theme): string {
  const css = `
:root {
  /* Colors */
  --primary: ${theme.colors.primary};
  --primary-light: ${theme.colors.primaryLight};
  --primary-dark: ${theme.colors.primaryDark};
  --accent: ${theme.colors.accent};
  --surface: ${theme.colors.surface};
  --surface-raised: ${theme.colors.surfaceRaised};
  --ink: ${theme.colors.ink};
  --ink-soft: ${theme.colors.inkSoft};
  --muted: ${theme.colors.muted};
  --line: ${theme.colors.line};
  --deep: ${theme.colors.deep};
  --success: ${theme.colors.success};
  --warning: ${theme.colors.warning};
  --error: ${theme.colors.error};
  --sky: ${theme.colors.sky};

  /* Typography */
  --font-family: ${theme.typography.fontFamily};
  --heading-family: ${theme.typography.headingFamily};
  --font-size-xs: ${theme.typography.fontSize.xs};
  --font-size-sm: ${theme.typography.fontSize.sm};
  --font-size-base: ${theme.typography.fontSize.base};
  --font-size-lg: ${theme.typography.fontSize.lg};
  --font-size-xl: ${theme.typography.fontSize.xl};
  --font-size-xxl: ${theme.typography.fontSize.xxl};

  /* Spacing */
  --space-xs: ${theme.spacing.xs};
  --space-sm: ${theme.spacing.sm};
  --space-md: ${theme.spacing.md};
  --space-lg: ${theme.spacing.lg};
  --space-xl: ${theme.spacing.xl};

  /* Border Radius */
  --radius-xs: ${theme.borderRadius.xs};
  --radius-sm: ${theme.borderRadius.sm};
  --radius-md: ${theme.borderRadius.md};
  --radius-lg: ${theme.borderRadius.lg};
  --radius-full: ${theme.borderRadius.full};

  /* Shadows */
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};
  --shadow-xl: ${theme.shadows.xl};
}
  `.trim();

  return css;
}

/**
 * Create alternative theme variants
 */
export function createThemeVariant(
  base: Theme,
  overrides: Partial<Theme>,
): Theme {
  return {
    ...base,
    name: overrides.name || base.name,
    colors: {
      ...base.colors,
      ...(overrides.colors || {}),
    },
    typography: {
      ...base.typography,
      ...(overrides.typography || {}),
      fontSize: {
        ...base.typography.fontSize,
        ...(overrides.typography?.fontSize || {}),
      },
    },
    spacing: {
      ...base.spacing,
      ...(overrides.spacing || {}),
    },
    borderRadius: {
      ...base.borderRadius,
      ...(overrides.borderRadius || {}),
    },
    shadows: {
      ...base.shadows,
      ...(overrides.shadows || {}),
    },
  };
}

/**
 * Predefined theme variants
 */

export const lightTheme: Partial<Theme> = {
  name: 'light',
  colors: {
    primary: '#0ea5e9',
    primaryLight: '#06b6d4',
    primaryDark: '#0369a1',
    accent: '#f59e0b',
    surface: '#ffffff',
    surfaceRaised: '#f8fafc',
    ink: '#0f172a',
    inkSoft: '#334155',
    muted: '#64748b',
    line: '#e2e8f0',
    deep: '#f1f5f9',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    sky: '#06b6d4',
  },
};

export const darkTheme: Partial<Theme> = {
  name: 'dark',
  colors: {
    primary: '#0ea5e9',
    primaryLight: '#06b6d4',
    primaryDark: '#0369a1',
    accent: '#f59e0b',
    surface: '#0f172a',
    surfaceRaised: '#1e293b',
    ink: '#f1f5f9',
    inkSoft: '#cbd5e1',
    muted: '#94a3b8',
    line: '#334155',
    deep: '#020617',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    sky: '#06b6d4',
  },
};

export const highContrastTheme: Partial<Theme> = {
  name: 'high-contrast',
  colors: {
    primary: '#000000',
    primaryLight: '#333333',
    primaryDark: '#000000',
    accent: '#ffff00',
    surface: '#ffffff',
    surfaceRaised: '#f0f0f0',
    ink: '#000000',
    inkSoft: '#333333',
    muted: '#666666',
    line: '#000000',
    deep: '#ffffff',
    success: '#00cc00',
    warning: '#ffff00',
    error: '#ff0000',
    sky: '#0099ff',
  },
};
