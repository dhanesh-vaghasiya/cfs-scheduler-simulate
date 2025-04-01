
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from 'lucide-react';
import { ProcessData } from '@/types';

interface ProcessListProps {
  processes: ProcessData[];
  onRemoveProcess: (id: string) => void;
  currentTime: number;
}

const ProcessList: React.FC<ProcessListProps> = ({ 
  processes, 
  onRemoveProcess,
  currentTime
}) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'running': return 'bg-green-500';
      case 'ready': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'waiting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Burst Time</TableHead>
            <TableHead>Nice</TableHead>
            <TableHead>Arrival</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>vRuntime</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                No processes added yet
              </TableCell>
            </TableRow>
          ) : (
            processes.map((process) => {
              // Calculate weight based on nice value
              // In Linux, weight = 1024 / (1.25^nice)
              const weight = Math.floor(1024 / Math.pow(1.25, process.priority));
              
              // Calculate progress percentage
              const progress = ((process.burstTime - process.remainingTime) / process.burstTime) * 100;
              
              return (
                <TableRow key={process.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: process.color }}
                      ></div>
                      <span className="mono">{process.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="mono">{process.burstTime} ms</TableCell>
                  <TableCell className="mono">{process.priority}</TableCell>
                  <TableCell className="mono">{process.arrivalTime} ms</TableCell>
                  <TableCell className="mono">{weight}</TableCell>
                  <TableCell className="mono">
                    {process.vruntime.toFixed(2)} ms
                  </TableCell>
                  <TableCell>
                    <Badge className={getStateColor(process.state)}>
                      {process.state}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="process-bar h-2.5 rounded-full" 
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: process.color 
                        }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemoveProcess(process.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcessList;
