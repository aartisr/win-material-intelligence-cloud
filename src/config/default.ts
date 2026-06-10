import { PlatformConfig } from './types';

/**
 * Default configuration for Material Intelligence domain
 * This is an example of a concrete domain implementation
 * You can create alternative configs for different domains/use cases
 */
export const defaultConfig: PlatformConfig = {
  // Domain/Branding
  domain: 'material-intelligence',
  appName: 'Material Intelligence',
  appDescription: 'Executive control center for supply chain resilience',
  logo: undefined, // Set in build/deployment
  logoMark: undefined,
  favicon: undefined,

  // UI Layout
  theme: {
    name: 'material-dark',
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
    typography: {
      fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      headingFamily: '"Sora", system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        xxl: '2rem',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      xs: '0.25rem',
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
  },

  layout: {
    sidebarPosition: 'left',
    collapsibleSidebar: true,
    topbarSticky: true,
    footerVisible: true,
  },

  // Navigation - Empty by default, configured via routes
  navigation: [],

  // Routes - Will be populated dynamically
  routes: [],

  // Data Adapter
  dataAdapter: {
    type: 'mock',
    mockDelay: 300,
  },

  // Features
  features: {
    simulation: {
      name: 'Scenario Simulation',
      enabled: true,
      config: {
        carouselAutoplayInterval: 4200,
        scenarioCount: 10,
      },
    },
    recommendations: {
      name: 'Recommendations Engine',
      enabled: true,
    },
    analytics: {
      name: 'Advanced Analytics',
      enabled: true,
    },
    exceptions: {
      name: 'Exception Management',
      enabled: true,
    },
    reports: {
      name: 'Report Generation',
      enabled: true,
    },
  },

  // Plugins
  plugins: [],

  // Internationalization
  i18n: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr', 'de'],
  },

  // Authentication
  auth: {
    provider: 'none',
    requiresAuth: false,
  },

  // Analytics
  analytics: {
    enabled: false,
    provider: 'google',
  },

  metadata: {
    version: '1.0.0',
    releaseDate: new Date().toISOString(),
  },
};
