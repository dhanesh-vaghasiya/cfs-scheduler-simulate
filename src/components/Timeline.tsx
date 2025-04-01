
import React from 'react';
import { cn } from '@/lib/utils';
import { ProcessData, ExecutionInterval } from '@/types';

interface TimelineProps {
  processes: ProcessData[];
  totalDuration: number;
  currentTime: number;
  timeQuantum: number;
}

const Timeline: React.FC<TimelineProps> = ({ 
  processes, 
  totalDuration, 
  currentTime,
  timeQuantum
}) => {
  // Combine all process execution intervals for the gantt chart
  const allIntervals = processes.flatMap(process => 
    process.executionHistory.map(interval => ({
      ...interval,
      processId: process.id,
      processName: process.name,
      color: process.color
    }))
  ).sort((a, b) => a.startTime - b.startTime);

  // Calculate timeline width
  const timelineWidth = Math.max(totalDuration, currentTime + 5);
  
  // Create time markers
  const timeMarkers = [];
  const markerInterval = timeQuantum;
  for (let i = 0; i <= timelineWidth; i += markerInterval) {
    timeMarkers.push(i);
  }

  return (
    <div className="border rounded-md p-4 bg-white">
      <h3 className="font-medium mb-2">Execution Timeline</h3>
      
      <div className="relative timeline-grid mb-6" style={{ height: '30px' }}>
        {/* Time markers */}
        {timeMarkers.map((time) => (
          <div 
            key={time} 
            className="absolute text-xs text-gray-500" 
            style={{ left: `${(time / timelineWidth) * 100}%` }}
          >
            <div className="h-2 w-px bg-gray-300 mx-auto mb-1"></div>
            {time}ms
          </div>
        ))}
        
        {/* Current time indicator */}
        <div 
          className="absolute h-full w-px bg-red-500 z-10" 
          style={{ 
            left: `${(currentTime / timelineWidth) * 100}%`,
            transition: 'left 0.3s ease' 
          }}
        >
          <div className="text-xs text-red-500 font-bold whitespace-nowrap">
            t = {currentTime}ms
          </div>
        </div>
      </div>
      
      {/* Gantt chart */}
      <div className="space-y-2 timeline-grid">
        {processes.map((process) => (
          <div key={process.id} className="relative h-10 rounded-md bg-gray-100">
            <div className="absolute left-0 top-0 h-full flex items-center pl-2 z-10">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: process.color }}
              ></div>
              <span className="text-sm font-medium mono">{process.name}</span>
            </div>
            
            {process.executionHistory.map((interval, idx) => (
              <div
                key={idx}
                className="absolute h-full rounded-md opacity-80"
                style={{
                  left: `${(interval.startTime / timelineWidth) * 100}%`,
                  width: `${((interval.endTime - interval.startTime) / timelineWidth) * 100}%`,
                  backgroundColor: process.color,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
