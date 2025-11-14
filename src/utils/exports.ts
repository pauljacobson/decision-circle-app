/**
 * Export Utilities
 *
 * Secure functions for exporting decision wheels in various formats.
 * All functions include error handling and security measures to prevent
 * malicious file downloads.
 *
 * Security measures:
 * - Validates data before export
 * - Sanitizes filenames to prevent directory traversal
 * - Uses Blob API safely
 * - Cleans up temporary URLs
 */

import { Wheel } from '../types';
import { validateFileName } from './validation';

/**
 * Creates a safe download link and triggers download
 *
 * @param blob - Data to download
 * @param filename - Desired filename (will be sanitized)
 */
function triggerDownload(blob: Blob, filename: string): void {
  try {
    const sanitizedFilename = validateFileName(filename);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = sanitizedFilename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to trigger download');
  }
}

/**
 * Exports wheels data as JSON
 *
 * Creates a JSON file containing all wheel data for backup or sharing.
 * The JSON is pretty-printed for readability.
 *
 * @param wheels - Array of wheels to export
 * @throws Error if export fails
 *
 * @example
 * exportToJSON(wheels) // Downloads: decision-wheels-1234567890.json
 */
export function exportToJSON(wheels: Wheel[]): void {
  try {
    // Validate data exists
    if (!wheels || wheels.length === 0) {
      throw new Error('No wheels to export');
    }

    const dataStr = JSON.stringify(wheels, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const filename = `decision-wheels-${Date.now()}.json`;

    triggerDownload(dataBlob, filename);
  } catch (error) {
    console.error('JSON export error:', error);
    alert('JSON export failed. Please try again.');
  }
}

/**
 * Exports visualization as SVG
 *
 * Creates an SVG file containing all wheel visualizations and comparison bars.
 * SVG is a vector format that can be scaled without quality loss.
 *
 * @param wheels - Array of wheels to export
 * @throws Error if export fails
 *
 * @example
 * exportToSVG(wheels) // Downloads: decision-wheels-1234567890.svg
 */
export function exportToSVG(wheels: Wheel[]): void {
  try {
    const wheelsContainer = document.querySelector('.wheels-container');
    if (!wheelsContainer) {
      throw new Error('Cannot find wheels to export');
    }

    const svgs = wheelsContainer.querySelectorAll('svg');
    if (svgs.length === 0) {
      throw new Error('No wheels found to export');
    }

    // SVG dimensions
    const svgWidth = 440;
    const gap = 40;
    const padding = 40;
    const wheelsWidth = (svgWidth * svgs.length) + (gap * (svgs.length - 1)) + (padding * 2);
    const wheelsHeight = 480;
    const comparisonHeight = 200;
    const comparisonPadding = 40;
    const totalHeight = wheelsHeight + comparisonHeight + comparisonPadding;

    // Build combined SVG
    let combinedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${wheelsWidth}" height="${totalHeight}" viewBox="0 0 ${wheelsWidth} ${totalHeight}">
  <rect width="${wheelsWidth}" height="${totalHeight}" fill="white"/>`;

    // Add wheel SVGs
    Array.from(svgs).forEach((svg, index) => {
      const xOffset = padding + (index * (svgWidth + gap));
      const svgData = new XMLSerializer().serializeToString(svg);
      const cleanedData = svgData.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
      combinedSVG += `<g transform="translate(${xOffset}, ${padding})">${cleanedData}</g>`;
    });

    // Add comparison bars
    const comparisonY = wheelsHeight + comparisonPadding;
    const barWidth = wheelsWidth - (padding * 2);
    const barHeight = 40;
    const barGap = 20;

    combinedSVG += `<text x="${wheelsWidth / 2}" y="${comparisonY}" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">Overall Comparison</text>`;

    wheels.forEach((wheel, index) => {
      const avg = wheel.segments.reduce((acc, s) => acc + s.value, 0) / wheel.segments.length;
      const percentage = (avg / 10) * 100;
      const barY = comparisonY + 40 + (index * (barHeight + barGap));

      combinedSVG += `<text x="${padding}" y="${barY + 15}" font-size="14" font-weight="600" fill="#374151">${wheel.name}</text>`;
      combinedSVG += `<text x="${wheelsWidth - padding}" y="${barY + 15}" text-anchor="end" font-size="16" font-weight="bold" fill="#111827">${avg.toFixed(1)} / 10</text>`;
      combinedSVG += `<rect x="${padding}" y="${barY + 20}" width="${barWidth}" height="${barHeight}" rx="20" fill="#E5E7EB"/>`;

      const fillWidth = (barWidth * percentage) / 100;
      combinedSVG += `<rect x="${padding}" y="${barY + 20}" width="${fillWidth}" height="${barHeight}" rx="20" fill="${wheel.color}"/>`;

      if (fillWidth > 60) {
        combinedSVG += `<text x="${padding + fillWidth - 15}" y="${barY + 20 + (barHeight / 2) + 5}" text-anchor="end" font-size="12" font-weight="600" fill="white">${percentage.toFixed(0)}%</text>`;
      }
    });

    combinedSVG += '</svg>';

    const blob = new Blob([combinedSVG], { type: 'image/svg+xml;charset=utf-8' });
    const filename = `decision-wheels-${Date.now()}.svg`;

    triggerDownload(blob, filename);
  } catch (error) {
    console.error('SVG export error:', error);
    alert('SVG export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

/**
 * Exports visualization as WebP image
 *
 * Creates a raster image file. This is more compatible with standard image viewers
 * but loses the scalability of SVG.
 *
 * @param wheels - Array of wheels to export
 *
 * @example
 * exportToWebP(wheels) // Downloads: decision-wheels-1234567890.webp
 */
export async function exportToWebP(_wheels: Wheel[]): Promise<void> {
  try {
    const wheelsContainer = document.querySelector('.wheels-container');
    if (!wheelsContainer) {
      throw new Error('Cannot find wheels container');
    }

    const svgs = wheelsContainer.querySelectorAll('svg');
    if (svgs.length === 0) {
      throw new Error('No wheels found');
    }

    // Build SVG string
    const svgWidth = 440;
    const gap = 40;
    const padding = 40;
    const wheelsWidth = (svgWidth * svgs.length) + (gap * (svgs.length - 1)) + (padding * 2);
    const wheelsHeight = 480;
    const comparisonHeight = 200;
    const comparisonPadding = 40;
    const totalHeight = wheelsHeight + comparisonHeight + comparisonPadding;

    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${wheelsWidth}" height="${totalHeight}" viewBox="0 0 ${wheelsWidth} ${totalHeight}">
      <rect width="${wheelsWidth}" height="${totalHeight}" fill="white"/>`;

    // Add wheels
    Array.from(svgs).forEach((svg, index) => {
      const xOffset = padding + (index * (svgWidth + gap));
      const svgData = new XMLSerializer().serializeToString(svg);
      const cleanedData = svgData.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
      svgString += `<g transform="translate(${xOffset}, ${padding})">${cleanedData}</g>`;
    });

    svgString += '</svg>';

    // Convert to image
    const canvas = document.createElement('canvas');
    canvas.width = wheelsWidth * 2; // 2x for better quality
    canvas.height = totalHeight * 2;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Cannot create canvas context');
    }

    ctx.scale(2, 2);

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, wheelsWidth, totalHeight);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Convert to WebP
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create WebP blob');
        }

        const filename = `decision-wheels-${Date.now()}.webp`;
        triggerDownload(blob, filename);
      }, 'image/webp', 0.95);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      throw new Error('Image load failed');
    };

    img.src = url;
  } catch (error) {
    console.error('WebP export error:', error);
    alert('WebP export failed. Please use SVG export instead.');
  }
}
