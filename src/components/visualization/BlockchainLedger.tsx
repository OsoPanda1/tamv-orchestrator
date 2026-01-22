import { useState, useEffect } from 'react';
import { Link2, Check, Clock, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Block {
  height: number;
  hash: string;
  prevHash: string;
  timestamp: number;
  transactions: number;
  validator: string;
  status: 'confirmed' | 'pending';
}

function generateHash(): string {
  return Array.from({ length: 8 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function generateBlock(height: number, prevHash: string): Block {
  return {
    height,
    hash: generateHash(),
    prevHash,
    timestamp: Date.now(),
    transactions: Math.floor(Math.random() * 50) + 1,
    validator: `node-${Math.floor(Math.random() * 7) + 1}`,
    status: Math.random() > 0.1 ? 'confirmed' : 'pending',
  };
}

export function BlockchainLedger({ className }: { className?: string }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Initialize with 5 blocks
    const initialBlocks: Block[] = [];
    let prevHash = '00000000';
    for (let i = 1; i <= 5; i++) {
      const block = generateBlock(i, prevHash);
      initialBlocks.push(block);
      prevHash = block.hash;
    }
    setBlocks(initialBlocks);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setBlocks(prev => {
        const lastBlock = prev[prev.length - 1];
        const newBlock = generateBlock(lastBlock.height + 1, lastBlock.hash);
        return [...prev.slice(-4), newBlock];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-layer-economy" />
          <h3 className="font-semibold text-foreground">MSR Blockchain</h3>
        </div>
        
        <button
          onClick={() => setIsLive(!isLive)}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors',
            isLive ? 'bg-status-active/20 text-status-active' : 'bg-muted text-muted-foreground'
          )}
        >
          <span className={cn('w-2 h-2 rounded-full', isLive ? 'bg-status-active animate-pulse' : 'bg-muted-foreground')} />
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Blockchain visualization */}
      <div className="relative">
        {/* Chain line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-layer-economy/30 to-transparent" />

        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div
              key={block.height}
              className={cn(
                'relative pl-12 transition-all duration-500',
                index === blocks.length - 1 && 'animate-slide-in'
              )}
              style={{
                opacity: 1 - (blocks.length - 1 - index) * 0.15,
              }}
            >
              {/* Block node */}
              <div className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center',
                block.status === 'confirmed' 
                  ? 'bg-status-active/20 border border-status-active' 
                  : 'bg-status-pending/20 border border-status-pending animate-pulse'
              )}>
                {block.status === 'confirmed' ? (
                  <Check className="w-2.5 h-2.5 text-status-active" />
                ) : (
                  <Clock className="w-2.5 h-2.5 text-status-pending" />
                )}
              </div>

              {/* Block content */}
              <div className={cn(
                'p-3 rounded-lg border transition-colors',
                block.status === 'confirmed'
                  ? 'bg-muted/30 border-border/50'
                  : 'bg-status-pending/5 border-status-pending/30'
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-layer-economy">
                      #{block.height}
                    </span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded',
                      block.status === 'confirmed'
                        ? 'bg-status-active/20 text-status-active'
                        : 'bg-status-pending/20 text-status-pending'
                    )}>
                      {block.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(block.timestamp)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono text-muted-foreground truncate">
                      {block.hash}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">{block.transactions} txs</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-muted-foreground/70">
                    prev: {block.prevHash.slice(0, 4)}...
                  </span>
                  <span className="text-muted-foreground/70">
                    {block.validator}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-muted-foreground">Altura</span>
          <p className="font-mono text-layer-economy">{blocks[blocks.length - 1]?.height || 0}</p>
        </div>
        <div>
          <span className="text-muted-foreground">TPS</span>
          <p className="font-mono text-primary">{(Math.random() * 100 + 50).toFixed(0)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Finalidad</span>
          <p className="font-mono text-status-active">~2s</p>
        </div>
      </div>
    </div>
  );
}
