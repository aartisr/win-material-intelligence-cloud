import { createContext, useContext } from 'react';
import { PlatformConfig } from './types';
import { defaultConfig } from './default';

/**
 * Configuration context for dependency injection throughout the app
 * Allows config to be accessed anywhere without prop drilling
 */
export const ConfigContext = createContext<PlatformConfig | null>(null);

export function useConfig(): PlatformConfig {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}

export function useFeature(featureName: string): boolean {
  const config = useConfig();
  return config.features[featureName]?.enabled ?? false;
}

export function useFeatureConfig(featureName: string): Record<string, any> {
  const config = useConfig();
  return config.features[featureName]?.config ?? {};
}

export function useTheme() {
  const config = useConfig();
  return config.theme;
}

export function useNavigation() {
  const config = useConfig();
  return config.navigation;
}

export function useDataAdapter() {
  const config = useConfig();
  return config.dataAdapter;
}

/**
 * Merge configurations with deep override capability
 * Useful for domain-specific or deployment-specific overrides
 */
export function mergeConfigs(
  base: PlatformConfig,
  overrides: Partial<PlatformConfig>,
): PlatformConfig {
  return {
    ...base,
    ...overrides,
    theme: {
      ...base.theme,
      ...(overrides.theme || {}),
      colors: {
        ...base.theme.colors,
        ...(overrides.theme?.colors || {}),
      },
      typography: {
        ...base.theme.typography,
        ...(overrides.theme?.typography || {}),
        fontSize: {
          ...base.theme.typography.fontSize,
          ...(overrides.theme?.typography?.fontSize || {}),
        },
      },
      spacing: {
        ...base.theme.spacing,
        ...(overrides.theme?.spacing || {}),
      },
      borderRadius: {
        ...base.theme.borderRadius,
        ...(overrides.theme?.borderRadius || {}),
      },
      shadows: {
        ...base.theme.shadows,
        ...(overrides.theme?.shadows || {}),
      },
    },
    features: {
      ...base.features,
      ...(overrides.features || {}),
    },
    layout: {
      ...base.layout,
      ...(overrides.layout || {}),
    },
  };
}

/**
 * Load configuration from multiple sources
 * Priority: environment > runtime overrides > defaults
 */
export async function loadConfig(): Promise<PlatformConfig> {
  let config = { ...defaultConfig };

  // Load from environment if available
  if (typeof window !== 'undefined' && (window as any).__PLATFORM_CONFIG__) {
    const envConfig = (window as any).__PLATFORM_CONFIG__;
    config = mergeConfigs(config, envConfig);
  }

  // Load from config URL if specified
  const configUrl = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '',
  ).get('configUrl');

  if (configUrl) {
    try {
      const response = await fetch(configUrl);
      const remoteConfig = await response.json();
      config = mergeConfigs(config, remoteConfig);
    } catch (error) {
      console.error('Failed to load remote config:', error);
    }
  }

  return config;
}
