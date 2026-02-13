import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DesignerProjectManager from '../components/projects/DesignerProjectManager';
import { useDualLayer } from '../contexts/DualLayerContext';

const DesignerProjectsPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { loadDesignerProjects, loadDesignerPublicationRequests } = useDualLayer();

  // Load data when component mounts
  React.useEffect(() => {
    if (user?.id) {
      loadDesignerProjects(user.id);
      loadDesignerPublicationRequests(user.id);
    }
  }, [user?.id, loadDesignerProjects, loadDesignerPublicationRequests]);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>Please log in to access your projects.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Creative Projects</h1>
          <p className="mt-2 text-gray-600">
            Manage your design projects and submit them for marketplace consideration
          </p>
        </div>
      </div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <DesignerProjectManager designerId={user.id} />
        </div>
      </main>
    </div>
  );
};

export default DesignerProjectsPage;