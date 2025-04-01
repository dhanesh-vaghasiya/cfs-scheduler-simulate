
import React, { useState, useEffect, useRef } from 'react';
import ProcessForm from './ProcessForm';
import ProcessList from './ProcessList';
import Timeline from './Timeline';
import SimulationControls from './SimulationControls';
import StatisticsPanel from './StatisticsPanel';
import { ProcessData } from '@/types';

const CFSSimulator: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeQuantum, setTimeQuantum] = useState(5);
  const [simulationSpeed, setSimulationSpeed] = useState(5);
  const [activeProcess, setActiveProcess] = useState<ProcessData | null>(null);
  const [totalDuration, setTotalDuration] = useState(0);
  
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Initialize with some example processes
  useEffect(() => {
    const exampleProcesses: ProcessData[] = [
      {
        id: '1',
        name: 'P1',
        burstTime: 10,
        priority: 0, // nice value
        arrivalTime: 0,
        remainingTime: 10,
        vruntime: 0,
        color: 'hsl(200, 70%, 50%)',
        state: 'ready',
        executionHistory: [],
      },
      {
        id: '2',
        name: 'P2',
        burstTime: 5,
        priority: 10, // Lower priority (higher nice value)
        arrivalTime: 2,
        remainingTime: 5,
        vruntime: 0,
        color: 'hsl(120, 70%, 50%)',
        state: 'ready',
        executionHistory: [],
      },
      {
        id: '3',
        name: 'P3',
        burstTime: 8,
        priority: -5, // Higher priority (lower nice value)
        arrivalTime: 3,
        remainingTime: 8,
        vruntime: 0,
        color: 'hsl(320, 70%, 50%)',
        state: 'ready',
        executionHistory: [],
      },
    ];
    
    setProcesses(exampleProcesses);
    
    // Calculate initial total duration
    const initialTotalDuration = exampleProcesses.reduce(
      (max, p) => Math.max(max, p.arrivalTime + p.burstTime), 
      0
    );
    setTotalDuration(initialTotalDuration);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Update simulation
  const updateSimulation = (timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    // Calculate time delta based on simulation speed
    const delta = (timestamp - lastUpdateTimeRef.current) * (simulationSpeed / 5);
    
    if (delta >= 16) { // Approx 60fps max
      lastUpdateTimeRef.current = timestamp;
      
      // Move simulation forward by 1ms at a time
      setCurrentTime(prevTime => {
        const newTime = prevTime + 1;
        
        // Update processes
        setProcesses(prevProcesses => {
          const updatedProcesses = runCFSScheduler(prevProcesses, newTime);
          
          // Update active process
          const running = updatedProcesses.find(p => p.state === 'running');
          setActiveProcess(running || null);
          
          // Check if all processes are completed
          const allCompleted = updatedProcesses.every(
            p => p.state === 'completed' || newTime < p.arrivalTime
          );
          
          if (allCompleted && updatedProcesses.some(p => p.state === 'completed')) {
            setIsRunning(false);
          }
          
          return updatedProcesses;
        });
        
        return newTime;
      });
    }
    
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    }
  };
  
  // Effect for running simulation loop
  useEffect(() => {
    if (isRunning) {
      lastUpdateTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, simulationSpeed]);
  
  // CFS Scheduler implementation
  const runCFSScheduler = (currentProcesses: ProcessData[], time: number): ProcessData[] => {
    // Make a copy to avoid direct state mutation
    const updatedProcesses = [...currentProcesses];
    
    // Update process states based on arrival time
    updatedProcesses.forEach(process => {
      if (time === process.arrivalTime && process.state !== 'completed') {
        process.state = 'ready';
      }
    });
    
    // Check if any process is currently running
    const runningProcess = updatedProcesses.find(p => p.state === 'running');
    
    if (runningProcess) {
      // Calculate the weight based on nice value
      const weight = 1024 / Math.pow(1.25, runningProcess.priority);
      
      // Update remaining time and vruntime for running process
      runningProcess.remainingTime -= 1; // Reduce by 1ms
      runningProcess.vruntime += 1 / weight * 1000; // Convert to weighted time
      
      // Add to execution history
      if (runningProcess.executionHistory.length === 0 || 
          runningProcess.executionHistory[runningProcess.executionHistory.length - 1].endTime !== time) {
        runningProcess.executionHistory.push({
          startTime: time - 1,
          endTime: time
        });
      } else {
        // Extend the last execution interval
        runningProcess.executionHistory[runningProcess.executionHistory.length - 1].endTime = time;
      }
      
      // Check if process is completed
      if (runningProcess.remainingTime <= 0) {
        runningProcess.state = 'completed';
        runningProcess.remainingTime = 0;
        
        // Calculate new total duration if needed
        const lastEndTime = runningProcess.executionHistory[runningProcess.executionHistory.length - 1].endTime;
        setTotalDuration(prevDuration => Math.max(prevDuration, lastEndTime));
      } 
      // Check if time quantum is expired
      else if (
        runningProcess.executionHistory.length > 0 && 
        (time - runningProcess.executionHistory[runningProcess.executionHistory.length - 1].startTime) >= timeQuantum
      ) {
        runningProcess.state = 'ready';
      }
    }
    
    // Select next process using CFS logic
    if (!runningProcess || runningProcess.state !== 'running') {
      // Get all ready processes
      const readyProcesses = updatedProcesses.filter(
        p => p.state === 'ready' && p.arrivalTime <= time
      );
      
      if (readyProcesses.length > 0) {
        // Select process with minimum vruntime
        const nextProcess = readyProcesses.reduce(
          (min, p) => p.vruntime < min.vruntime ? p : min, 
          readyProcesses[0]
        );
        
        nextProcess.state = 'running';
      }
    }
    
    return updatedProcesses;
  };

  // Add a new process
  const handleAddProcess = (newProcess: ProcessData) => {
    setProcesses(prevProcesses => [...prevProcesses, newProcess]);
    
    // Update total duration if needed
    setTotalDuration(prevDuration => 
      Math.max(prevDuration, newProcess.arrivalTime + newProcess.burstTime)
    );
  };
  
  // Remove a process
  const handleRemoveProcess = (id: string) => {
    setProcesses(prevProcesses => prevProcesses.filter(p => p.id !== id));
    
    // Update active process
    if (activeProcess?.id === id) {
      setActiveProcess(null);
    }
  };
  
  // Toggle simulation running state
  const handleToggleRun = () => {
    setIsRunning(prev => !prev);
  };
  
  // Step forward in simulation
  const handleStepForward = () => {
    setCurrentTime(prevTime => {
      const newTime = prevTime + 1;
      
      // Update processes for this time step
      setProcesses(prevProcesses => {
        const updatedProcesses = runCFSScheduler(prevProcesses, newTime);
        
        // Update active process
        const running = updatedProcesses.find(p => p.state === 'running');
        setActiveProcess(running || null);
        
        return updatedProcesses;
      });
      
      return newTime;
    });
  };
  
  // Reset simulation
  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    
    // Reset all processes
    setProcesses(prevProcesses => 
      prevProcesses.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        vruntime: 0,
        state: 'ready',
        executionHistory: []
      }))
    );
    
    setActiveProcess(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <ProcessForm onAddProcess={handleAddProcess} />
        </div>
        
        <div>
          <SimulationControls 
            isRunning={isRunning}
            timeQuantum={timeQuantum}
            simulationSpeed={simulationSpeed}
            onToggleRun={handleToggleRun}
            onStepForward={handleStepForward}
            onReset={handleReset}
            onTimeQuantumChange={setTimeQuantum}
            onSimulationSpeedChange={setSimulationSpeed}
          />
        </div>
        
        <div>
          <StatisticsPanel 
            processes={processes}
            currentTime={currentTime}
            activeProcess={activeProcess}
          />
        </div>
      </div>
      
      <Timeline 
        processes={processes}
        totalDuration={totalDuration}
        currentTime={currentTime}
        timeQuantum={timeQuantum}
      />
      
      <ProcessList 
        processes={processes} 
        onRemoveProcess={handleRemoveProcess}
        currentTime={currentTime}
      />
    </div>
  );
};

export default CFSSimulator;
