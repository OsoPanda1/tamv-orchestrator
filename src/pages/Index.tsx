import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { RepositoriesView } from '@/components/views/RepositoriesView';
import { TasksView } from '@/components/views/TasksView';
import { DeploymentsView } from '@/components/views/DeploymentsView';
import { SettingsView } from '@/components/views/SettingsView';
import { LayerDetailView } from '@/components/views/LayerDetailView';
import { LayerId, TAMV_LAYERS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useModules, getLayerProgress } from '@/hooks/useDatabase';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeLayer, setActiveLayer] = useState<LayerId | null>(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: modules } = useModules();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLayerClick = (layer: LayerId) => {
    setActiveLayer(layer);
    setActiveView('layer');
  };

  const handleBackFromLayer = () => {
    setActiveLayer(null);
    setActiveView('dashboard');
  };

  // Calculate layer progress for sidebar
  const layerProgress: Record<LayerId, number> = {} as Record<LayerId, number>;
  TAMV_LAYERS.forEach(layer => {
    layerProgress[layer.id] = modules ? getLayerProgress(modules, layer.id) : 0;
  });

  const renderView = () => {
    if (activeView === 'layer' && activeLayer) {
      return (
        <LayerDetailView 
          layerId={activeLayer} 
          onBack={handleBackFromLayer}
          user={user}
          onLogout={signOut}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView onLayerClick={handleLayerClick} user={user} onLogout={signOut} />;
      case 'repositories':
        return <RepositoriesView user={user} onLogout={signOut} />;
      case 'tasks':
        return <TasksView user={user} onLogout={signOut} />;
      case 'deployments':
        return <DeploymentsView user={user} onLogout={signOut} />;
      case 'settings':
        return <SettingsView user={user} onLogout={signOut} />;
      default:
        return <DashboardView onLayerClick={handleLayerClick} user={user} onLogout={signOut} />;
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        layerProgress={layerProgress}
      />
      <main className="lg:ml-64 transition-all duration-300">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
