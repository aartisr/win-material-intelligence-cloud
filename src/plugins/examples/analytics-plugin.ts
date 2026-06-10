/**
 * Example plugin: Analytics tracking
 * Demonstrates how to hook into lifecycle events and track user behavior
 */

import { Plugin, PLUGIN_HOOKS } from '../registry';
import { PlatformConfig } from '../../config/types';

/**
 * Simple analytics tracker
 */
class AnalyticsTracker {
  private enabled: boolean = false;
  private provider: string = '';
  private trackingId: string = '';

  init(config: PlatformConfig) {
    const analytics = config.analytics;
    if (!analytics?.enabled) return;

    this.enabled = true;
    this.provider = analytics.provider;
    this.trackingId = analytics.trackingId || '';

    console.log(`Analytics initialized: ${this.provider}`);
  }

  trackPageView(path: string) {
    if (!this.enabled) return;
    console.log(`[Analytics] Page view: ${path}`);
    // Send to analytics provider
  }

  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.enabled) return;
    console.log(`[Analytics] Event: ${eventName}`, properties);
    // Send to analytics provider
  }

  trackUser(userId: string, properties?: Record<string, any>) {
    if (!this.enabled) return;
    console.log(`[Analytics] User: ${userId}`, properties);
    // Send to analytics provider
  }
}

const tracker = new AnalyticsTracker();

/**
 * Analytics Plugin
 * Tracks page views, events, and user interactions
 */
export const analyticsPlugin: Plugin = {
  id: 'analytics',
  name: 'Analytics & Tracking',
  version: '1.0.0',

  async init(config: PlatformConfig) {
    tracker.init(config);
  },

  getHooks() {
    return {
      [PLUGIN_HOOKS.APP_READY]: [
        () => {
          tracker.trackEvent('app:ready');
        },
      ],

      [PLUGIN_HOOKS.ROUTE_AFTER_ENTER]: [
        (route: any) => {
          tracker.trackPageView(route.path);
        },
      ],

      [PLUGIN_HOOKS.AUTH_LOGIN]: [
        (user: any) => {
          tracker.trackUser(user.id, { email: user.email });
        },
      ],

      [PLUGIN_HOOKS.DATA_AFTER_FETCH]: [
        (data: any) => {
          tracker.trackEvent('data:fetched', { itemCount: data?.length });
        },
      ],
    };
  },
};

/**
 * Example: Usage in configuration
 *
 * plugins: [
 *   {
 *     id: 'analytics',
 *     name: 'Analytics & Tracking',
 *     version: '1.0.0',
 *     enabled: true,
 *   },
 * ]
 */
