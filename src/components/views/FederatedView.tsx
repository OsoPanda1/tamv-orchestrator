import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HolographicCard } from '@/components/visualization/HolographicCard';
import { FederationNetwork } from '@/components/visualization/FederationNetwork';
import { IsabellaPipeline } from '@/components/visualization/IsabellaPipeline';
import { BlockchainLedger } from '@/components/visualization/BlockchainLedger';
import { XRViewer } from '@/components/visualization/XRViewer';
import { IsabellaChat } from '@/components/ai/IsabellaChat';
import { QuantumOrb } from '@/components/visualization/QuantumOrb';
import { QUANTUM_CONFIG, FEDERATED_SERVICES } from '@/lib/quantum-config';
import { 
  Shield, Zap, Globe, Cpu, Activity, Lock,
  Layers, Radio, Database, Brain, Coins, Scale, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

const layerIcons = {
  identity: Shield,
  communication: Radio,
  information: Database,
  intelligence: Brain,
  economy: Coins,
  governance: Scale,
  documentation: FileText,
};

interface FederatedViewProps {
  user?: User | null;
  onLogout?: () => void;
}

export function FederatedView({ user, onLogout }: FederatedViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'xr' | 'blockchain'>('overview');

  return (
    <div className="min-h-screen">
      <Header 
        title="Sistema Federado TAMV" 
        subtitle="Arquitectura Quantum-Ready · 7 Nodos Activos"
        user={user}
        onLogout={onLogout}
      />

      <div className="p-4 lg:p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Visión General', icon: Layers },
            { id: 'ai', label: 'Isabella AI', icon: Brain },
            { id: 'xr', label: 'XR/3D/4D', icon: Globe },
            { id: 'blockchain', label: 'MSR Blockchain', icon: Coins },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Quantum Status */}
            <div className="lg:col-span-4">
              <HolographicCard className="h-full">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Estado Quantum</h3>
                  </div>

                  <div className="flex justify-center mb-4">
                    <QuantumOrb size="lg" intensity={1.2} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground text-xs">Cripto</span>
                      <p className="font-mono text-primary text-xs">
                        {QUANTUM_CONFIG.cryptography.hybrid.enabled ? 'Híbrido' : 'Clásico'}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground text-xs">Post-Quantum</span>
                      <p className="font-mono text-status-active text-xs">
                        {QUANTUM_CONFIG.cryptography.postQuantum.algorithm}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground text-xs">Nodos</span>
                      <p className="font-mono text-secondary text-xs">
                        {QUANTUM_CONFIG.federation.nodes} Activos
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <span className="text-muted-foreground text-xs">Consenso</span>
                      <p className="font-mono text-layer-intelligence text-xs">
                        {QUANTUM_CONFIG.federation.consensus}
                      </p>
                    </div>
                  </div>

                  {/* Security indicators */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs">
                      <Lock className="w-3 h-3 text-status-active" />
                      <span className="text-muted-foreground">Encriptación:</span>
                      <span className="text-status-active ml-auto">AES-256 + Kyber</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-2">
                      <Zap className="w-3 h-3 text-primary" />
                      <span className="text-muted-foreground">Latencia:</span>
                      <span className="text-primary ml-auto">~12ms</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-2">
                      <Activity className="w-3 h-3 text-secondary" />
                      <span className="text-muted-foreground">Throughput:</span>
                      <span className="text-secondary ml-auto">50k req/s</span>
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </div>

            {/* Federation Network */}
            <div className="lg:col-span-4">
              <HolographicCard className="h-full">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold">Red Federada</h3>
                  </div>
                  <FederationNetwork className="h-[350px]" />
                </div>
              </HolographicCard>
            </div>

            {/* Service Grid */}
            <div className="lg:col-span-4">
              <HolographicCard className="h-full">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-layer-intelligence" />
                    <h3 className="font-semibold">Servicios Federados</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {FEDERATED_SERVICES.map(service => {
                      const Icon = layerIcons[service.layer as keyof typeof layerIcons] || Cpu;
                      const isOnline = Math.random() > 0.1;
                      
                      return (
                        <div 
                          key={service.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                          <div className={cn(
                            'p-1.5 rounded',
                            `bg-layer-${service.layer}/20`
                          )}>
                            <Icon className={cn('w-4 h-4', `text-layer-${service.layer}`)} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{service.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>:{service.port}</span>
                              <span>•</span>
                              <span>{service.protocol}</span>
                              {service.quantum && (
                                <>
                                  <span>•</span>
                                  <span className="text-primary">Q</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            isOnline ? 'bg-status-active' : 'bg-status-error'
                          )} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </HolographicCard>
            </div>

            {/* Isabella Pipeline */}
            <div className="lg:col-span-6">
              <IsabellaPipeline />
            </div>

            {/* Blockchain Ledger */}
            <div className="lg:col-span-6">
              <BlockchainLedger />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HolographicCard className="min-h-[600px]">
              <IsabellaChat className="h-[600px]" />
            </HolographicCard>
            
            <div className="space-y-6">
              <IsabellaPipeline />
              
              <HolographicCard>
                <div className="p-4">
                  <h3 className="font-semibold mb-4">MiniAIs Activos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['ArchitectAI', 'FinanceAI', 'LegalAI', 'CreativeAI', 'OpsAI', 'SocialAI'].map(ai => (
                      <div key={ai} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{ai}</span>
                          <span className="w-2 h-2 rounded-full bg-status-active animate-pulse" />
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Load: {(Math.random() * 50 + 20).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HolographicCard>
            </div>
          </div>
        )}

        {activeTab === 'xr' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <XRViewer />
            
            <HolographicCard>
              <div className="p-4">
                <h3 className="font-semibold mb-4">Configuración Renderizado</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Motor</label>
                    <p className="font-mono text-primary">{QUANTUM_CONFIG.rendering.engine}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground">Modos Soportados</label>
                    <div className="flex gap-2 mt-1">
                      {QUANTUM_CONFIG.rendering.modes.map(mode => (
                        <span key={mode} className="px-2 py-1 bg-muted rounded text-xs">
                          {mode.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground">Resoluciones</label>
                    <div className="mt-1 space-y-1 text-xs">
                      {Object.entries(QUANTUM_CONFIG.rendering.resolution).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{key}</span>
                          <span className="font-mono">{value[0]}x{value[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm">Aceleración Quantum</span>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs',
                      QUANTUM_CONFIG.rendering.quantumAcceleration 
                        ? 'bg-status-active/20 text-status-active' 
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {QUANTUM_CONFIG.rendering.quantumAcceleration ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </div>
        )}

        {activeTab === 'blockchain' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BlockchainLedger />
            
            <HolographicCard>
              <div className="p-4">
                <h3 className="font-semibold mb-4">Economía MSR</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-layer-economy/10 border border-layer-economy/20">
                      <span className="text-xs text-muted-foreground">UTAMV Supply</span>
                      <p className="text-lg font-mono text-layer-economy">1,000,000</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-xs text-muted-foreground">MSR Staked</span>
                      <p className="text-lg font-mono text-primary">450,000</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-3">Distribución</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Creadores</span>
                        <span>50-75%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">TAMV</span>
                        <span>25-50%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-3">Neto (20/30/50)</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fénix</span>
                        <span className="text-secondary">20%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Infraestructura</span>
                        <span className="text-primary">30%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Ganancia</span>
                        <span className="text-status-active">50%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </div>
        )}
      </div>
    </div>
  );
}
