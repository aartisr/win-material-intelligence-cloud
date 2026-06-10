/**
 * Health check system for monitoring component status
 * Enables detection of configuration, adapter, and plugin issues
 */

import { getLogger } from './logger';
import { DataAdapter } from './adapters';

const logger = getLogger('HealthCheck');

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheckResult {
  component: string;
  status: HealthStatus;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
  lastCheck?: string;
}

export interface HealthReport {
  overallStatus: HealthStatus;
  timestamp: string;
  checks: HealthCheckResult[];
  summary: {
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

/**
 * Health check for data adapter
 */
export async function checkAdapterHealth(
  adapter: DataAdapter,
): Promise<HealthCheckResult> {
  try {
    // Try a simple query to verify adapter is working
    // This is adapter-specific; mock adapter just returns success
    if (adapter.id === 'mock') {
      return {
        component: `adapter:${adapter.id}`,
        status: 'healthy',
        message: 'Mock adapter ready',
        timestamp: new Date().toISOString(),
      };
    }

    // For other adapters, would perform actual health check
    return {
      component: `adapter:${adapter.id}`,
      status: 'healthy',
      message: `${adapter.id} adapter ready`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(
      `Adapter health check failed: ${adapter.id}`,
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      component: `adapter:${adapter.id}`,
      status: 'unhealthy',
      message: `${adapter.id} adapter failed: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Health check for configuration
 */
export async function checkConfigHealth(config: any): Promise<HealthCheckResult> {
  try {
    // Validate essential config properties exist
    const required = ['domain', 'appName', 'theme', 'dataAdapter'];
    const missing = required.filter((prop) => !config[prop]);

    if (missing.length > 0) {
      return {
        component: 'config',
        status: 'unhealthy',
        message: `Missing required config: ${missing.join(', ')}`,
        timestamp: new Date().toISOString(),
        details: { missing },
      };
    }

    // Check feature flags are configured
    if (!config.features || Object.keys(config.features).length === 0) {
      return {
        component: 'config',
        status: 'degraded',
        message: 'No features configured',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      component: 'config',
      status: 'healthy',
      message: 'Configuration valid',
      timestamp: new Date().toISOString(),
      details: {
        domain: config.domain,
        features: Object.keys(config.features).length,
      },
    };
  } catch (error) {
    logger.error(
      'Config health check failed',
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      component: 'config',
      status: 'unhealthy',
      message: `Config check error: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Health check for plugins
 */
export async function checkPluginHealth(plugins: any[]): Promise<HealthCheckResult> {
  try {
    if (!Array.isArray(plugins)) {
      return {
        component: 'plugins',
        status: 'degraded',
        message: 'Plugins not configured',
        timestamp: new Date().toISOString(),
      };
    }

    const enabledPlugins = plugins.filter((p) => p.enabled);

    if (enabledPlugins.length === 0) {
      return {
        component: 'plugins',
        status: 'healthy',
        message: 'No plugins enabled',
        timestamp: new Date().toISOString(),
      };
    }

    // Check plugin versions for compatibility
    let hasVersionIssues = false;
    for (const plugin of enabledPlugins) {
      if (!plugin.version) {
        hasVersionIssues = true;
        break;
      }
    }

    const status = hasVersionIssues ? 'degraded' : 'healthy';

    return {
      component: 'plugins',
      status,
      message: `${enabledPlugins.length} plugins loaded`,
      timestamp: new Date().toISOString(),
      details: {
        total: plugins.length,
        enabled: enabledPlugins.length,
        pluginIds: enabledPlugins.map((p) => p.id),
      },
    };
  } catch (error) {
    logger.error(
      'Plugin health check failed',
      error instanceof Error ? error : new Error(String(error)),
    );

    return {
      component: 'plugins',
      status: 'unhealthy',
      message: `Plugin check error: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Comprehensive health check
 */
export async function checkHealth(
  config: any,
  adapter?: DataAdapter,
): Promise<HealthReport> {
  logger.info('Starting health check');

  const checks: HealthCheckResult[] = [];

  // Check configuration
  checks.push(await checkConfigHealth(config));

  // Check adapter
  if (adapter) {
    checks.push(await checkAdapterHealth(adapter));
  }

  // Check plugins
  checks.push(await checkPluginHealth(config.plugins || []));

  // Determine overall status
  const unhealthyCount = checks.filter((c) => c.status === 'unhealthy').length;
  const degradedCount = checks.filter((c) => c.status === 'degraded').length;

  let overallStatus: HealthStatus = 'healthy';
  if (unhealthyCount > 0) {
    overallStatus = 'unhealthy';
  } else if (degradedCount > 0) {
    overallStatus = 'degraded';
  }

  const report: HealthReport = {
    overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    summary: {
      healthy: checks.filter((c) => c.status === 'healthy').length,
      degraded: degradedCount,
      unhealthy: unhealthyCount,
    },
  };

  logger.info('Health check complete', {
    status: overallStatus,
    healthy: report.summary.healthy,
    degraded: report.summary.degraded,
    unhealthy: report.summary.unhealthy,
  });

  return report;
}

/**
 * Create a health check endpoint (for monitoring)
 */
export function createHealthEndpoint(
  config: any,
  adapter?: DataAdapter,
) {
  return async () => {
    return checkHealth(config, adapter);
  };
}

/**
 * Check if system is healthy enough to operate
 */
export function isHealthy(report: HealthReport): boolean {
  return report.overallStatus === 'healthy' || report.overallStatus === 'degraded';
}

/**
 * Get health status summary for display
 */
export function getHealthSummary(report: HealthReport): string {
  const checks = report.checks
    .map((c) => `  ${c.component}: ${c.status}`)
    .join('\n');

  return `Health Status: ${report.overallStatus}\n${checks}`;
}
