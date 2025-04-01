
import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProcessData } from '@/types';

interface StatisticsPanelProps {
  processes: ProcessData[];
  currentTime: number;
  activeProcess: ProcessData | null;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ 
  processes, 
  currentTime,
  activeProcess
}) => {
  // Calculate completed processes
  const completedProcesses = processes.filter(p => p.state === 'completed');
  
  // Calculate average turnaround time for completed processes
  const avgTurnaroundTime = completedProcesses.length > 0
    ? completedProcesses.reduce((sum, p) => {
        // Turnaround time = completion time - arrival time
        const completionTime = p.executionHistory.length > 0
          ? p.executionHistory[p.executionHistory.length - 1].endTime
          : 0;
        return sum + (completionTime - p.arrivalTime);
      }, 0) / completedProcesses.length
    : 0;
  
  // Calculate average waiting time for all processes
  const avgWaitingTime = processes.length > 0
    ? processes.reduce((sum, p) => {
        // Waiting time = (turnaround time - burst time)
        const completionTime = p.state === 'completed' && p.executionHistory.length > 0
          ? p.executionHistory[p.executionHistory.length - 1].endTime
          : currentTime;
        const turnaroundTime = completionTime - p.arrivalTime;
        const waitingTime = turnaroundTime - (p.burstTime - p.remainingTime);
        return sum + waitingTime;
      }, 0) / processes.length
    : 0;

  // Calculate CPU utilization
  const totalExecutionTime = processes.reduce((sum, p) => 
    sum + p.executionHistory.reduce((execSum, interval) => 
      execSum + (interval.endTime - interval.startTime), 0
    ), 0
  );
  
  const cpuUtilization = currentTime > 0 
    ? (totalExecutionTime / currentTime) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="border rounded p-2">
            <div className="text-sm text-muted-foreground">Current Time</div>
            <div className="text-xl font-bold mono">{currentTime} ms</div>
          </div>
          
          <div className="border rounded p-2">
            <div className="text-sm text-muted-foreground">Active Process</div>
            <div className="text-xl font-bold">
              {activeProcess ? (
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: activeProcess.color }}
                  ></div>
                  <span className="mono">{activeProcess.name}</span>
                </div>
              ) : "None"}
            </div>
          </div>
          
          <div className="border rounded p-2">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-xl font-bold mono">
              {completedProcesses.length}/{processes.length}
            </div>
          </div>
          
          <div className="border rounded p-2">
            <div className="text-sm text-muted-foreground">CPU Utilization</div>
            <div className="text-xl font-bold mono">
              {cpuUtilization.toFixed(1)}%
            </div>
          </div>
          
          <div className="border rounded p-2">
            <div className="text-sm text-muted-foreground">Avg. Turnaround</div>
            <div className="text-xl font-bold mono">
              {avgTurnaroundTime.toFixed(2)} ms
            </div>
          </div>
          
          <div className="border rounded p-2">
            <div className="text-sm text-muted-foreground">Avg. Waiting</div>
            <div className="text-xl font-bold mono">
              {avgWaitingTime.toFixed(2)} ms
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
