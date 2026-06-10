/**
 * Example domain configuration: E-Commerce Platform
 * Shows how to customize the platform for an e-commerce use case
 */

import { PlatformConfig } from '../types';

export const ecommerceConfig: Partial<PlatformConfig> = {
  domain: 'ecommerce',
  appName: 'ShopHub Pro',
  appDescription: 'Enterprise e-commerce management platform',

  theme: {
    name: 'ecommerce-pink',
    colors: {
      primary: '#ec4899',
      primaryLight: '#f472b6',
      primaryDark: '#be185d',
      accent: '#fbbf24',
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
      fontFamily: '"Poppins", system-ui, -apple-system, sans-serif',
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
      sm: '0 1px 2px 0 rgba(236, 72, 153, 0.05)',
      md: '0 4px 6px -1px rgba(236, 72, 153, 0.1)',
      lg: '0 10px 15px -3px rgba(236, 72, 153, 0.1)',
      xl: '0 20px 25px -5px rgba(236, 72, 153, 0.1)',
    },
  },

  dataAdapter: {
    type: 'rest',
    baseUrl: 'https://api.shophub.com', // Override via AppProvider if needed
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN', // Set via AppProvider
      'X-API-Version': 'v2',
    },
  },

  layout: {
    sidebarPosition: 'left',
    collapsibleSidebar: true,
    topbarSticky: true,
    footerVisible: true,
  },

  features: {
    products: {
      name: 'Product Management',
      enabled: true,
      config: {
        itemsPerPage: 50,
        enableBulkActions: true,
        enableAIRecommendations: true,
      },
    },
    orders: {
      name: 'Order Management',
      enabled: true,
      config: {
        enableFulfillment: true,
        enableTracking: true,
        enableRefunds: true,
      },
    },
    inventory: {
      name: 'Inventory',
      enabled: true,
      config: {
        enableLowStockAlerts: true,
        enableMultiWarehouse: true,
      },
    },
    customers: {
      name: 'Customer Management',
      enabled: true,
      config: {
        enableSegmentation: true,
        enableLoyalty: true,
      },
    },
    payments: {
      name: 'Payment Processing',
      enabled: true,
      config: {
        gateways: ['stripe', 'paypal', 'square'],
        enableSubscriptions: true,
      },
    },
    analytics: {
      name: 'Business Analytics',
      enabled: true,
      config: {
        enableRevenueDashboard: true,
        enableForecast: true,
      },
    },
    marketing: {
      name: 'Marketing Tools',
      enabled: true,
      config: {
        enableEmails: true,
        enableCampaigns: true,
        enableAutomations: true,
      },
    },
  },

  analytics: {
    enabled: true,
    provider: 'google',
    trackingId: 'YOUR_GA_TRACKING_ID', // Set via environment or AppProvider
  },

  auth: {
    provider: 'oauth',
    requiresAuth: true,
    redirectUrl: '/login',
  },

  metadata: {
    version: '1.0.0',
    industryVertical: 'E-Commerce',
    targetMarket: 'Mid-Market to Enterprise',
  },
};
