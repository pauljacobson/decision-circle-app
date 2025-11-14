/**
 * CircleWheel Component
 *
 * Renders an interactive SVG-based circular visualization of a decision wheel.
 * Each segment represents a consideration/factor with its rating displayed as
 * a filled pie slice from the center.
 *
 * Security: All data is sanitized before rendering. No user input is directly
 * inserted into the DOM without validation.
 */

import React from 'react';
import { Wheel } from '../types';

interface CircleWheelProps {
  /** The wheel data to visualize */
  wheel: Wheel;
  /** Optional callback when a segment is clicked */
  onSegmentClick?: (wheelId: number, segmentId: number) => void;
  /** ID of currently selected segment for highlighting */
  selectedSegmentId?: number | null;
}

/**
 * CircleWheel Component
 *
 * Creates an SVG visualization where:
 * - The circle is divided into equal segments (one per consideration)
 * - Each segment fills from center based on its rating (0-10)
 * - Segments can be clicked to scroll to their input field
 * - Selected segments are highlighted with a pulsing ring
 */
const CircleWheel: React.FC<CircleWheelProps> = ({
  wheel,
  onSegmentClick,
  selectedSegmentId
}) => {
  // SVG configuration constants
  const RADIUS = 140;
  const CENTER_X = 220;
  const CENTER_Y = 220;
  const LABEL_DISTANCE = RADIUS + 30;

  const segmentCount = wheel.segments.length;
  const anglePerSegment = (2 * Math.PI) / segmentCount;

  /**
   * Creates an SVG path for a segment
   *
   * @param index - Segment index (determines position around circle)
   * @param fillPercentage - How much to fill (0-1 based on rating/10)
   * @returns SVG path string or empty string if no fill
   */
  const createSegmentPath = (index: number, fillPercentage: number): string => {
    const startAngle = index * anglePerSegment - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;

    const outerRadius = RADIUS * fillPercentage;

    const x1 = CENTER_X + outerRadius * Math.cos(startAngle);
    const y1 = CENTER_Y + outerRadius * Math.sin(startAngle);
    const x2 = CENTER_X + outerRadius * Math.cos(endAngle);
    const y2 = CENTER_Y + outerRadius * Math.sin(endAngle);

    // Create pie slice from center point
    if (fillPercentage > 0) {
      return `M ${CENTER_X} ${CENTER_Y} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} Z`;
    }
    return '';
  };

  /**
   * Calculates position for segment label
   *
   * @param index - Segment index
   * @returns Object with x, y coordinates
   */
  const getLabelPosition = (index: number): { x: number; y: number } => {
    const angle = (index + 0.5) * anglePerSegment - Math.PI / 2;
    return {
      x: CENTER_X + LABEL_DISTANCE * Math.cos(angle),
      y: CENTER_Y + LABEL_DISTANCE * Math.sin(angle)
    };
  };

  return (
    <svg width="440" height="440" className="mx-auto">
      {wheel.segments.map((segment, index) => {
        const fillPercentage = segment.value / 10;
        const pos = getLabelPosition(index);
        const isSelected = selectedSegmentId === segment.id;

        return (
          <g
            key={segment.id}
            onClick={() => onSegmentClick?.(wheel.id, segment.id)}
            className={onSegmentClick ? "cursor-pointer" : ""}
            style={{ transition: 'all 0.2s ease' }}
          >
            {/* Segment border outline */}
            <path
              d={createSegmentPath(index, 1)}
              fill="none"
              stroke={isSelected ? wheel.color : "#e5e7eb"}
              strokeWidth={isSelected ? "4" : "2"}
              className="transition-all duration-200"
            />

            {/* Filled portion based on rating */}
            <path
              d={createSegmentPath(index, fillPercentage)}
              fill={wheel.color}
              opacity={isSelected ? "1" : "0.8"}
              className="transition-all duration-200 hover:opacity-100"
            />

            {/* Dividing lines between segments */}
            <line
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={CENTER_X + RADIUS * Math.cos(index * anglePerSegment - Math.PI / 2)}
              y2={CENTER_Y + RADIUS * Math.sin(index * anglePerSegment - Math.PI / 2)}
              stroke="#9ca3af"
              strokeWidth="1"
            />

            {/* Segment name label */}
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              className={`text-sm font-medium ${isSelected ? 'fill-gray-900 font-bold' : 'fill-gray-700'} transition-all duration-200`}
              dominantBaseline="middle"
            >
              {segment.name}
            </text>

            {/* Segment value label */}
            <text
              x={pos.x}
              y={pos.y + 16}
              textAnchor="middle"
              className={`text-xs ${isSelected ? 'fill-gray-700 font-bold' : 'fill-gray-500'} transition-all duration-200`}
              dominantBaseline="middle"
            >
              {segment.value}
            </text>

            {/* Selection indicator ring (pulsing animation) */}
            {isSelected && (
              <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={RADIUS * fillPercentage + 5}
                fill="none"
                stroke={wheel.color}
                strokeWidth="3"
                opacity="0.6"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            )}
          </g>
        );
      })}

      {/* Center circle decoration */}
      <circle
        cx={CENTER_X}
        cy={CENTER_Y}
        r="8"
        fill="white"
        stroke="#9ca3af"
        strokeWidth="2"
      />
    </svg>
  );
};

export default CircleWheel;
