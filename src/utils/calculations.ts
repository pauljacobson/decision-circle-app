/**
 * Calculation utilities for decision wheel analytics
 *
 * This module provides pure functions for calculating statistics and
 * comparisons between decision wheels.
 */

import { Wheel } from '../types';

/**
 * Calculates the average rating for a wheel
 *
 * Returns the mean of all segment values in a wheel. Returns 0 if wheel has no segments.
 *
 * @param wheel - The wheel to calculate average for
 * @returns Average value rounded to 1 decimal place
 *
 * @example
 * calculateAverage({ segments: [{ value: 5 }, { value: 7 }] }) // Returns: '6.0'
 * calculateAverage({ segments: [] }) // Returns: '0.0'
 */
export function calculateAverage(wheel: Wheel): string {
  if (!wheel.segments || wheel.segments.length === 0) {
    return '0.0';
  }

  const sum = wheel.segments.reduce((acc, seg) => acc + seg.value, 0);
  const average = sum / wheel.segments.length;

  return average.toFixed(1);
}

/**
 * Checks if all wheels have matching consideration names
 *
 * Used to determine if wheels can be directly compared. Comparison is case-insensitive
 * and ignores leading/trailing whitespace.
 *
 * @param wheels - Array of wheels to compare
 * @returns true if all wheels have the same considerations in the same order
 *
 * @example
 * doConsiderationsMatch([
 *   { segments: [{ name: 'Cost' }, { name: 'Time' }] },
 *   { segments: [{ name: 'cost' }, { name: 'time' }] }
 * ]) // Returns: true
 */
export function doConsiderationsMatch(wheels: Wheel[]): boolean {
  if (wheels.length === 0) {
    return true;
  }

  // Get normalized consideration names from first wheel
  const firstConsiderations = wheels[0].segments
    .map(s => s.name.toLowerCase().trim())
    .sort();

  // Check if all other wheels have the same considerations
  return wheels.every((wheel, index) => {
    if (index === 0) return true;

    const considerations = wheel.segments
      .map(s => s.name.toLowerCase().trim())
      .sort();

    if (considerations.length !== firstConsiderations.length) {
      return false;
    }

    return considerations.every((name, i) => name === firstConsiderations[i]);
  });
}

/**
 * Gets the highest-rated wheel(s) from an array
 *
 * @param wheels - Array of wheels to analyze
 * @returns Array of wheels with the highest average rating
 *
 * @example
 * getHighestRatedWheel([wheelA, wheelB]) // Returns: [wheelA] if wheelA has higher avg
 */
export function getHighestRatedWheels(wheels: Wheel[]): Wheel[] {
  if (wheels.length === 0) {
    return [];
  }

  const averages = wheels.map(wheel => ({
    wheel,
    avg: parseFloat(calculateAverage(wheel))
  }));

  const maxAvg = Math.max(...averages.map(a => a.avg));

  return averages
    .filter(a => a.avg === maxAvg)
    .map(a => a.wheel);
}

/**
 * Calculates percentage score for a wheel (0-100%)
 *
 * @param wheel - The wheel to calculate percentage for
 * @returns Percentage score as a number (0-100)
 */
export function calculatePercentage(wheel: Wheel): number {
  const avg = parseFloat(calculateAverage(wheel));
  return (avg / 10) * 100;
}
