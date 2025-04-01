
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RefreshCw, 
  Timer
} from 'lucide-react';

interface SimulationControlsProps {
  isRunning: boolean;
  timeQuantum: number;
  simulationSpeed: number;
  onToggleRun: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onTimeQuantumChange: (value: number) => void;
  onSimulationSpeedChange: (value: number) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  timeQuantum,
  simulationSpeed,
  onToggleRun,
  onStepForward,
  onReset,
  onTimeQuantumChange,
  onSimulationSpeedChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={onToggleRun}
            className="flex-1"
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? <Pause className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
            {isRunning ? "Pause" : "Play"}
          </Button>
          
          <Button 
            onClick={onStepForward}
            variant="outline"
            disabled={isRunning}
          >
            <SkipForward className="mr-1 h-4 w-4" />
            Step
          </Button>
          
          <Button 
            onClick={onReset}
            variant="outline"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="timeQuantum" className="flex items-center">
              <Timer className="mr-1 h-4 w-4" />
              Time Quantum (ms)
            </Label>
          </div>
          <Input
            id="timeQuantum"
            type="number"
            min="1"
            value={timeQuantum}
            onChange={(e) => onTimeQuantumChange(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Maximum time a process can run before being preempted
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="simulationSpeed">Simulation Speed</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm">Slow</span>
            <Input
              id="simulationSpeed"
              type="range"
              min="1"
              max="10"
              value={simulationSpeed}
              onChange={(e) => onSimulationSpeedChange(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm">Fast</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
