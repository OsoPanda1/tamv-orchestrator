import { Settings, Key, Database, Globe, Shield, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@supabase/supabase-js';

interface SettingsViewProps {
  user?: User | null;
  onLogout?: () => void;
}

export function SettingsView({ user, onLogout }: SettingsViewProps) {
  const envVars = [
    { key: 'SUPABASE_URL', value: '••••••••••••', environment: 'all' },
    { key: 'SUPABASE_KEY', value: '••••••••••••', environment: 'all' },
    { key: 'MSR_RPC', value: '••••••••••••', environment: 'production' },
    { key: 'JWT_SECRET', value: '••••••••••••', environment: 'all' },
    { key: 'ISABELLA_KEY', value: '••••••••••••', environment: 'production' },
  ];

  return (
    <div className="min-h-screen">
      <Header 
        title="Configuración" 
        subtitle="Variables de entorno y ajustes del sistema"
        user={user}
        onLogout={onLogout}
      />

      <main className="p-4 lg:p-6 space-y-6 max-w-4xl">
        {/* Environment Variables */}
        <div className="glass-panel p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Variables de Entorno</h3>
          </div>

          <div className="space-y-3">
            {envVars.map((variable) => (
              <div 
                key={variable.key}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="flex-1">
                  <code className="text-sm font-mono text-primary">{variable.key}</code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Entorno: {variable.environment}
                  </p>
                </div>
                <Input 
                  type="password"
                  value={variable.value}
                  readOnly
                  className="sm:max-w-xs font-mono command-input"
                />
                <Button variant="ghost" size="sm" className="self-start sm:self-center">Editar</Button>
              </div>
            ))}
          </div>

          <Button className="mt-4 gap-2">
            <Key className="w-4 h-4" />
            Agregar Variable
          </Button>
        </div>

        {/* Database */}
        <div className="glass-panel p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Base de Datos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="text-lg font-medium text-foreground">Lovable Cloud</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Estado</p>
              <div className="flex items-center gap-2">
                <span className="pulse-dot bg-status-active" />
                <p className="text-lg font-medium text-status-active">Conectado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="glass-panel p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Integraciones</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-foreground/10 flex items-center justify-center">
                  <span className="text-sm">GH</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">GitHub</p>
                  <p className="text-xs text-muted-foreground">OsoPanda1</p>
                </div>
              </div>
              <span className="text-xs text-status-active">Conectado</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-foreground/10 flex items-center justify-center">
                  <span className="text-sm">K8</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Kubernetes</p>
                  <p className="text-xs text-muted-foreground">Cluster principal</p>
                </div>
              </div>
              <span className="text-xs text-status-pending">Pendiente</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
