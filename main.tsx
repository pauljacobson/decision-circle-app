import React, { useState } from 'react';
import { Plus, Trash2, X, Copy, Download, Eye, Edit2 } from 'lucide-react';

const DecisionWheel = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [useNumberSelector, setUseNumberSelector] = useState(false);
  const [nextWheelId, setNextWheelId] = useState(3);
  const [selectedSegment, setSelectedSegment] = useState(null); // { wheelId, segmentId }
  
  const handleSegmentClick = (wheelId, segmentId) => {
    setSelectedSegment({ wheelId, segmentId });
    
    // Scroll to the segment input
    setTimeout(() => {
      const element = document.getElementById(`segment-${wheelId}-${segmentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };
  const [wheels, setWheels] = useState([
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

  const addWheel = () => {
    if (wheels.length >= 3) return;
    
    const colors = ['#60A5FA', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6'];
    const usedColors = wheels.map(w => w.color);
    const availableColor = colors.find(c => !usedColors.includes(c)) || colors[wheels.length % colors.length];
    
    const newWheel = {
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

  const removeWheel = (wheelId) => {
    if (wheels.length <= 2) return;
    setWheels(wheels.filter(w => w.id !== wheelId));
  };

  const updateWheelName = (wheelId, name) => {
    setWheels(wheels.map(w => w.id === wheelId ? { ...w, name } : w));
  };

  const updateWheelColor = (wheelId, color) => {
    setWheels(wheels.map(w => w.id === wheelId ? { ...w, color } : w));
  };

  const addSegment = (wheelId) => {
    setWheels(wheels.map(w => {
      if (w.id === wheelId) {
        const newId = Math.max(0, ...w.segments.map(s => s.id)) + 1;
        return {
          ...w,
          segments: [...w.segments, { id: newId, name: 'New Factor', value: 5 }]
        };
      }
      return w;
    }));
  };

  const removeSegment = (wheelId, segmentId) => {
    setWheels(wheels.map(w => {
      if (w.id === wheelId) {
        return { ...w, segments: w.segments.filter(s => s.id !== segmentId) };
      }
      return w;
    }));
  };

  const updateSegment = (wheelId, segmentId, field, value) => {
    setWheels(wheels.map(w => {
      if (w.id === wheelId) {
        return {
          ...w,
          segments: w.segments.map(s => 
            s.id === segmentId ? { ...s, [field]: value } : s
          )
        };
      }
      return w;
    }));
  };

  const copyConsiderationsToWheel = (fromWheelId, toWheelId) => {
    const fromWheel = wheels.find(w => w.id === fromWheelId);
    if (!fromWheel) return;

    setWheels(wheels.map(w => {
      if (w.id === toWheelId) {
        const newSegments = fromWheel.segments.map((seg, index) => ({
          id: index + 1,
          name: seg.name,
          value: 5 // Default value for new wheel
        }));
        return { ...w, segments: newSegments };
      }
      return w;
    }));
  };

  // Export functions
  const exportToJSON = () => {
    try {
      const dataStr = JSON.stringify(wheels, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `decision-wheels-${Date.now()}.json`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('JSON export error:', error);
      alert('JSON export failed. Please try again.');
    }
  };

  const exportToSVG = () => {
    try {
      const wheelsContainer = document.querySelector('.wheels-container');
      if (!wheelsContainer) {
        alert('Cannot find wheels to export');
        return;
      }
      
      const svgs = wheelsContainer.querySelectorAll('svg');
      if (svgs.length === 0) {
        alert('No wheels found to export');
        return;
      }
      
      const svgData = Array.from(svgs).map(svg => new XMLSerializer().serializeToString(svg));
      
      const svgWidth = 440;
      const gap = 40;
      const padding = 40;
      const wheelsWidth = (svgWidth * svgs.length) + (gap * (svgs.length - 1)) + (padding * 2);
      const wheelsHeight = 480;
      
      // Calculate comparison bars dimensions
      const comparisonHeight = 200;
      const comparisonPadding = 40;
      const totalHeight = wheelsHeight + comparisonHeight + comparisonPadding;
      
      let combinedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${wheelsWidth}" height="${totalHeight}" viewBox="0 0 ${wheelsWidth} ${totalHeight}">
  <rect width="${wheelsWidth}" height="${totalHeight}" fill="white"/>`;
      
      // Add wheels
      svgData.forEach((data, index) => {
        const xOffset = padding + (index * (svgWidth + gap));
        const cleanedData = data.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
        combinedSVG += `<g transform="translate(${xOffset}, ${padding})">${cleanedData}</g>`;
      });
      
      // Add comparison bars
      const comparisonY = wheelsHeight + comparisonPadding;
      const barWidth = wheelsWidth - (padding * 2);
      const barHeight = 40;
      const barGap = 20;
      
      // Add title
      combinedSVG += `<text x="${wheelsWidth / 2}" y="${comparisonY}" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">Overall Comparison</text>`;
      
      wheels.forEach((wheel, index) => {
        const avg = parseFloat(calculateAverage(wheel));
        const percentage = (avg / 10) * 100;
        const barY = comparisonY + 40 + (index * (barHeight + barGap));
        
        // Wheel name and score
        combinedSVG += `<text x="${padding}" y="${barY + 15}" font-size="14" font-weight="600" fill="#374151">${wheel.name}</text>`;
        combinedSVG += `<text x="${wheelsWidth - padding}" y="${barY + 15}" text-anchor="end" font-size="16" font-weight="bold" fill="#111827">${avg} / 10</text>`;
        
        // Background bar
        combinedSVG += `<rect x="${padding}" y="${barY + 20}" width="${barWidth}" height="${barHeight}" rx="20" fill="#E5E7EB"/>`;
        
        // Filled bar
        const fillWidth = (barWidth * percentage) / 100;
        combinedSVG += `<rect x="${padding}" y="${barY + 20}" width="${fillWidth}" height="${barHeight}" rx="20" fill="${wheel.color}"/>`;
        
        // Percentage text
        if (fillWidth > 60) {
          combinedSVG += `<text x="${padding + fillWidth - 15}" y="${barY + 20 + (barHeight / 2) + 5}" text-anchor="end" font-size="12" font-weight="600" fill="white">${percentage.toFixed(0)}%</text>`;
        }
      });
      
      combinedSVG += '</svg>';
      
      const blob = new Blob([combinedSVG], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `decision-wheels-${Date.now()}.svg`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      console.log('SVG export completed');
    } catch (error) {
      console.error('SVG export error:', error);
      alert('SVG export failed: ' + error.message);
    }
  };

  const exportToWebP = async () => {
    try {
      console.log('Starting WebP export...');
      
      // Create SVG string with wheels and comparison
      const wheelsContainer = document.querySelector('.wheels-container');
      if (!wheelsContainer) {
        console.error('Cannot find wheels container');
        return;
      }
      
      const svgs = wheelsContainer.querySelectorAll('svg');
      if (svgs.length === 0) {
        console.error('No wheels found');
        return;
      }
      
      const svgWidth = 440;
      const gap = 40;
      const padding = 40;
      const wheelsWidth = (svgWidth * svgs.length) + (gap * (svgs.length - 1)) + (padding * 2);
      const wheelsHeight = 480;
      const comparisonHeight = 200;
      const comparisonPadding = 40;
      const totalHeight = wheelsHeight + comparisonHeight + comparisonPadding;
      
      // Build complete SVG with wheels and comparison
      let svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${wheelsWidth}" height="${totalHeight}" viewBox="0 0 ${wheelsWidth} ${totalHeight}">
        <rect width="${wheelsWidth}" height="${totalHeight}" fill="white"/>`;
      
      // Add wheels
      Array.from(svgs).forEach((svg, index) => {
        const xOffset = padding + (index * (svgWidth + gap));
        const svgData = new XMLSerializer().serializeToString(svg);
        const cleanedData = svgData.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
        svgString += `<g transform="translate(${xOffset}, ${padding})">${cleanedData}</g>`;
      });
      
      // Add comparison bars
      const comparisonY = wheelsHeight + comparisonPadding;
      const barWidth = wheelsWidth - (padding * 2);
      const barHeight = 40;
      const barGap = 20;
      
      svgString += `<text x="${wheelsWidth / 2}" y="${comparisonY}" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">Overall Comparison</text>`;
      
      wheels.forEach((wheel, index) => {
        const avg = parseFloat(calculateAverage(wheel));
        const percentage = (avg / 10) * 100;
        const barY = comparisonY + 40 + (index * (barHeight + barGap));
        
        svgString += `<text x="${padding}" y="${barY + 15}" font-size="14" font-weight="600" fill="#374151">${wheel.name}</text>`;
        svgString += `<text x="${wheelsWidth - padding}" y="${barY + 15}" text-anchor="end" font-size="16" font-weight="bold" fill="#111827">${avg} / 10</text>`;
        svgString += `<rect x="${padding}" y="${barY + 20}" width="${barWidth}" height="${barHeight}" rx="20" fill="#E5E7EB"/>`;
        
        const fillWidth = (barWidth * percentage) / 100;
        svgString += `<rect x="${padding}" y="${barY + 20}" width="${fillWidth}" height="${barHeight}" rx="20" fill="${wheel.color}"/>`;
        
        if (fillWidth > 60) {
          svgString += `<text x="${padding + fillWidth - 15}" y="${barY + 20 + (barHeight / 2) + 5}" text-anchor="end" font-size="12" font-weight="600" fill="white">${percentage.toFixed(0)}%</text>`;
        }
      });
      
      svgString += '</svg>';
      
      // Convert SVG to image using data URL
      const canvas = document.createElement('canvas');
      canvas.width = wheelsWidth * 2; // 2x for better quality
      canvas.height = totalHeight * 2;
      const ctx = canvas.getContext('2d');
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
            console.error('Failed to create WebP blob');
            return;
          }
          
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `decision-wheels-${Date.now()}.webp`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
          }, 100);
          console.log('WebP export completed');
        }, 'image/webp', 0.95);
      };
      
      img.onerror = (err) => {
        console.error('Image load error:', err);
        URL.revokeObjectURL(url);
        // Fallback: just download the SVG
        console.log('WebP export failed, SVG is still available');
      };
      
      img.src = url;
      
    } catch (error) {
      console.error('WebP export error:', error);
      console.log('WebP export failed, please use SVG export instead');
    }
  };

  const exportToPDF = async () => {
    // Simple PDF generation using canvas
    const container = document.querySelector('.export-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1440;
    canvas.height = 400;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const svgs = container.querySelectorAll('svg');
    const svgData = Array.from(svgs).map(svg => new XMLSerializer().serializeToString(svg));
    
    let xOffset = 0;
    for (const data of svgData) {
      const img = new Image();
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, xOffset, 20);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
      
      xOffset += 720;
    }
    
    // Convert canvas to PDF using a simple approach
    const imgData = canvas.toDataURL('image/png');
    const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 44 >>
stream
q
612 0 0 166 0 313 cm
/Im1 Do
Q
endstream
endobj
5 0 obj
<< /Type /XObject /Subtype /Image /Width 1440 /Height 400 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgData.length} >>
stream
${imgData}
endstream
endobj
xref
0 6
trailer
<< /Size 6 /Root 1 0 R >>
startxref
%%EOF`;
    
    // For a better PDF, we'll use a simpler approach - convert to data URL
    canvas.toBlob(async (blob) => {
      // Create a simple HTML page with the image for printing to PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Decision Wheels</title>
            <style>
              body { margin: 0; padding: 20px; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL('image/png')}" />
            <script>
              window.onload = () => {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  };

  const exportToExcalidraw = () => {
    try {
      const excalidrawElements = [];
      let elementId = 1000;
      
      wheels.forEach((wheel, wheelIndex) => {
        const baseX = wheelIndex * 500;
        const baseY = 50;
        const centerX = baseX + 200;
        const centerY = baseY + 200;
        const radius = 140;
        
        // Add title
        excalidrawElements.push({
          type: 'text',
          version: 1,
          versionNonce: elementId++,
          isDeleted: false,
          id: `text_${elementId++}`,
          fillStyle: 'solid',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 0,
          opacity: 100,
          angle: 0,
          x: centerX - 100,
          y: baseY - 30,
          strokeColor: '#1e1e1e',
          backgroundColor: 'transparent',
          width: 200,
          height: 35,
          seed: Math.floor(Math.random() * 1000000),
          groupIds: [],
          frameId: null,
          roundness: null,
          boundElements: [],
          updated: Date.now(),
          link: null,
          locked: false,
          fontSize: 20,
          fontFamily: 1,
          text: wheel.name,
          textAlign: 'center',
          verticalAlign: 'top',
          containerId: null,
          originalText: wheel.name,
          lineHeight: 1.25
        });
        
        const segmentCount = wheel.segments.length;
        const anglePerSegment = (2 * Math.PI) / segmentCount;
        
        // Draw outer circle
        excalidrawElements.push({
          type: 'ellipse',
          version: 1,
          versionNonce: elementId++,
          isDeleted: false,
          id: `circle_${elementId++}`,
          fillStyle: 'solid',
          strokeWidth: 2,
          strokeStyle: 'solid',
          roughness: 0,
          opacity: 100,
          angle: 0,
          x: centerX - radius,
          y: centerY - radius,
          strokeColor: '#e5e7eb',
          backgroundColor: 'transparent',
          width: radius * 2,
          height: radius * 2,
          seed: Math.floor(Math.random() * 1000000),
          groupIds: [],
          frameId: null,
          roundness: { type: 2 },
          boundElements: [],
          updated: Date.now(),
          link: null,
          locked: false
        });
        
        wheel.segments.forEach((segment, index) => {
          const startAngle = index * anglePerSegment - Math.PI / 2;
          const fillRadius = radius * (segment.value / 10);
          
          // Create segment line from center
          const endX = centerX + radius * Math.cos(startAngle);
          const endY = centerY + radius * Math.sin(startAngle);
          
          excalidrawElements.push({
            type: 'line',
            version: 1,
            versionNonce: elementId++,
            isDeleted: false,
            id: `line_${elementId++}`,
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            angle: 0,
            x: centerX,
            y: centerY,
            strokeColor: '#9ca3af',
            backgroundColor: 'transparent',
            width: Math.abs(endX - centerX),
            height: Math.abs(endY - centerY),
            seed: Math.floor(Math.random() * 1000000),
            groupIds: [],
            frameId: null,
            roundness: { type: 2 },
            boundElements: [],
            updated: Date.now(),
            link: null,
            locked: false,
            startBinding: null,
            endBinding: null,
            lastCommittedPoint: null,
            startArrowhead: null,
            endArrowhead: null,
            points: [[0, 0], [endX - centerX, endY - centerY]]
          });
          
          // Add label
          const labelAngle = (index + 0.5) * anglePerSegment - Math.PI / 2;
          const labelRadius = radius + 40;
          const labelX = centerX + labelRadius * Math.cos(labelAngle) - 50;
          const labelY = centerY + labelRadius * Math.sin(labelAngle) - 15;
          
          excalidrawElements.push({
            type: 'text',
            version: 1,
            versionNonce: elementId++,
            isDeleted: false,
            id: `label_${elementId++}`,
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            angle: 0,
            x: labelX,
            y: labelY,
            strokeColor: '#1e1e1e',
            backgroundColor: 'transparent',
            width: 100,
            height: 50,
            seed: Math.floor(Math.random() * 1000000),
            groupIds: [],
            frameId: null,
            roundness: null,
            boundElements: [],
            updated: Date.now(),
            link: null,
            locked: false,
            fontSize: 14,
            fontFamily: 1,
            text: `${segment.name}\n${segment.value}`,
            textAlign: 'center',
            verticalAlign: 'top',
            containerId: null,
            originalText: `${segment.name}\n${segment.value}`,
            lineHeight: 1.25
          });
        });
      });
      
      const excalidrawData = {
        type: 'excalidraw',
        version: 2,
        source: 'https://excalidraw.com',
        elements: excalidrawElements,
        appState: {
          gridSize: null,
          viewBackgroundColor: '#ffffff'
        },
        files: {}
      };
      
      const dataStr = JSON.stringify(excalidrawData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `decision-wheels-${Date.now()}.excalidraw`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excalidraw export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  const calculateAverage = (wheel) => {
    if (wheel.segments.length === 0) return 0;
    const sum = wheel.segments.reduce((acc, seg) => acc + seg.value, 0);
    return (sum / wheel.segments.length).toFixed(1);
  };

  const ComparisonBars = () => {
    const averages = wheels.map(wheel => ({
      wheel,
      avg: parseFloat(calculateAverage(wheel))
    }));
    
    // Check if all wheels have matching considerations
    const allConsiderations = wheels.map(w => 
      w.segments.map(s => s.name.toLowerCase().trim()).sort()
    );
    
    const considerationsMatch = allConsiderations.every((considerations, index) => {
      if (index === 0) return true;
      if (considerations.length !== allConsiderations[0].length) return false;
      return considerations.every((name, i) => name === allConsiderations[0][i]);
    });
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
          Overall Comparison
        </h2>
        
        {!considerationsMatch && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Note:</strong> The considerations don't match across all opportunities. This comparison is based on the average rating of each opportunity's own considerations, not a direct side-by-side comparison of the same factors.
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          {averages.map(({ wheel, avg }) => {
            const percentage = (avg / 10) * 100;
            
            return (
              <div key={wheel.id} className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm sm:text-base font-semibold text-gray-700">
                    {wheel.name}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 sm:h-10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: wheel.color
                    }}
                  >
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            {(() => {
              const sorted = [...averages].sort((a, b) => b.avg - a.avg);
              const highest = sorted[0];
              const secondHighest = sorted[1];
              
              if (highest.avg === secondHighest.avg) {
                return (
                  <p className="text-base sm:text-lg text-gray-700 font-bold">
                    Multiple opportunities are rated equally at the top
                  </p>
                );
              }
              
              return (
                <p className="text-base sm:text-lg text-gray-700">
                  <span className="font-bold" style={{ color: highest.wheel.color }}>
                    {highest.wheel.name}
                  </span>
                  {' '}scores highest at{' '}
                  <span className="font-bold">{highest.avg}</span>
                  {secondHighest && (
                    <>
                      {', '}
                      <span className="font-bold">{(highest.avg - secondHighest.avg).toFixed(1)}</span>
                      {' points ahead of '}
                      <span className="font-bold" style={{ color: secondHighest.wheel.color }}>
                        {secondHighest.wheel.name}
                      </span>
                    </>
                  )}
                </p>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  const CircleWheel = ({ wheel, onSegmentClick, selectedSegmentId }) => {
    const radius = 140;
    const centerX = 220;
    const centerY = 220;
    const segmentCount = wheel.segments.length;
    const anglePerSegment = (2 * Math.PI) / segmentCount;

    const createSegmentPath = (index, fillPercentage) => {
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;
      
      const innerRadius = 0;
      const outerRadius = radius * fillPercentage;

      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);

      // For filled segments, create a pie slice from center
      if (fillPercentage > 0) {
        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} Z`;
      }
      return '';
    };

    const getLabelPosition = (index) => {
      const angle = (index + 0.5) * anglePerSegment - Math.PI / 2;
      const labelRadius = radius + 30;
      return {
        x: centerX + labelRadius * Math.cos(angle),
        y: centerY + labelRadius * Math.sin(angle)
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
              onClick={() => onSegmentClick && onSegmentClick(wheel.id, segment.id)}
              className={onSegmentClick ? "cursor-pointer" : ""}
              style={{ transition: 'all 0.2s ease' }}
            >
              {/* Segment border */}
              <path
                d={createSegmentPath(index, 1)}
                fill="none"
                stroke={isSelected ? wheel.color : "#e5e7eb"}
                strokeWidth={isSelected ? "4" : "2"}
                className="transition-all duration-200"
              />
              
              {/* Filled portion */}
              <path
                d={createSegmentPath(index, fillPercentage)}
                fill={wheel.color}
                opacity={isSelected ? "1" : "0.8"}
                className="transition-all duration-200 hover:opacity-100"
              />
              
              {/* Dividing lines */}
              <line
                x1={centerX}
                y1={centerY}
                x2={centerX + radius * Math.cos(index * anglePerSegment - Math.PI / 2)}
                y2={centerY + radius * Math.sin(index * anglePerSegment - Math.PI / 2)}
                stroke="#9ca3af"
                strokeWidth="1"
              />
              
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                className={`text-sm font-medium ${isSelected ? 'fill-gray-900 font-bold' : 'fill-gray-700'} transition-all duration-200`}
                dominantBaseline="middle"
              >
                {segment.name}
              </text>
              
              {/* Value */}
              <text
                x={pos.x}
                y={pos.y + 16}
                textAnchor="middle"
                className={`text-xs ${isSelected ? 'fill-gray-700 font-bold' : 'fill-gray-500'} transition-all duration-200`}
                dominantBaseline="middle"
              >
                {segment.value}
              </text>
              
              {/* Selection indicator ring */}
              {isSelected && (
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius * fillPercentage + 5}
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
        
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill="white"
          stroke="#9ca3af"
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Decision Wheel Comparator
          </h1>
          {wheels.length < 3 && (
            <button
              onClick={addWheel}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center gap-2 text-sm"
            >
              <Plus size={18} />
              Add Opportunity
            </button>
          )}
        </div>
        
        {wheels.length === 3 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For best decision-making results, limit comparisons to your top 2-3 options to avoid decision paralysis.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
          <div className="wheels-container hidden">
            {wheels.map(wheel => (
              <CircleWheel key={wheel.id} wheel={wheel} />
            ))}
          </div>
          
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
                      className="text-xl sm:text-2xl font-bold text-gray-800 border-none outline-none w-full px-2 py-1 rounded cursor-text transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#fffbeb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      placeholder="Enter opportunity name"
                    />
                    <Edit2 
                      size={18} 
                      className="absolute right-2 top-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />
                  </div>
                  {wheels.length > 2 && (
                    <button
                      onClick={() => removeWheel(wheel.id)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Remove opportunity"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Wheel Color:</label>
                  <input
                    type="color"
                    value={wheel.color}
                    onChange={(e) => updateWheelColor(wheel.id, e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => copyConsiderationsToWheel(wheels[0].id, wheel.id)}
                      className="sm:ml-auto px-3 sm:px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2 text-xs sm:text-sm"
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
                    className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 rounded transition-all duration-300 ${
                      isSelected 
                        ? 'bg-blue-100 border-2 border-blue-400 shadow-lg scale-[1.02]' 
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <input
                      type="text"
                      value={segment.name}
                      onChange={(e) => updateSegment(wheel.id, segment.id, 'name', e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded text-sm transition-all ${
                        isSelected 
                          ? 'border-blue-400 ring-2 ring-blue-200' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Factor name"
                    />
                    {useNumberSelector ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <button
                            key={num}
                            onClick={() => updateSegment(wheel.id, segment.id, 'value', num)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded ${
                              segment.value === num
                                ? 'bg-blue-500 text-white font-bold'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={() => removeSegment(wheel.id, segment.id)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded"
                          disabled={wheel.segments.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={segment.value}
                          onChange={(e) => updateSegment(wheel.id, segment.id, 'value', parseInt(e.target.value))}
                          className="flex-1 sm:w-32"
                        />
                        <span className="text-sm font-medium text-gray-700 w-8 text-center">
                          {segment.value}
                        </span>
                        <button
                          onClick={() => removeSegment(wheel.id, segment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          disabled={wheel.segments.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  );
                })}
                
                <button
                  onClick={() => addSegment(wheel.id)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 mt-4 text-sm sm:text-base"
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
          <ComparisonBars />
        </div>
        
        {/* Export Section */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Export Options</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowPreview(true)}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center justify-center gap-1.5"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                onClick={() => {
                  console.log('Export button clicked, showing modal');
                  setShowExportMenu(true);
                }}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center justify-center gap-1.5"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Export Modal */}
        {showExportMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Export Format</h2>
                <button
                  onClick={() => setShowExportMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => { 
                    console.log('SVG export clicked');
                    exportToSVG(); 
                    setShowExportMenu(false); 
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="font-semibold text-gray-900">SVG Vector</div>
                  <div className="text-sm text-gray-600">Complete visual with comparison - works everywhere</div>
                </button>
                
                <button
                  onClick={() => { 
                    console.log('JSON export clicked');
                    exportToJSON(); 
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Export Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded"
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
                    <ComparisonBars />
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

export default DecisionWheel;
