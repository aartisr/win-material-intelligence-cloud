# Making This Repository Completely Modular & Plug-and-Play

This repository has been transformed into a fully modular, plug-and-play, generic platform that can be customized for any domain without touching core code.

## What's New?

### ✅ Complete Modularity

- **Configuration-Driven** - Everything is controlled via config, not hardcoding
- **Swappable Data Sources** - Switch between REST, GraphQL, Mock adapters
- **Theme System** - Customize colors, fonts, and styling without CSS changes
- **Plugin Architecture** - Extend with plugins that hook into lifecycle events
- **Feature Flags** - Enable/disable features per deployment
- **Multi-Domain** - Run same app for different use cases (e-commerce, analytics, etc.)
- **White-Label Ready** - Customize for different customers/brands

### 📁 New Architecture

```
src/
├── config/                    # Configuration system
│   ├── types.ts              # Configuration types
│   ├── default.ts            # Default configuration
│   ├── index.ts              # Config context & hooks
│   └── domains/              # Domain-specific configs
│       ├── ecommerce.ts      # E-commerce example
│       └── analytics.ts      # Analytics example
├── theme/
│   └── index.ts              # Themeable styling system
├── plugins/
│   ├── registry.ts           # Plugin system & hooks
│   └── examples/
│       └── analytics-plugin.ts  # Example plugin
├── lib/
│   ├── adapters.ts           # Data adapter layer
│   ├── routes.ts             # Dynamic route configuration
│   └── api.ts                # (existing)
└── app/
    └── AppProvider.tsx       # Config provider component
```

## Quick Start

### Option 1: Use Default Material Intelligence Config

```typescript
// main.tsx
import { AppProvider } from './app/AppProvider';

<AppProvider>
  <App />
</AppProvider>
```

### Option 2: Customize for Your Domain

```typescript
import { AppProvider } from './app/AppProvider';
import { ecommerceConfig } from './config/domains/ecommerce';

<AppProvider configOverrides={ecommerceConfig}>
  <App />
</AppProvider>
```

### Option 3: Create Custom Config

```typescript
const customConfig = {
  appName: 'My App',
  domain: 'my-domain',
  dataAdapter: {
    type: 'rest',
    baseUrl: 'https://api.example.com',
  },
  theme: {
    colors: {
      primary: '#your-color',
      // ...
    },
  },
};

<AppProvider configOverrides={customConfig}>
  <App />
</AppProvider>
```

## Key Features

### 1. Configuration System

Define everything in configuration:

```typescript
// src/config/my-config.ts
export const myConfig = {
  appName: 'My Application',
  theme: { /* custom colors, fonts, spacing */ },
  dataAdapter: { type: 'rest', baseUrl: '...' },
  features: { /* enable/disable features */ },
  plugins: [ /* register plugins */ ],
};
```

**Use it:**

```typescript
useConfig()              // Get full config
useFeature('name')       // Check if feature is enabled
useTheme()              // Get theme
useNavigation()         // Get navigation
```

### 2. Data Adapters

Switch data sources without changing components:

```typescript
// In config
dataAdapter: {
  type: 'rest',         // or 'graphql', 'mock', 'custom'
  baseUrl: 'https://...',
}

// Components work with ANY adapter
const { data } = useQuery('scenarios');
```

**Supported Adapters:**
- ✅ **mock** - Development/testing
- ✅ **rest** - REST APIs
- ✅ **graphql** - GraphQL endpoints
- ✅ **custom** - Your own adapter

### 3. Theme System

Completely customize styling:

```typescript
theme: {
  colors: {
    primary, primaryLight, primaryDark,
    accent, surface, surfaceRaised,
    ink, inkSoft, muted, line, deep,
    success, warning, error, sky,
  },
  typography: { /* fonts, sizes */ },
  spacing: { /* xs, sm, md, lg, xl */ },
  borderRadius: { /* xs, sm, md, lg, full */ },
  shadows: { /* sm, md, lg, xl */ },
}
```

**Predefined themes:**
- `darkTheme` (current)
- `lightTheme`
- `highContrastTheme`

### 4. Plugin System

Extend functionality:

```typescript
const myPlugin = {
  id: 'my-feature',
  name: 'My Feature',
  version: '1.0.0',
  
  getHooks() {
    return {
      'app:ready': [() => console.log('App ready!')],
      'route:afterEnter': [trackPageView],
      'data:afterFetch': [logData],
    };
  },
};

pluginRegistry.register(myPlugin);
```

**Standard Hooks:**
- `app:init`, `app:ready`, `app:destroy`
- `route:beforeEnter`, `route:afterEnter`
- `data:beforeFetch`, `data:afterFetch`
- `auth:login`, `auth:logout`
- Custom hooks

### 5. Feature Flags

Enable/disable features per deployment:

```typescript
features: {
  simulation: { enabled: true },
  recommendations: { enabled: false },
  analytics: { enabled: true },
}

// In components
if (useFeature('simulation')) {
  // Show simulation carousel
}
```

## Examples

### E-Commerce Platform

```typescript
import { ecommerceConfig } from './config/domains/ecommerce';

<AppProvider configOverrides={ecommerceConfig}>
  <App />
</AppProvider>

// Features: products, orders, inventory, customers, payments, analytics, marketing
```

### SaaS Analytics Platform

```typescript
import { analyticsConfig } from './config/domains/analytics';

<AppProvider configOverrides={analyticsConfig}>
  <App />
</AppProvider>

// Features: dashboards, reports, alerts, data sources, real-time
```

### White-Label for Customer

```typescript
const customerConfig = {
  appName: 'Customer Name Dashboard',
  logo: 'https://customer.com/logo.png',
  theme: { colors: { primary: '#customer-brand-color' } },
  dataAdapter: { type: 'rest', baseUrl: 'https://customer-api.com' },
};

<AppProvider configOverrides={customerConfig}>
  <App />
</AppProvider>
```

## Documentation

See **[MODULAR_ARCHITECTURE.md](./MODULAR_ARCHITECTURE.md)** for:
- Complete configuration reference
- Creating custom domains
- Building plugins
- Multi-tenant deployments
- Environment-specific configs
- API reference
- Best practices

## Creating Your Own Domain

1. **Create domain config:**

```typescript
// src/config/domains/my-domain.ts
export const myDomainConfig = {
  domain: 'my-domain',
  appName: 'My Custom App',
  // ... customize everything
};
```

2. **Use in app:**

```typescript
import { myDomainConfig } from './config/domains/my-domain';

<AppProvider configOverrides={myDomainConfig}>
  <App />
</AppProvider>
```

3. **That's it!** Same codebase, different app.

## Extending with Plugins

1. **Create plugin:**

```typescript
// src/plugins/my-plugin.ts
export const myPlugin = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  
  getHooks() {
    return {
      'app:ready': [() => { /* your code */ }],
    };
  },
};
```

2. **Register in config:**

```typescript
plugins: [
  {
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    enabled: true,
  },
]
```

## Before / After

### Before (Hardcoded)
```typescript
// Coupled to Material Intelligence domain
const API_URL = 'https://material-intelligence-api.com';
const APP_NAME = 'Material Intelligence';
const colors = { primary: '#0ea5e9' };
const features = ['simulation', 'recommendations'];
// Changing any of this requires code changes and rebuilds
```

### After (Modular)
```typescript
// Completely configurable, no code changes needed
<AppProvider configOverrides={{
  appName: 'My App',
  dataAdapter: { type: 'rest', baseUrl: 'https://my-api.com' },
  theme: { colors: { primary: '#ff0000' } },
  features: { myFeature: { enabled: true } },
}}>
  <App />
</AppProvider>
```

## Key Benefits

✅ **No Core Code Changes** - Customize via config  
✅ **Same Codebase, Different Apps** - Use for multiple domains  
✅ **Easy White-Labeling** - Customize per customer  
✅ **Pluggable Extensions** - Add features without touching core  
✅ **Feature Flags** - Gradual rollout, A/B testing  
✅ **Data Source Agnostic** - REST, GraphQL, Mock, Custom  
✅ **Themeable** - Complete design system control  
✅ **Type Safe** - Full TypeScript support  
✅ **Multi-Tenant Ready** - Deploy for multiple customers  
✅ **Future Proof** - Easy to extend and modify  

## Migration Guide

Existing components work unchanged! The system is backward compatible.

The AppProvider wraps your existing app and provides configuration context:

```typescript
// Before
<App />

// After
<AppProvider>
  <App />
</AppProvider>

// With custom config
<AppProvider configOverrides={customConfig}>
  <App />
</AppProvider>
```

All hooks work the same:

```typescript
const config = useConfig();
const isEnabled = useFeature('name');
const theme = useTheme();
```

## Next Steps

1. **Review** [MODULAR_ARCHITECTURE.md](./MODULAR_ARCHITECTURE.md)
2. **Create** your domain config in `src/config/domains/`
3. **Customize** theme, adapters, and features
4. **Build** plugins for custom logic
5. **Deploy** same codebase for different use cases

## Questions?

All configuration options are defined in `src/config/types.ts`.

See example domains in `src/config/domains/` for reference implementations.

Check `MODULAR_ARCHITECTURE.md` for detailed guidance.

