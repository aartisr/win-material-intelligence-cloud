# Modular Platform Architecture Guide

## Overview

This platform is built as a completely modular, plug-and-play, and generic system. You can customize it for different domains, white-label it, swap data sources, customize themes, and extend it with plugins.

## Core Concepts

### 1. Configuration-Driven Architecture

All application behavior is controlled through configuration, not hardcoding. The system loads configuration in this priority order:

1. **Default Config** (`src/config/default.ts`) - Built-in defaults
2. **Environment Config** (`window.__PLATFORM_CONFIG__`) - Set via HTML/deployment
3. **Remote Config** (`?configUrl=` URL parameter) - Loaded from URL

```typescript
// Example: Override config at runtime
const customConfig = {
  domain: 'my-app',
  appName: 'My Custom App',
  theme: {
    colors: {
      primary: '#ff0000',
    },
  },
};

<AppProvider configOverrides={customConfig}>
  <App />
</AppProvider>
```

### 2. Data Adapters (Swappable Data Sources)

Switch between REST, GraphQL, Mock, or custom data sources without changing component code.

```typescript
// In config
dataAdapter: {
  type: 'rest', // or 'graphql', 'mock', 'custom'
  baseUrl: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer token',
  },
}

// In components - same code works with any adapter
const { data } = useQuery('scenarios', queryKeys.simulationScenarios);
```

**Supported Adapters:**
- **mock** - Development/testing with configurable delay
- **rest** - Standard REST API with caching
- **graphql** - GraphQL endpoint with query support
- **custom** - Load your own adapter from a file

### 3. Theme System

Completely customize colors, fonts, spacing, and styling:

```typescript
// Override theme colors
theme: {
  colors: {
    primary: '#0ea5e9',
    accent: '#f59e0b',
    surface: '#0f172a',
    // ... all 15 color properties
  },
  typography: {
    fontFamily: '"Your Font", sans-serif',
    fontSize: { /* 6 sizes */ },
  },
  spacing: { /* xs, sm, md, lg, xl */ },
  borderRadius: { /* xs, sm, md, lg, full */ },
  shadows: { /* sm, md, lg, xl */ },
}
```

**Predefined Themes:**
- `darkTheme` - Dark mode (current default)
- `lightTheme` - Light mode
- `highContrastTheme` - Accessibility variant

### 4. Plugin System

Extend functionality with plugins. Plugins can:
- Hook into lifecycle events
- Add custom components
- Add new routes
- Add navigation items

```typescript
// Create a plugin
const myPlugin: Plugin = {
  id: 'my-feature',
  name: 'My Feature',
  version: '1.0.0',
  
  async init(config) {
    console.log('Plugin initialized');
  },
  
  getHooks() {
    return {
      [PLUGIN_HOOKS.APP_READY]: [() => console.log('App ready!')],
      [PLUGIN_HOOKS.ROUTE_AFTER_ENTER]: [logRouteChange],
    };
  },
  
  getRoutes() {
    return [{ path: '/my-route', component: MyComponent }];
  },
};

// Register plugin
pluginRegistry.register(myPlugin);
```

**Standard Hooks:**
- `app:init` - On app initialization
- `app:ready` - When app is fully ready
- `app:destroy` - On app shutdown
- `route:beforeEnter` - Before navigating to route
- `route:afterEnter` - After navigating to route
- `data:beforeFetch` - Before fetching data
- `data:afterFetch` - After fetching data
- `auth:login` - On login
- `auth:logout` - On logout

### 5. Feature Flags

Enable/disable features without code changes:

```typescript
// In config
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
    enabled: false, // Disabled
  },
}

// In components
const { useFeature, useFeatureConfig } = useConfig();
if (useFeature('simulation')) {
  const config = useFeatureConfig('simulation');
  // Show simulation carousel
}
```

## Getting Started with Different Domains

### Example 1: E-Commerce Platform

```typescript
export const ecommerceConfig: Partial<PlatformConfig> = {
  domain: 'ecommerce',
  appName: 'My Store',
  
  dataAdapter: {
    type: 'rest',
    baseUrl: 'https://api.store.com',
  },
  
  theme: {
    colors: {
      primary: '#ec4899',
      accent: '#fbbf24',
      // ...
    },
  },
  
  features: {
    products: { enabled: true },
    cart: { enabled: true },
    checkout: { enabled: true },
    recommendations: { enabled: true },
  },
};

<AppProvider configOverrides={ecommerceConfig}>
  <App />
</AppProvider>
```

### Example 2: SaaS Analytics Platform

```typescript
export const analyticsConfig: Partial<PlatformConfig> = {
  domain: 'analytics',
  appName: 'DataHub Analytics',
  
  dataAdapter: {
    type: 'graphql',
    baseUrl: 'https://graphql.datahub.io',
    headers: {
      'Authorization': `Bearer ${process.env.GRAPHQL_TOKEN}`,
    },
  },
  
  theme: {
    colors: {
      primary: '#8b5cf6',
      accent: '#06b6d4',
      // ...
    },
  },
  
  features: {
    reports: { enabled: true },
    dashboards: { enabled: true },
    alerts: { enabled: true },
    export: { enabled: true },
  },
};
```

### Example 3: White-Label for Customer

```typescript
export const customerAConfig: Partial<PlatformConfig> = {
  domain: 'customer-a',
  appName: 'Customer A Dashboard',
  logo: 'https://customer-a.com/logo.png',
  
  theme: {
    colors: {
      primary: '#0077b6',
      accent: '#ff006e',
      // Customer's brand colors
    },
  },
  
  dataAdapter: {
    type: 'rest',
    baseUrl: 'https://customer-a-api.company.com',
  },
  
  // Only enable features Customer A paid for
  features: {
    basicDashboard: { enabled: true },
    advancedAnalytics: { enabled: false },
    customReports: { enabled: true },
  },
};
```

## Configuration File Structure

```
src/
├── config/
│   ├── types.ts           # Type definitions
│   ├── default.ts         # Default config
│   └── index.ts           # Config context & hooks
├── theme/
│   └── index.ts           # Theme system
├── plugins/
│   └── registry.ts        # Plugin system
├── lib/
│   ├── adapters.ts        # Data adapters
│   └── routes.ts          # Route configuration
└── app/
    └── AppProvider.tsx    # Main provider
```

## Creating a Custom Domain Config

```typescript
// src/config/domains/my-domain.ts
import { PlatformConfig } from '../types';

export const myDomainConfig: PlatformConfig = {
  domain: 'my-domain',
  appName: 'My Application',
  appDescription: 'My custom application',
  
  theme: { /* custom theme */ },
  
  dataAdapter: {
    type: 'rest',
    baseUrl: process.env.API_URL,
  },
  
  navigation: [],
  routes: [],
  features: { /* features */ },
  plugins: [],
};

// Then use it
<AppProvider configOverrides={myDomainConfig}>
  <App />
</AppProvider>
```

## Using Custom Data Adapters

```typescript
// src/adapters/custom-adapter.ts
import { DataAdapter } from '../lib/adapters';

class MyCustomAdapter implements DataAdapter {
  id = 'custom';
  
  async init() {
    // Initialize your adapter
  }
  
  async query<T>(key: string, params?: Record<string, any>): Promise<T> {
    // Implement your data fetching logic
  }
  
  async mutate<T>(endpoint: string, data: any): Promise<T> {
    // Implement your mutation logic
  }
  
  subscribe<T>(key: string, callback: (data: T) => void) {
    // Implement subscriptions
    return () => {}; // Unsubscribe function
  }
}

// Register in config
dataAdapter: {
  type: 'custom',
  customAdapterPath: './adapters/custom-adapter.ts',
}
```

## Creating Plugins

```typescript
// src/plugins/analytics-plugin.ts
import { Plugin, PLUGIN_HOOKS } from '../plugins/registry';

export const analyticsPlugin: Plugin = {
  id: 'analytics',
  name: 'Analytics Tracking',
  version: '1.0.0',
  
  async init(config) {
    // Initialize analytics service
    console.log(`Analytics initialized for ${config.appName}`);
  },
  
  getHooks() {
    return {
      [PLUGIN_HOOKS.ROUTE_AFTER_ENTER]: [
        (route) => {
          // Track page view
          trackPageView(route.path);
        },
      ],
      [PLUGIN_HOOKS.DATA_AFTER_FETCH]: [
        (data) => {
          // Track data load
          trackEvent('data_loaded', { size: data.length });
        },
      ],
    };
  },
};

// Register in config
plugins: [
  {
    id: 'analytics',
    name: 'Analytics Tracking',
    version: '1.0.0',
    enabled: true,
  },
]
```

## Multi-Tenant Deployment

```typescript
// Determine tenant from URL
const tenant = new URLSearchParams(window.location.search).get('tenant');
const tenantConfigs: Record<string, Partial<PlatformConfig>> = {
  'acme': { appName: 'ACME Dashboard', /* ... */ },
  'globex': { appName: 'Globex Dashboard', /* ... */ },
};

<AppProvider configOverrides={tenantConfigs[tenant]}>
  <App />
</AppProvider>
```

## Environment-Specific Configuration

```typescript
// src/config/environments/production.ts
import { defaultConfig } from '../default';
import { mergeConfigs } from '../index';

export const productionConfig = mergeConfigs(defaultConfig, {
  dataAdapter: {
    type: 'rest',
    baseUrl: 'https://api.production.com',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    },
  },
  
  analytics: {
    enabled: true,
    provider: 'google',
    trackingId: 'GA-XXXXX',
  },
});
```

## API Reference

### useConfig()
Get the current configuration anywhere in the app:
```typescript
const config = useConfig();
```

### useFeature(name: string)
Check if a feature is enabled:
```typescript
const isSimulationEnabled = useFeature('simulation');
```

### useTheme()
Get the current theme:
```typescript
const theme = useTheme();
```

### useNavigation()
Get navigation items:
```typescript
const nav = useNavigation();
```

### useDataAdapter()
Get data adapter config:
```typescript
const adapterConfig = useDataAdapter();
```

### pluginRegistry.register(plugin)
Register a plugin:
```typescript
pluginRegistry.register(myPlugin);
```

### pluginRegistry.executeHook(hookName, ...args)
Execute all handlers for a hook:
```typescript
await pluginRegistry.executeHook('app:init', config);
```

## Best Practices

1. **Configuration over Code** - Put everything in config that might change
2. **Plugin for Cross-Cutting Concerns** - Use plugins for analytics, auth, logging
3. **Feature Flags for Gradual Rollout** - Enable features per environment/tenant
4. **Type Safety** - Extend types in `src/config/types.ts` for custom config
5. **Environment Variables** - Use env vars for sensitive config (API tokens, URLs)
6. **Version Config** - Track config version for compatibility
7. **Validate Config** - Validate config on load to catch errors early

## Examples

See `src/config/domains/` for more domain examples:
- `material-intelligence.ts` - Supply chain platform
- `ecommerce.ts` - E-commerce store
- `analytics.ts` - Analytics dashboard
- `saas.ts` - SaaS template

