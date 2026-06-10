/**
 * Plugin system for modular, extensible architecture
 * Supports hooks for lifecycle events, feature expansion, and component injection
 */

import type { PlatformConfig, PluginConfig } from '../config/types';

export type HookCallback = (...args: any[]) => any | Promise<any>;

export interface Plugin {
  id: string;
  name: string;
  version: string;
  init?: (config: PlatformConfig) => Promise<void>;
  destroy?: () => Promise<void>;
  getHooks?: () => Record<string, HookCallback[]>;
  getComponents?: () => Record<string, any>;
  getRoutes?: () => any[];
  getNavItems?: () => any[];
}

/**
 * Global plugin registry and hook system
 */
class PluginRegistry {
  private plugins = new Map<string, Plugin>();
  private hooks = new Map<string, HookCallback[]>();

  async register(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already registered`);
      return;
    }
    this.plugins.set(plugin.id, plugin);

    // Register hooks
    if (plugin.getHooks) {
      const pluginHooks = plugin.getHooks();
      Object.entries(pluginHooks).forEach(([hookName, callbacks]) => {
        if (!this.hooks.has(hookName)) {
          this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName)!.push(...callbacks);
      });
    }

    console.log(`Plugin registered: ${plugin.name} (${plugin.version})`);
  }

  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    if (plugin.destroy) {
      await plugin.destroy();
    }

    this.plugins.delete(pluginId);

    // Remove hooks
    this.hooks.forEach((callbacks) => {
      const pluginCallbacks = callbacks.filter(
        (cb) => cb.toString().includes(pluginId),
      );
      pluginCallbacks.forEach((cb) => {
        const index = callbacks.indexOf(cb);
        if (index > -1) callbacks.splice(index, 1);
      });
    });

    console.log(`Plugin unregistered: ${pluginId}`);
  }

  async initialize(pluginId: string, config: PlatformConfig): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error(`Plugin ${pluginId} not found`);

    if (plugin.init) {
      await plugin.init(config);
    }
  }

  async initializeAll(config: PlatformConfig): Promise<void> {
    for (const [pluginId, plugin] of this.plugins) {
      if (plugin.init) {
        try {
          await plugin.init(config);
        } catch (error) {
          console.error(`Failed to initialize plugin ${pluginId}:`, error);
        }
      }
    }
  }

  async executeHook(
    hookName: string,
    ...args: any[]
  ): Promise<any[]> {
    const callbacks = this.hooks.get(hookName) || [];
    const results: any[] = [];

    for (const callback of callbacks) {
      try {
        const result = await callback(...args);
        results.push(result);
      } catch (error) {
        console.error(`Error executing hook ${hookName}:`, error);
      }
    }

    return results;
  }

  async executeHookSequential(
    hookName: string,
    ...args: any[]
  ): Promise<any> {
    const callbacks = this.hooks.get(hookName) || [];
    let result = args[0];

    for (const callback of callbacks) {
      try {
        result = await callback(result, ...args.slice(1));
      } catch (error) {
        console.error(`Error executing hook ${hookName}:`, error);
      }
    }

    return result;
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getHookNames(): string[] {
    return Array.from(this.hooks.keys());
  }

  hasHook(hookName: string): boolean {
    return this.hooks.has(hookName);
  }
}

// Global singleton instance
export const pluginRegistry = new PluginRegistry();

/**
 * Standard hook names for common lifecycle events
 */
export const PLUGIN_HOOKS = {
  // Application lifecycle
  APP_INIT: 'app:init',
  APP_READY: 'app:ready',
  APP_DESTROY: 'app:destroy',

  // Route lifecycle
  ROUTE_BEFORE_ENTER: 'route:beforeEnter',
  ROUTE_AFTER_ENTER: 'route:afterEnter',
  ROUTE_BEFORE_EXIT: 'route:beforeExit',

  // Data lifecycle
  DATA_BEFORE_FETCH: 'data:beforeFetch',
  DATA_AFTER_FETCH: 'data:afterFetch',
  DATA_BEFORE_CACHE: 'data:beforeCache',

  // Component lifecycle
  COMPONENT_BEFORE_RENDER: 'component:beforeRender',
  COMPONENT_AFTER_RENDER: 'component:afterRender',

  // Authentication
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_TOKEN_REFRESH: 'auth:tokenRefresh',

  // Custom hooks
  CUSTOM: 'custom:',
} as const;

/**
 * Helper to create plugin from configuration
 */
export function createPluginFromConfig(config: PluginConfig): Plugin {
  return {
    id: config.id,
    name: config.name,
    version: config.version,
    getHooks: () => {
      // Return empty hooks for config-based plugins
      return {};
    },
  };
}
