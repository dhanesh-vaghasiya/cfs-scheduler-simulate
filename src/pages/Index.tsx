
import CFSSimulator from '@/components/CFSSimulator';

const Index = () => {
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">CFS Scheduler Simulator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize how the Linux Completely Fair Scheduler works. Add processes with different priorities (nice values) 
          and burst times to see how the scheduler allocates CPU time fairly using virtual runtime.
        </p>
      </div>
      
      <CFSSimulator />
      
      <div className="mt-10 text-sm text-muted-foreground border-t pt-4">
        <h3 className="font-medium text-base mb-2">About the CFS Scheduler</h3>
        <p className="mb-2">
          The Completely Fair Scheduler (CFS) is the default CPU scheduler in the Linux kernel. 
          It uses a red-black tree to track virtual runtime (vruntime) of processes. The process with the 
          smallest vruntime is selected to run next, ensuring that all processes get a fair share of CPU time.
        </p>
        <p>
          The nice value (-20 to 19) affects the weight of a process, where lower nice values receive more CPU time.
          In this simulation, a process's vruntime increases more slowly if it has a higher priority (lower nice value).
        </p>
      </div>
    </div>
  );
};

export default Index;
