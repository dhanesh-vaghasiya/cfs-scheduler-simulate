
export interface ExecutionInterval {
  startTime: number;
  endTime: number;
}

export interface ProcessData {
  id: string;
  name: string;
  burstTime: number;
  priority: number; // Nice value: -20 (highest) to 19 (lowest)
  arrivalTime: number;
  remainingTime: number;
  vruntime: number;
  color: string;
  state: 'ready' | 'running' | 'completed' | 'waiting';
  executionHistory: ExecutionInterval[];
}
