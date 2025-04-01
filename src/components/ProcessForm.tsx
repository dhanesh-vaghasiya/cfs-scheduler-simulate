
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProcessData } from '@/types';

interface ProcessFormProps {
  onAddProcess: (process: ProcessData) => void;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ onAddProcess }) => {
  const [name, setName] = useState('');
  const [burstTime, setBurstTime] = useState(5);
  const [priority, setPriority] = useState(0);
  const [arrivalTime, setArrivalTime] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProcess: ProcessData = {
      id: Date.now().toString(),
      name: name || `P${Math.floor(Math.random() * 1000)}`,
      burstTime,
      priority,
      arrivalTime,
      remainingTime: burstTime,
      vruntime: 0,
      color: generateRandomColor(),
      state: 'ready',
      executionHistory: [],
    };
    
    onAddProcess(newProcess);
    setName('');
    setBurstTime(5);
    setPriority(0);
    setArrivalTime(0);
  };

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Process</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Process Name</Label>
            <Input
              id="name"
              placeholder="Process name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="burstTime">Burst Time (ms)</Label>
            <Input
              id="burstTime"
              type="number"
              min="1"
              value={burstTime}
              onChange={(e) => setBurstTime(Number(e.target.value))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Nice Value (-20 to 19)</Label>
            <Input
              id="priority"
              type="number"
              min="-20"
              max="19"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Lower values have higher priority (-20 is highest, 19 is lowest)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">Arrival Time (ms)</Label>
            <Input
              id="arrivalTime"
              type="number"
              min="0"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(Number(e.target.value))}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">Add Process</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProcessForm;
