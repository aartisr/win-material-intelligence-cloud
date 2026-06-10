/**
 * Example domain configuration: SaaS Analytics Platform
 * Shows how to customize the platform for an analytics/observability use case
 */

import { PlatformConfig } from '../types';

export const analyticsConfig: Partial<PlatformConfig> = {
  domain: 'analytics',
  appName: 'DataViz Pro',
  appDescription: 'Real-time analytics and observability platform',

  theme: {
    name: 'analytics-purple',
    colors: {
      primary: '#8b5cf6',
      primaryLight: '#a78bfa',
      primaryDark: '#6d28d9',
      accent: '#06b6d4',
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
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      headingFamily: '"IBM Plex Mono", monospace',
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
      sm: '0 1px 2px 0 rgba(139, 92, 246, 0.05)',
      md: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
      lg: '0 10px 15px -3px rgba(139, 92, 246, 0.1)',
      xl: '0 20px 25px -5px rgba(139, 92, 246, 0.1)',
    },
  },

  dataAdapter: {
    type: 'graphql',
    baseUrl: 'https://graphql.dataviz.io', // Override via AppProvider if needed
    headers: {
      'Authorization': 'Bearer YOUR_GRAPHQL_TOKEN', // Set via AppProvider
      'X-API-Version': 'v3',
    },
  },

  layout: {
    sidebarPosition: 'left',
    collapsibleSidebar: true,
    topbarSticky: true,
    footerVisible: false,
  },

  features: {
    dashboards: {
      name: 'Custom Dashboards',
      enabled: true,
      config: {
        maxDashboardsPerUser: 50,
        enableSharing: true,
        enableScheduledDelivery: true,
      },
    },
    reports: {
      name: 'Report Builder',
      enabled: true,
      config: {
        enableCustomMetrics: true,
        enableExport: true,
        exportFormats: ['pdf', 'csv', 'excel', 'json'],
      },
    },
    alerts: {
      name: 'Alert Management',
      enabled: true,
      config: {
        enableMultiChannel: true,
        channels: ['email', 'slack', 'pagerduty', 'webhook'],
        enableAnomalyDetection: true,
      },
    },
    sources: {
      name: 'Data Sources',
      enabled: true,
      config: {
        enableCustomAPI: true,
        supportedSources: [
          'google-analytics',
          'mixpanel',
          'amplitude',
          'datadog',
          'new-relic',
        ],
      },
    },
    users: {
      name: 'User Management',
      enabled: true,
      config: {
        enableTeams: true,
        enableRBAC: true,
        maxTeamMembers: 100,
      },
    },
    integrations: {
      name: 'Third-Party Integrations',
      enabled: true,
      config: {
        enableZapier: true,
        enableWebhooks: true,
        enableAPIAccess: true,
      },
    },
    realtime: {
      name: 'Real-time Updates',
      enabled: true,
      config: {
        refreshInterval: 5000,
        enableWebsocket: true,
      },
    },
  },

  analytics: {
    enabled: true,
    provider: 'mixpanel',
    trackingId: 'YOUR_TRACKING_ID', // Set via environment or AppProvider
  },

  auth: {
    provider: 'oauth',
    requiresAuth: true,
    redirectUrl: '/auth/login',
  },

  metadata: {
    version: '1.0.0',
    industryVertical: 'Analytics/Observability',
    targetMarket: 'Enterprise',
    complianceRequirements: ['SOC2', 'GDPR', 'CCPA'],
  },
};
