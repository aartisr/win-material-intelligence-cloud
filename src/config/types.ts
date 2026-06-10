/**
 * Core configuration types for the modular platform
 * Supports: multi-domain, white-label, pluggable features, swappable adapters, custom themes
 */

export interface Theme {
  name: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    surface: string;
    surfaceRaised: string;
    ink: string;
    inkSoft: string;
    muted: string;
    line: string;
    deep: string;
    success: string;
    warning: string;
    error: string;
    sky: string;
  };
  typography: {
    fontFamily: string;
    headingFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface DataAdapterConfig {
  type: 'rest' | 'graphql' | 'mock' | 'custom';
  baseUrl?: string;
  endpoints?: Record<string, string>;
  mockDelay?: number;
  headers?: Record<string, string>;
  customAdapterPath?: string;
}

export interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  capability: string;
  phase: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
  visible?: boolean | (() => boolean);
  requiredRole?: string;
}

export interface Route {
  path: string;
  component: string;
  layout?: 'default' | 'blank' | string;
  requiresAuth?: boolean;
  requiredRole?: string;
  metadata?: Record<string, any>;
}

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface PluginConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  hooks?: Record<string, string[]>;
  config?: Record<string, any>;
}

export interface PlatformConfig {
  // Domain/Branding
  domain: string;
  appName: string;
  appDescription: string;
  logo?: string;
  logoMark?: string;
  favicon?: string;

  // UI
  theme: Theme;
  layout: {
    sidebarPosition: 'left' | 'right';
    collapsibleSidebar: boolean;
    topbarSticky: boolean;
    footerVisible: boolean;
  };

  // Navigation
  navigation: NavItem[];
  routes: Route[];

  // Data
  dataAdapter: DataAdapterConfig;
  cacheDuration?: number;

  // Features
  features: {
    [key: string]: FeatureFlag;
  };

  // Plugins
  plugins: PluginConfig[];

  // Internationalization
  i18n?: {
    defaultLanguage: string;
    supportedLanguages: string[];
  };

  // Authentication
  auth?: {
    provider: 'none' | 'oauth' | 'custom';
    requiresAuth: boolean;
    redirectUrl?: string;
  };

  // Analytics
  analytics?: {
    enabled: boolean;
    provider: string;
    trackingId?: string;
  };

  // Custom metadata
  metadata?: Record<string, any>;
}
