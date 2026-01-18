import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { RepositoriesView } from '@/components/views/RepositoriesView';
import { TasksView } from '@/components/views/TasksView';
import { DeploymentsView } from '@/components/views/DeploymentsView';
import { SettingsView } from '@/components/views/SettingsView';
import { LayerDetailView } from '@/components/views/LayerDetailView';
import { LayerId } from '@/lib/constants';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeLayer, setActiveLayer] = useState<LayerId | null>(null);

  const handleLayerClick = (layer: LayerId) => {
    setActiveLayer(layer);
    setActiveView('layer');
  };

  const handleBackFromLayer = () => {
    setActiveLayer(null);
    setActiveView('dashboard');
  };

  const renderView = () => {
    if (activeView === 'layer' && activeLayer) {
      return (
        <LayerDetailView 
          layerId={activeLayer} 
          onBack={handleBackFromLayer}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView onLayerClick={handleLayerClick} />;
      case 'repositories':
        return <RepositoriesView />;
      case 'tasks':
        return <TasksView />;
      case 'deployments':
        return <DeploymentsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onLayerClick={handleLayerClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
      />
      <main className="ml-64 transition-all duration-300">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
