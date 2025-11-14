/**
 * ComparisonBars Component
 *
 * Displays a visual comparison of all decision wheels using horizontal bar charts.
 * Shows average ratings, percentages, and highlights the highest-rated option.
 *
 * Also displays a warning when wheels have different considerations, indicating
 * that the comparison may not be directly equivalent.
 */

import React from 'react';
import { Wheel } from '../types';
import { calculateAverage, doConsiderationsMatch } from '../utils/calculations';

interface ComparisonBarsProps {
  /** Array of wheels to compare */
  wheels: Wheel[];
}

/**
 * ComparisonBars Component
 *
 * Features:
 * - Horizontal bar visualization of average ratings
 * - Percentage calculation (0-100%)
 * - Identifies and highlights the highest-rated wheel
 * - Warns when considerations don't match across wheels
 * - Shows score differential between top choices
 */
const ComparisonBars: React.FC<ComparisonBarsProps> = ({ wheels }) => {
  // Calculate averages for all wheels
  const averages = wheels.map(wheel => ({
    wheel,
    avg: parseFloat(calculateAverage(wheel))
  }));

  // Check if all wheels have matching considerations
  const considerationsMatch = doConsiderationsMatch(wheels);

  // Sort to find highest rated
  const sorted = [...averages].sort((a, b) => b.avg - a.avg);
  const highest = sorted[0];
  const secondHighest = sorted[1];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
        Overall Comparison
      </h2>

      {/* Warning when considerations don't match */}
      {!considerationsMatch && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Note:</strong> The considerations don't match across all opportunities.
            This comparison is based on the average rating of each opportunity's own considerations,
            not a direct side-by-side comparison of the same factors.
          </p>
        </div>
      )}

      {/* Bar charts for each wheel */}
      <div className="space-y-6">
        {averages.map(({ wheel, avg }) => {
          const percentage = (avg / 10) * 100;

          return (
            <div key={wheel.id} className="space-y-2">
              {/* Wheel name and score */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm sm:text-base font-semibold text-gray-700">
                  {wheel.name}
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  {avg.toFixed(1)} / 10
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-8 sm:h-10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: wheel.color
                  }}
                >
                  {percentage > 15 && (
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary section showing highest rated */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          {highest.avg === secondHighest?.avg ? (
            // Handle tie scenario
            <p className="text-base sm:text-lg text-gray-700 font-bold">
              Multiple opportunities are rated equally at the top
            </p>
          ) : (
            // Show winner and margin
            <p className="text-base sm:text-lg text-gray-700">
              <span className="font-bold" style={{ color: highest.wheel.color }}>
                {highest.wheel.name}
              </span>
              {' '}scores highest at{' '}
              <span className="font-bold">{highest.avg.toFixed(1)}</span>
              {secondHighest && (
                <>
                  {', '}
                  <span className="font-bold">
                    {(highest.avg - secondHighest.avg).toFixed(1)}
                  </span>
                  {' points ahead of '}
                  <span className="font-bold" style={{ color: secondHighest.wheel.color }}>
                    {secondHighest.wheel.name}
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonBars;
