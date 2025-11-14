/**
 * Type definitions for the Decision Wheel application
 *
 * This file contains all TypeScript interfaces and types used throughout the application.
 * These types ensure type safety and provide better IDE support.
 */

/**
 * Represents a single segment (consideration/factor) within a decision wheel
 */
export interface Segment {
  /** Unique identifier for the segment */
  id: number;
  /** User-defined name for this consideration (max 50 characters) */
  name: string;
  /** Rating value from 0-10 */
  value: number;
}

/**
 * Represents a complete decision wheel (opportunity)
 */
export interface Wheel {
  /** Unique identifier for the wheel */
  id: number;
  /** User-defined name for this opportunity (max 50 characters) */
  name: string;
  /** Hex color code for wheel visualization */
  color: string;
  /** Array of segments/considerations for this wheel */
  segments: Segment[];
}

/**
 * Represents which segment is currently selected for editing
 */
export interface SelectedSegment {
  /** ID of the wheel containing the selected segment */
  wheelId: number;
  /** ID of the selected segment */
  segmentId: number;
}

/**
 * Configuration constants for the application
 */
export const APP_CONSTANTS = {
  /** Maximum number of wheels allowed */
  MAX_WHEELS: 3,
  /** Minimum number of wheels required */
  MIN_WHEELS: 2,
  /** Minimum number of segments per wheel */
  MIN_SEGMENTS: 1,
  /** Maximum number of segments per wheel */
  MAX_SEGMENTS: 20,
  /** Minimum rating value */
  MIN_VALUE: 0,
  /** Maximum rating value */
  MAX_VALUE: 10,
  /** Maximum length for wheel names */
  MAX_NAME_LENGTH: 50,
  /** Maximum length for segment names */
  MAX_SEGMENT_NAME_LENGTH: 50,
  /** Available color palette for wheels */
  COLOR_PALETTE: ['#60A5FA', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6'],
  /** Scroll delay for segment selection (ms) */
  SCROLL_DELAY: 100,
} as const;
