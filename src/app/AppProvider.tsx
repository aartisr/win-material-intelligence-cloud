/**
 * App Provider component
 * Initializes configuration, plugins, data adapters, and theming
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { ConfigContext, loadConfig, mergeConfigs } from '../config';
import { defaultConfig } from '../config/default';
import { PlatformConfig } from '../config/types';
import { pluginRegistry, PLUGIN_HOOKS } from '../plugins/registry';
import { initAdapter } from '../lib/adapters';
import { applyTheme } from '../theme';

interface AppProviderProps {
  children: ReactNode;
  configOverrides?: Partial<PlatformConfig>;
}

export function AppProvider({ children, configOverrides }: AppProviderProps) {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load configuration
        let loadedConfig = await loadConfig();

        // Apply overrides
        if (configOverrides) {
          loadedConfig = mergeConfigs(loadedConfig, configOverrides);
        }

        // Initialize data adapter
        await initAdapter(loadedConfig.dataAdapter);

        // Register and initialize plugins
        for (const pluginConfig of loadedConfig.plugins) {
          if (pluginConfig.enabled) {
            // Plugins are already registered elsewhere
          }
        }

        // Execute initialization hook
        await pluginRegistry.executeHook(PLUGIN_HOOKS.APP_INIT, loadedConfig);

        // Apply theme
        applyTheme(loadedConfig.theme);

        // Set configuration context
        setConfig(loadedConfig);

        // Execute app ready hook
        await pluginRegistry.executeHook(PLUGIN_HOOKS.APP_READY, loadedConfig);

        setInitialized(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Failed to initialize app:', error);
        setError(error);

        // Fallback to default config on error
        setConfig(defaultConfig);
        setInitialized(true);
      }
    };

    initializeApp();
  }, [configOverrides]);

  if (!initialized || !config) {
    return <div>Initializing...</div>;
  }

  if (error) {
    console.warn('App initialized with error (using fallback config):', error);
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Hook to access app initialization state
 */
export function useAppInitialization() {
  return {
    isInitialized: true, // Always true inside provider
  };
}
