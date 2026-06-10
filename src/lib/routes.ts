/**
 * Dynamic route configuration system
 * Enables routes to be defined in configuration instead of hardcoded
 */

import { PlatformConfig, Route } from '../config/types';

// Route component registry (can be lazy-loaded per deployment)
const routeComponents: Record<string, any> = {
  Home: null,
  Dashboard: null,
  Simulation: null,
  Accounts: null,
  Admin: null,
  Commercial: null,
  Enterprise: null,
  Exceptions: null,
  Ingestion: null,
  Ledger: null,
  Optimization: null,
  Recommendations: null,
  Reports: null,
  Roadmap: null,
  Security: null,
};

/**
 * Get component for a route
 */
export function getRouteComponent(componentName: string): any {
  return routeComponents[componentName];
}

/**
 * Register custom route component (for plugins)
 */
export function registerRouteComponent(name: string, component: any): void {
  routeComponents[name] = component;
}

/**
 * Build route configuration from platform config
 */
export function buildRoutes(config: PlatformConfig): Route[] {
  // Default routes if not in config
  const defaultRoutes: Route[] = [
    {
      path: '/home',
      component: 'Home',
      layout: 'default',
    },
    {
      path: '/dashboard',
      component: 'Dashboard',
      layout: 'default',
    },
    {
      path: '/simulation',
      component: 'Simulation',
      layout: 'default',
    },
    {
      path: '/accounts',
      component: 'Accounts',
      layout: 'default',
    },
    {
      path: '/admin',
      component: 'Admin',
      layout: 'default',
      requiredRole: 'admin',
    },
    {
      path: '/commercial',
      component: 'Commercial',
      layout: 'default',
    },
    {
      path: '/enterprise',
      component: 'Enterprise',
      layout: 'default',
    },
    {
      path: '/exceptions',
      component: 'Exceptions',
      layout: 'default',
    },
    {
      path: '/ingestion',
      component: 'Ingestion',
      layout: 'default',
    },
    {
      path: '/ledger',
      component: 'Ledger',
      layout: 'default',
    },
    {
      path: '/optimization',
      component: 'Optimization',
      layout: 'default',
    },
    {
      path: '/recommendations',
      component: 'Recommendations',
      layout: 'default',
    },
    {
      path: '/reports',
      component: 'Reports',
      layout: 'default',
    },
    {
      path: '/roadmap',
      component: 'Roadmap',
      layout: 'default',
    },
    {
      path: '/security',
      component: 'Security',
      layout: 'default',
    },
  ];

  // Use config routes if provided, otherwise use defaults
  return config.routes && config.routes.length > 0
    ? config.routes
    : defaultRoutes;
}

/**
 * Build navigation from configuration
 */
export function buildNavigation(config: PlatformConfig): any[] {
  // If navigation is already defined in config, use it
  if (config.navigation && config.navigation.length > 0) {
    return config.navigation;
  }

  // Otherwise, generate from routes
  return buildRoutes(config)
    .filter((route) => !route.metadata?.hidden)
    .map((route) => ({
      id: route.component?.toLowerCase(),
      label: route.component,
      shortLabel: route.component?.substring(0, 2).toUpperCase(),
      path: route.path,
      capability: `${route.component} module`,
      phase: 'All',
    }));
}

/**
 * Check if route is accessible based on configuration
 */
export function isRouteAccessible(
  route: Route,
  userRole?: string,
  features?: Record<string, boolean>,
): boolean {
  // Check role requirement
  if (route.requiredRole && route.requiredRole !== userRole) {
    return false;
  }

  // Check if component is in disabled features
  const componentFeatureName = `feature_${route.component?.toLowerCase()}`;
  if (features && !features[componentFeatureName]) {
    return false;
  }

  return true;
}

/**
 * Find route by path
 */
export function findRoute(path: string, config: PlatformConfig): Route | undefined {
  const routes = buildRoutes(config);
  return routes.find((r) => r.path === path);
}

/**
 * Generate breadcrumbs from route path
 */
export function generateBreadcrumbs(
  path: string,
  config: PlatformConfig,
): Array<{ label: string; path: string }> {
  const route = findRoute(path, config);
  if (!route) return [];

  return [
    {
      label: config.appName,
      path: '/home',
    },
    {
      label: route.component || route.path,
      path: route.path,
    },
  ];
}
