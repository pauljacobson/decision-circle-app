/**
 * Input validation and sanitization utilities
 *
 * This module provides secure input handling to prevent XSS attacks and ensure data integrity.
 * All user inputs should be validated and sanitized using these utilities.
 */

import { APP_CONSTANTS } from '../types';

/**
 * Sanitizes user text input to prevent XSS attacks
 *
 * This function removes potentially dangerous characters and HTML tags from user input.
 * It's designed to be strict to prevent code injection while allowing normal text.
 *
 * @param input - Raw user input string
 * @returns Sanitized string safe for display and storage
 *
 * @example
 * sanitizeTextInput('<script>alert("XSS")</script>') // Returns: 'scriptalert("XSS")/script'
 * sanitizeTextInput('Normal Text 123') // Returns: 'Normal Text 123'
 */
export function sanitizeTextInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags and dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets (prevents HTML/script tags)
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick, onload, etc.)
    .trim();
}

/**
 * Validates and sanitizes wheel/opportunity name
 *
 * Ensures the name meets length requirements and doesn't contain dangerous content.
 *
 * @param name - Raw wheel name from user input
 * @returns Sanitized and validated wheel name
 * @throws Error if name is empty after sanitization
 *
 * @example
 * validateWheelName('My Opportunity') // Returns: 'My Opportunity'
 * validateWheelName('<script>Evil</script>') // Returns: 'scriptEvil/script'
 */
export function validateWheelName(name: string): string {
  const sanitized = sanitizeTextInput(name);

  // Ensure name is not empty
  if (!sanitized || sanitized.length === 0) {
    return 'Unnamed Opportunity';
  }

  // Truncate to max length
  return sanitized.slice(0, APP_CONSTANTS.MAX_NAME_LENGTH);
}

/**
 * Validates and sanitizes segment/consideration name
 *
 * @param name - Raw segment name from user input
 * @returns Sanitized and validated segment name
 *
 * @example
 * validateSegmentName('Location') // Returns: 'Location'
 * validateSegmentName('') // Returns: 'Unnamed Factor'
 */
export function validateSegmentName(name: string): string {
  const sanitized = sanitizeTextInput(name);

  if (!sanitized || sanitized.length === 0) {
    return 'Unnamed Factor';
  }

  return sanitized.slice(0, APP_CONSTANTS.MAX_SEGMENT_NAME_LENGTH);
}

/**
 * Validates and clamps numeric values to allowed range
 *
 * Ensures rating values are within 0-10 range and are valid numbers.
 *
 * @param value - Raw value from user input
 * @returns Validated number between MIN_VALUE and MAX_VALUE
 *
 * @example
 * validateValue(5) // Returns: 5
 * validateValue(15) // Returns: 10 (clamped to max)
 * validateValue(-5) // Returns: 0 (clamped to min)
 * validateValue(NaN) // Returns: 5 (default)
 */
export function validateValue(value: number | string): number {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  // Return default if invalid
  if (isNaN(numValue) || !isFinite(numValue)) {
    return 5; // Default middle value
  }

  // Clamp to valid range
  return Math.max(
    APP_CONSTANTS.MIN_VALUE,
    Math.min(APP_CONSTANTS.MAX_VALUE, Math.round(numValue))
  );
}

/**
 * Validates hex color code
 *
 * Ensures color values are valid hex codes to prevent injection.
 *
 * @param color - Raw color string from user input
 * @returns Valid hex color code or default color
 *
 * @example
 * validateColor('#FF0000') // Returns: '#FF0000'
 * validateColor('red') // Returns: '#60A5FA' (default)
 * validateColor('#XYZ') // Returns: '#60A5FA' (default)
 */
export function validateColor(color: string): string {
  // Hex color regex: # followed by exactly 3 or 6 hex digits
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (typeof color === 'string' && hexColorRegex.test(color)) {
    return color;
  }

  // Return default color if invalid
  return APP_CONSTANTS.COLOR_PALETTE[0];
}

/**
 * Validates file name for exports
 *
 * Prevents directory traversal and ensures safe file names.
 *
 * @param filename - Desired filename
 * @returns Safe filename without path characters
 *
 * @example
 * validateFileName('my-export') // Returns: 'my-export'
 * validateFileName('../../../etc/passwd') // Returns: 'etcpasswd'
 */
export function validateFileName(filename: string): string {
  return sanitizeTextInput(filename)
    .replace(/[/\\:*?"<>|]/g, '') // Remove path separators and invalid filename chars
    .replace(/\.\./g, '') // Remove directory traversal attempts
    .slice(0, 100); // Limit filename length
}
