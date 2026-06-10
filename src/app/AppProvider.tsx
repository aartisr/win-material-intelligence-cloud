/**
 * App Provider component
 * Initializes configuration, plugins, data adapters, and theming with resilience
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { ConfigContext, loadConfig, mergeConfigs } from '../config';
import { defaultConfig } from '../config/default';
import { validateConfigOrThrow } from '../config/validator';
import { PlatformConfig } from '../config/types';
import { pluginRegistry, PLUGIN_HOOKS } from '../plugins/registry';
import { initAdapter } from '../lib/adapters';
import { applyTheme } from '../theme';
import { getLogger } from '../lib/logger';
import { checkHealth, isHealthy } from '../lib/health';

const logger = getLogger('AppProvider');

interface AppProviderProps {
  children: ReactNode;
  configOverrides?: Partial<PlatformConfig>;
}

export function AppProvider({ children, configOverrides }: AppProviderProps) {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'unknown'>('unknown');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.info('Initializing application');

        // Load configuration
        let loadedConfig = await loadConfig();
        logger.debug('Configuration loaded from sources');

        // Apply overrides
        if (configOverrides) {
          loadedConfig = mergeConfigs(loadedConfig, configOverrides);
          logger.debug('Configuration overrides applied');
        }

        // Validate configuration BEFORE using it
        logger.info('Validating configuration');
        validateConfigOrThrow(loadedConfig);
        logger.info('Configuration validated successfully');

        // Initialize data adapter
        logger.info('Initializing data adapter', { type: loadedConfig.dataAdapter.type });
        const adapter = await initAdapter(loadedConfig.dataAdapter);
        logger.info('Data adapter initialized', { adapterId: adapter.id });

        // Register and initialize plugins
        logger.info('Initializing plugins', { count: loadedConfig.plugins.length });
        for (const pluginConfig of loadedConfig.plugins) {
          if (pluginConfig.enabled) {
            logger.debug('Plugin enabled', { pluginId: pluginConfig.id });
          }
        }

        // Execute initialization hook
        logger.info('Executing app initialization hooks');
        await pluginRegistry.executeHook(PLUGIN_HOOKS.APP_INIT, loadedConfig);

        // Apply theme
        logger.info('Applying theme', { themeName: loadedConfig.theme.name });
        applyTheme(loadedConfig.theme);

        // Check health
        logger.info('Running health checks');
        const health = await checkHealth(loadedConfig, adapter);
        logger.info('Health check complete', {
          status: health.overallStatus,
          checks: health.summary,
        });

        setHealthStatus(
          health.overallStatus === 'healthy'
            ? 'healthy'
            : health.overallStatus === 'degraded'
              ? 'degraded'
              : 'unknown',
        );

        if (!isHealthy(health)) {
          logger.warn('Application health is not optimal', {
            status: health.overallStatus,
          });
        }

        // Set configuration context
        setConfig(loadedConfig);

        // Execute app ready hook
        logger.info('Executing app ready hooks');
        await pluginRegistry.executeHook(PLUGIN_HOOKS.APP_READY, loadedConfig);

        logger.info('Application initialization complete', {
          domain: loadedConfig.domain,
          appName: loadedConfig.appName,
          health: healthStatus,
        });

        setInitialized(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.fatal('Application initialization failed', error, {
          errorMessage: error.message,
        });

        setError(error);

        // Fallback to default config on critical error
        logger.warn('Falling back to default configuration');
        setConfig(defaultConfig);
        setHealthStatus('degraded');
        setInitialized(true);
      }
    };

    initializeApp();
  }, [configOverrides]);

  if (!initialized || !config) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#cbd5e1',
          background: '#0f172a',
        }}
      >
        <div>Initializing...</div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={config}>
      {error && healthStatus === 'degraded' && (
        <div
          style={{
            padding: '12px',
            marginBottom: '12px',
            background: '#b45309',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '4px',
          }}
          role="alert"
        >
          ⚠️ Application running with reduced capacity. Some features may be unavailable.
          Check console for details.
        </div>
      )}
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Hook to access app initialization state and health
 */
export function useAppInitialization() {
  return {
    isInitialized: true,
  };
}
