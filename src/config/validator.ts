/**
 * Configuration validation and schema checking
 * Ensures config is valid before app initialization
 */

import { PlatformConfig } from './types';

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validate configuration schema
 */
export function validateConfig(config: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Basic structure validation
  if (!config) {
    errors.push({
      path: 'root',
      message: 'Configuration is null or undefined',
      severity: 'error',
    });
    return errors;
  }

  // Domain validation
  if (!config.domain || typeof config.domain !== 'string') {
    errors.push({
      path: 'domain',
      message: 'domain must be a non-empty string',
      severity: 'error',
    });
  }

  // App name validation
  if (!config.appName || typeof config.appName !== 'string') {
    errors.push({
      path: 'appName',
      message: 'appName must be a non-empty string',
      severity: 'error',
    });
  }

  // Theme validation
  if (config.theme) {
    const themeErrors = validateTheme(config.theme);
    errors.push(...themeErrors);
  }

  // Data adapter validation
  if (config.dataAdapter) {
    const adapterErrors = validateDataAdapter(config.dataAdapter);
    errors.push(...adapterErrors);
  }

  // Features validation
  if (config.features && typeof config.features !== 'object') {
    errors.push({
      path: 'features',
      message: 'features must be an object',
      severity: 'error',
    });
  }

  // Plugins validation
  if (config.plugins && !Array.isArray(config.plugins)) {
    errors.push({
      path: 'plugins',
      message: 'plugins must be an array',
      severity: 'error',
    });
  }

  // Layout validation
  if (config.layout) {
    const layoutErrors = validateLayout(config.layout);
    errors.push(...layoutErrors);
  }

  return errors;
}

function validateTheme(theme: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!theme.colors || typeof theme.colors !== 'object') {
    errors.push({
      path: 'theme.colors',
      message: 'theme.colors must be an object',
      severity: 'error',
    });
  } else {
    // Check required colors
    const requiredColors = [
      'primary',
      'accent',
      'surface',
      'ink',
      'success',
      'warning',
      'error',
    ];
    for (const color of requiredColors) {
      if (!theme.colors[color]) {
        errors.push({
          path: `theme.colors.${color}`,
          message: `Required color '${color}' is missing`,
          severity: 'error',
        });
      }
    }
  }

  if (!theme.typography) {
    errors.push({
      path: 'theme.typography',
      message: 'theme.typography is required',
      severity: 'error',
    });
  }

  return errors;
}

function validateDataAdapter(adapter: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!adapter.type) {
    errors.push({
      path: 'dataAdapter.type',
      message: 'dataAdapter.type is required',
      severity: 'error',
    });
  } else if (!['rest', 'graphql', 'mock', 'custom'].includes(adapter.type)) {
    errors.push({
      path: 'dataAdapter.type',
      message: `dataAdapter.type must be 'rest', 'graphql', 'mock', or 'custom'`,
      severity: 'error',
    });
  }

  if (adapter.type === 'rest' && adapter.baseUrl) {
    try {
      new URL(adapter.baseUrl);
    } catch {
      errors.push({
        path: 'dataAdapter.baseUrl',
        message: `baseUrl '${adapter.baseUrl}' is not a valid URL`,
        severity: 'error',
      });
    }
  }

  return errors;
}

function validateLayout(layout: any): ValidationError[] {
  const errors: ValidationError[] = [];

  const validPositions = ['left', 'right'];
  if (layout.sidebarPosition && !validPositions.includes(layout.sidebarPosition)) {
    errors.push({
      path: 'layout.sidebarPosition',
      message: `sidebarPosition must be 'left' or 'right'`,
      severity: 'error',
    });
  }

  const booleanFields = [
    'collapsibleSidebar',
    'topbarSticky',
    'footerVisible',
  ];
  for (const field of booleanFields) {
    if (layout[field] !== undefined && typeof layout[field] !== 'boolean') {
      errors.push({
        path: `layout.${field}`,
        message: `${field} must be a boolean`,
        severity: 'error',
      });
    }
  }

  return errors;
}

/**
 * Check if validation has critical errors
 */
export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.some((e) => e.severity === 'error');
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((e) => `[${e.severity.toUpperCase()}] ${e.path}: ${e.message}`)
    .join('\n');
}

/**
 * Validate and throw on critical errors
 */
export function validateConfigOrThrow(config: PlatformConfig): void {
  const errors = validateConfig(config);

  if (hasValidationErrors(errors)) {
    const formatted = formatValidationErrors(errors);
    throw new Error(
      `Configuration validation failed:\n${formatted}`,
    );
  }

  // Log warnings
  const warnings = errors.filter((e) => e.severity === 'warning');
  if (warnings.length > 0) {
    console.warn(
      `Configuration warnings:\n${formatValidationErrors(warnings)}`,
    );
  }
}
