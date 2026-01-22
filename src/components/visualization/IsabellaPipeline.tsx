import { useState, useEffect } from 'react';
import { Brain, Filter, GitBranch, Sparkles, BookOpen, Link2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PipelineStage {
  id: string;
  name: string;
  icon: typeof Brain;
  description: string;
  status: 'idle' | 'processing' | 'complete';
  processingTime?: number;
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'input', name: 'Input', icon: Brain, description: 'Normalización de entrada', status: 'idle' },
  { id: 'filter', name: 'Filter', icon: Filter, description: 'Clasificación emocional', status: 'idle' },
  { id: 'router', name: 'Router', icon: GitBranch, description: 'Enrutamiento a miniAIs', status: 'idle' },
  { id: 'synthesis', name: 'Synthesis', icon: Sparkles, description: 'Generación de respuesta', status: 'idle' },
  { id: 'bookpi', name: 'BookPI', icon: BookOpen, description: 'Registro cognitivo', status: 'idle' },
  { id: 'msr', name: 'MSR', icon: Link2, description: 'Anclaje blockchain', status: 'idle' },
];

interface IsabellaPipelineProps {
  className?: string;
  autoRun?: boolean;
  onComplete?: (result: { emotion: string; intent: string }) => void;
}

export function IsabellaPipeline({ className, autoRun = true, onComplete }: IsabellaPipelineProps) {
  const [stages, setStages] = useState(PIPELINE_STAGES);
  const [currentStage, setCurrentStage] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ emotion: string; intent: string } | null>(null);

  const runPipeline = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStage(0);
    setResult(null);
    setStages(PIPELINE_STAGES.map(s => ({ ...s, status: 'idle' })));
  };

  useEffect(() => {
    if (!isRunning || currentStage < 0) return;

    if (currentStage >= stages.length) {
      setIsRunning(false);
      const finalResult = {
        emotion: ['curiosity', 'joy', 'focus', 'calm'][Math.floor(Math.random() * 4)],
        intent: ['create', 'query', 'analyze', 'synthesize'][Math.floor(Math.random() * 4)],
      };
      setResult(finalResult);
      onComplete?.(finalResult);
      
      // Auto restart after delay
      if (autoRun) {
        setTimeout(() => {
          runPipeline();
        }, 3000);
      }
      return;
    }

    // Set current stage to processing
    setStages(prev => prev.map((s, i) => ({
      ...s,
      status: i === currentStage ? 'processing' : i < currentStage ? 'complete' : 'idle',
    })));

    // Move to next stage after delay
    const delay = 400 + Math.random() * 300;
    const timer = setTimeout(() => {
      setStages(prev => prev.map((s, i) => ({
        ...s,
        status: i <= currentStage ? 'complete' : 'idle',
        processingTime: i === currentStage ? delay : s.processingTime,
      })));
      setCurrentStage(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStage, isRunning, stages.length, autoRun, onComplete]);

  useEffect(() => {
    if (autoRun) {
      const timer = setTimeout(runPipeline, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoRun]);

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-layer-intelligence" />
          <h3 className="font-semibold text-foreground">Isabella Pipeline</h3>
        </div>
        
        <button
          onClick={runPipeline}
          disabled={isRunning}
          className={cn(
            'px-3 py-1 text-xs rounded-full transition-all',
            isRunning 
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary/20 text-primary hover:bg-primary/30'
          )}
        >
          {isRunning ? 'Procesando...' : 'Ejecutar'}
        </button>
      </div>

      {/* Pipeline visualization */}
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = stage.status === 'processing';
          const isComplete = stage.status === 'complete';
          
          return (
            <div key={stage.id} className="flex items-center gap-3">
              {/* Stage indicator */}
              <div className={cn(
                'relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                isActive && 'bg-layer-intelligence/30 animate-pulse',
                isComplete && 'bg-status-active/20',
                !isActive && !isComplete && 'bg-muted/30'
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive && 'text-layer-intelligence',
                  isComplete && 'text-status-active',
                  !isActive && !isComplete && 'text-muted-foreground'
                )} />
                
                {/* Processing ring */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg border-2 border-layer-intelligence animate-ping opacity-50" />
                )}
              </div>

              {/* Stage info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-sm font-medium',
                    isActive && 'text-layer-intelligence',
                    isComplete && 'text-status-active',
                    !isActive && !isComplete && 'text-muted-foreground'
                  )}>
                    {stage.name}
                  </span>
                  {stage.processingTime && isComplete && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {stage.processingTime.toFixed(0)}ms
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
              </div>

              {/* Connection arrow */}
              {index < stages.length - 1 && (
                <ArrowRight className={cn(
                  'w-4 h-4 transition-colors',
                  isComplete ? 'text-status-active' : 'text-muted-foreground/30'
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Result display */}
      {result && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-muted/30">
              <span className="text-muted-foreground">Emoción:</span>
              <p className="font-medium text-primary capitalize">{result.emotion}</p>
            </div>
            <div className="p-2 rounded bg-muted/30">
              <span className="text-muted-foreground">Intención:</span>
              <p className="font-medium text-secondary capitalize">{result.intent}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
