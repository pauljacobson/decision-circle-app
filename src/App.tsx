/**
 * Decision Wheel Application
 *
 * Main application component for comparing multiple decision opportunities.
 * Users can create up to 3 wheels, rate various considerations, and export visualizations.
 *
 * Security features:
 * - All user inputs are validated and sanitized
 * - XSS protection through input validation
 * - Safe file downloads with validated filenames
 * - TypeScript for type safety
 *
 * @author Decision Circle App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, X, Copy, Download, Eye, Edit2 } from 'lucide-react';

// Import types and utilities
import { Wheel, SelectedSegment, APP_CONSTANTS } from './types';
import {
  validateWheelName,
  validateSegmentName,
  validateValue,
  validateColor
} from './utils/validation';
import { exportToJSON, exportToSVG } from './utils/exports';

// Import components
import CircleWheel from './components/CircleWheel';
import ComparisonBars from './components/ComparisonBars';

/**
 * Main Application Component
 */
const DecisionWheelApp: React.FC = () => {
  // ========== STATE MANAGEMENT ==========

  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [useNumberSelector, setUseNumberSelector] = useState<boolean>(false);
  const [nextWheelId, setNextWheelId] = useState<number>(3);
  const [selectedSegment, setSelectedSegment] = useState<SelectedSegment | null>(null);

  // Initial wheels with sample data
  const [wheels, setWheels] = useState<Wheel[]>([
    {
      id: 1,
      name: 'Opportunity A',
      color: '#60A5FA',
      segments: [
        { id: 1, name: 'Location', value: 10 },
        { id: 2, name: 'Investment', value: 7 },
        { id: 3, name: 'Time', value: 5 },
        { id: 4, name: 'Interior Design', value: 5 },
        { id: 5, name: 'Space', value: 10 },
        { id: 6, name: 'Neighbours', value: 5 }
      ]
    },
    {
      id: 2,
      name: 'Opportunity B',
      color: '#34D399',
      segments: [
        { id: 1, name: 'Location', value: 8 },
        { id: 2, name: 'Investment', value: 5 },
        { id: 3, name: 'Time', value: 7 },
        { id: 4, name: 'Interior Design', value: 6 }
      ]
    }
  ]);

  // ========== EVENT HANDLERS ==========

  /**
   * Handles clicking on a segment in the wheel visualization
   * Scrolls the corresponding input into view
   */
  const handleSegmentClick = (wheelId: number, segmentId: number): void => {
    setSelectedSegment({ wheelId, segmentId });

    // Smooth scroll to the segment input after a short delay
    setTimeout(() => {
      const element = document.getElementById(`segment-${wheelId}-${segmentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, APP_CONSTANTS.SCROLL_DELAY);
  };

  /**
   * Adds a new wheel to the comparison
   * Maximum 3 wheels allowed
   */
  const addWheel = (): void => {
    if (wheels.length >= APP_CONSTANTS.MAX_WHEELS) {
      return;
    }

    // Find an unused color
    const usedColors = wheels.map(w => w.color);
    const availableColor = APP_CONSTANTS.COLOR_PALETTE.find(c => !usedColors.includes(c))
      || APP_CONSTANTS.COLOR_PALETTE[wheels.length % APP_CONSTANTS.COLOR_PALETTE.length];

    const newWheel: Wheel = {
      id: nextWheelId,
      name: `Opportunity ${String.fromCharCode(65 + wheels.length)}`,
      color: availableColor,
      segments: [
        { id: 1, name: 'Factor 1', value: 5 },
        { id: 2, name: 'Factor 2', value: 5 },
        { id: 3, name: 'Factor 3', value: 5 }
      ]
    };

    setWheels([...wheels, newWheel]);
    setNextWheelId(nextWheelId + 1);
  };

  /**
   * Removes a wheel from the comparison
   * Minimum 2 wheels required
   */
  const removeWheel = (wheelId: number): void => {
    if (wheels.length <= APP_CONSTANTS.MIN_WHEELS) {
      return;
    }
    setWheels(wheels.filter(w => w.id !== wheelId));
  };

  /**
   * Updates a wheel's name with validation and sanitization
   */
  const updateWheelName = (wheelId: number, name: string): void => {
    const sanitizedName = validateWheelName(name);
    setWheels(wheels.map(w =>
      w.id === wheelId ? { ...w, name: sanitizedName } : w
    ));
  };

  /**
   * Updates a wheel's color with validation
   */
  const updateWheelColor = (wheelId: number, color: string): void => {
    const validColor = validateColor(color);
    setWheels(wheels.map(w =>
      w.id === wheelId ? { ...w, color: validColor } : w
    ));
  };

  /**
   * Adds a new segment/consideration to a wheel
   */
  const addSegment = (wheelId: number): void => {
    setWheels(wheels.map(w => {
      if (w.id === wheelId) {
        // Check max segments limit
        if (w.segments.length >= APP_CONSTANTS.MAX_SEGMENTS) {
          alert(`Maximum ${APP_CONSTANTS.MAX_SEGMENTS} segments allowed per wheel`);
          return w;
        }

        const newId = Math.max(0, ...w.segments.map(s => s.id)) + 1;
        return {
          ...w,
          segments: [...w.segments, { id: newId, name: 'New Factor', value: 5 }]
        };
      }
      return w;
    }));
  };

  /**
   * Removes a segment from a wheel
   * Minimum 1 segment required per wheel
   */
  const removeSegment = (wheelId: number, segmentId: number): void => {
    setWheels(wheels.map(w => {
      if (w.id === wheelId) {
        if (w.segments.length <= APP_CONSTANTS.MIN_SEGMENTS) {
          return w;
        }
        return { ...w, segments: w.segments.filter(s => s.id !== segmentId) };
      }
      return w;
    }));
  };

  /**
   * Updates a segment's property (name or value) with validation
   */
  const updateSegment = (
    wheelId: number,
    segmentId: number,
    field: 'name' | 'value',
    value: string | number
  ): void => {
    setWheels(wheels.map(w => {
      if (w.id === wheelId) {
        return {
          ...w,
          segments: w.segments.map(s => {
            if (s.id === segmentId) {
              if (field === 'name') {
                return { ...s, name: validateSegmentName(value as string) };
              } else {
                return { ...s, value: validateValue(value as number) };
              }
            }
            return s;
          })
        };
      }
      return w;
    }));
  };

  /**
   * Copies considerations from one wheel to another
   */
  const copyConsiderationsToWheel = (fromWheelId: number, toWheelId: number): void => {
    const fromWheel = wheels.find(w => w.id === fromWheelId);
    if (!fromWheel) return;

    setWheels(wheels.map(w => {
      if (w.id === toWheelId) {
        const newSegments = fromWheel.segments.map((seg, index) => ({
          id: index + 1,
          name: validateSegmentName(seg.name),
          value: 5 // Default value for new wheel
        }));
        return { ...w, segments: newSegments };
      }
      return w;
    }));
  };

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Decision Wheel Comparator
          </h1>
          {wheels.length < APP_CONSTANTS.MAX_WHEELS && (
            <button
              onClick={addWheel}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center gap-2 text-sm"
            >
              <Plus size={18} />
              Add Opportunity
            </button>
          )}
        </div>

        {/* Max wheels tip */}
        {wheels.length === APP_CONSTANTS.MAX_WHEELS && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For best decision-making results, limit comparisons to your top 2-3 options to avoid decision paralysis.
            </p>
          </div>
        )}

        {/* Wheels Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Hidden container for export */}
          <div className="wheels-container hidden">
            {wheels.map(wheel => (
              <CircleWheel key={wheel.id} wheel={wheel} />
            ))}
          </div>

          {/* Visible wheel cards */}
          {wheels.map((wheel, index) => (
            <div key={wheel.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              {/* Wheel Header */}
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="relative group flex-1">
                    <input
                      type="text"
                      value={wheel.name}
                      onChange={(e) => updateWheelName(wheel.id, e.target.value)}
                      maxLength={APP_CONSTANTS.MAX_NAME_LENGTH}
                      className="text-xl sm:text-2xl font-bold text-gray-800 border-none outline-none w-full px-2 py-1 rounded cursor-text transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      placeholder="Enter opportunity name"
                      aria-label="Opportunity name"
                    />
                    <Edit2
                      size={18}
                      className="absolute right-2 top-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                  {wheels.length > APP_CONSTANTS.MIN_WHEELS && (
                    <button
                      onClick={() => removeWheel(wheel.id)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Remove opportunity"
                      aria-label={`Remove ${wheel.name}`}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label htmlFor={`color-${wheel.id}`} className="text-sm font-medium text-gray-600">
                    Wheel Color:
                  </label>
                  <input
                    id={`color-${wheel.id}`}
                    type="color"
                    value={wheel.color}
                    onChange={(e) => updateWheelColor(wheel.id, e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    aria-label="Wheel color picker"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => copyConsiderationsToWheel(wheels[0].id, wheel.id)}
                      className="sm:ml-auto px-3 sm:px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2 text-xs sm:text-sm"
                      title={`Copy considerations from ${wheels[0].name}`}
                    >
                      <Copy size={14} />
                      <span className="hidden sm:inline">Copy from {wheels[0].name}</span>
                      <span className="sm:hidden">Copy from first</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Wheel Visualization */}
              <div className="mb-4 sm:mb-6 flex justify-center overflow-x-auto">
                <CircleWheel
                  wheel={wheel}
                  onSegmentClick={handleSegmentClick}
                  selectedSegmentId={selectedSegment?.wheelId === wheel.id ? selectedSegment.segmentId : null}
                />
              </div>

              {/* Segments List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Considerations</h3>
                  <button
                    onClick={() => setUseNumberSelector(!useNumberSelector)}
                    className="text-xs sm:text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                    aria-label={useNumberSelector ? 'Switch to slider input' : 'Switch to number buttons'}
                  >
                    {useNumberSelector ? 'Use Slider' : 'Use Numbers'}
                  </button>
                </div>
                {wheel.segments.map(segment => {
                  const isSelected = selectedSegment?.wheelId === wheel.id && selectedSegment?.segmentId === segment.id;

                  return (
                  <div
                    key={segment.id}
                    id={`segment-${wheel.id}-${segment.id}`}
                    className={`flex items-center gap-2 p-3 rounded transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-100 border-2 border-blue-400 shadow-lg scale-[1.02]'
                        : 'bg-white border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={segment.name}
                        onChange={(e) => updateSegment(wheel.id, segment.id, 'name', e.target.value)}
                        maxLength={APP_CONSTANTS.MAX_SEGMENT_NAME_LENGTH}
                        className={`w-full px-3 py-2 border rounded text-sm transition-all bg-white text-gray-900 ${
                          isSelected
                            ? 'border-blue-400 ring-2 ring-blue-200'
                            : 'border-gray-300'
                        }`}
                        placeholder="Factor name"
                        aria-label={`Consideration name for ${segment.name}`}
                      />
                    </div>
                    {useNumberSelector ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {Array.from({ length: 11 }, (_, i) => i).map(num => (
                          <button
                            key={num}
                            onClick={() => updateSegment(wheel.id, segment.id, 'value', num)}
                            className={`w-7 h-7 text-xs rounded ${
                              segment.value === num
                                ? 'bg-blue-500 text-white font-bold'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-label={`Rate ${segment.name} as ${num} out of 10`}
                            aria-pressed={segment.value === num}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={APP_CONSTANTS.MIN_VALUE}
                          max={APP_CONSTANTS.MAX_VALUE}
                          value={segment.value}
                          onChange={(e) => updateSegment(wheel.id, segment.id, 'value', parseInt(e.target.value))}
                          className="w-24 sm:w-32"
                          aria-label={`Rate ${segment.name} from ${APP_CONSTANTS.MIN_VALUE} to ${APP_CONSTANTS.MAX_VALUE}`}
                        />
                        <span className="text-sm font-medium text-gray-700 w-6 text-center" aria-live="polite">
                          {segment.value}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeSegment(wheel.id, segment.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                      disabled={wheel.segments.length === APP_CONSTANTS.MIN_SEGMENTS}
                      aria-label={`Remove ${segment.name} consideration`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  );
                })}

                <button
                  onClick={() => addSegment(wheel.id)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 mt-4 text-sm sm:text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={wheel.segments.length >= APP_CONSTANTS.MAX_SEGMENTS}
                  aria-label="Add new consideration"
                >
                  <Plus size={18} />
                  Add Consideration
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="mt-6 sm:mt-8">
          <ComparisonBars wheels={wheels} />
        </div>

        {/* Export Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Export Options</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowPreview(true)}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center justify-center gap-1.5"
                aria-label="Preview export"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                onClick={() => setShowExportMenu(true)}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center justify-center gap-1.5"
                aria-label="Open export menu"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
          >
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 id="export-modal-title" className="text-xl font-bold text-gray-900">Export Format</h2>
                <button
                  onClick={() => setShowExportMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                  aria-label="Close export menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    exportToSVG(wheels);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="font-semibold text-gray-900">SVG Vector</div>
                  <div className="text-sm text-gray-600">Complete visual with comparison - works everywhere</div>
                </button>

                <button
                  onClick={() => {
                    exportToJSON(wheels);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="font-semibold text-gray-900">JSON Data</div>
                  <div className="text-sm text-gray-600">Backup and restore your decision wheels</div>
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                <strong>Need PNG/WebP?</strong> Open the SVG in any image editor or use a free online converter like CloudConvert to convert SVG to PNG.
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
          >
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 id="preview-modal-title" className="text-xl font-bold text-gray-900">Export Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                  aria-label="Close preview"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-white space-y-6">
                  {/* Wheels */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-8 justify-center flex-wrap lg:flex-nowrap min-w-max">
                      {wheels.map(wheel => (
                        <div key={wheel.id} className="flex-shrink-0">
                          <CircleWheel wheel={wheel} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparison Bars */}
                  <div className="mt-8">
                    <ComparisonBars wheels={wheels} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionWheelApp;
