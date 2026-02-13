import React, { useState, useEffect } from 'react';
import { Project, ProjectAsset, PublicationRequest } from '../../lib/dual-layer-types';
import { supabase } from '../../integrations/supabase/client';

interface DesignerProjectManagerProps {
  designerId: string;
}

const DesignerProjectManager: React.FC<DesignerProjectManagerProps> = ({ designerId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [requests, setRequests] = useState<PublicationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    thumbnail_url: '',
    project_type: 'design',
    visibility: 'private'
  });

  // Load designer projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('designer_id', designerId)
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);

        // Fetch publication requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('publication_requests')
          .select('*')
          .eq('designer_id', designerId)
          .order('submitted_at', { ascending: false });

        if (requestsError) throw requestsError;
        setRequests(requestsData || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [designerId]);

  // Load assets for selected project
  useEffect(() => {
    if (!selectedProject) {
      setAssets([]);
      return;
    }

    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from('project_assets')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('display_order');

      if (error) {
        console.error('Error fetching assets:', error);
      } else {
        setAssets(data || []);
      }
    };

    fetchAssets();
  }, [selectedProject]);

  const handleCreateProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...newProject,
          designer_id: designerId,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setNewProject({
        title: '',
        description: '',
        category: '',
        tags: [],
        thumbnail_url: '',
        project_type: 'design',
        visibility: 'private'
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleSubmitForPublication = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      const { data, error } = await supabase
        .from('publication_requests')
        .insert([{
          project_id: projectId,
          designer_id: designerId,
          request_title: `${project.title} Publication Request`,
          request_description: `Request to publish project "${project.title}" to marketplace`,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      setRequests(prev => [data, ...prev]);
      
      // Update the local project status to show it's been submitted
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status: 'submitted' } : p
      ));
    } catch (error) {
      console.error('Error submitting for publication:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading projects...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project Manager</h1>
      
      {/* Create New Project Form */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Project title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={newProject.category}
              onChange={(e) => setNewProject({...newProject, category: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Project category"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Project description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={newProject.project_type}
              onChange={(e) => setNewProject({...newProject, project_type: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="design">Design</option>
              <option value="article">Article</option>
              <option value="concept">Concept</option>
              <option value="portfolio">Portfolio</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Visibility</label>
            <select
              value={newProject.visibility}
              onChange={(e) => setNewProject({...newProject, visibility: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="private">Private</option>
              <option value="portfolio">Portfolio</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleCreateProject}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>

      {/* Projects List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet. Create your first project!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div 
                key={project.id} 
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedProject?.id === project.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-600 truncate">{project.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded">{project.status}</span>
                  <span className="text-xs text-gray-500">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-3">
                  {project.status === 'draft' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmitForPublication(project.id);
                      }}
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Submit for Publication
                    </button>
                  )}
                  {project.status === 'submitted' && (
                    <span className="text-sm text-yellow-600">Submitted</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Project Details: {selectedProject.title}</h2>
          
          {/* Project Info */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Category:</strong> {selectedProject.category || 'N/A'}
              </div>
              <div>
                <strong>Type:</strong> {selectedProject.project_type}
              </div>
              <div>
                <strong>Status:</strong> {selectedProject.status}
              </div>
              <div>
                <strong>Visibility:</strong> {selectedProject.visibility}
              </div>
            </div>
            <div className="mb-4">
              <strong>Description:</strong>
              <p>{selectedProject.description}</p>
            </div>
            {selectedProject.thumbnail_url && (
              <div className="mb-4">
                <strong>Thumbnail:</strong>
                <img 
                  src={selectedProject.thumbnail_url} 
                  alt={selectedProject.title} 
                  className="mt-2 h-32 object-contain"
                />
              </div>
            )}
          </div>

          {/* Project Assets */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Assets</h3>
            {assets.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} className="border rounded p-2">
                    <div className="text-sm truncate">{asset.file_name}</div>
                    <div className="text-xs text-gray-500">{asset.asset_category || 'N/A'}</div>
                    <a 
                      href={asset.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No assets uploaded for this project.</p>
            )}
          </div>
        </div>
      )}

      {/* Publication Requests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Publication Requests</h2>
        {requests.length === 0 ? (
          <p>No publication requests submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{request.request_title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.status === 'approved' ? 'bg-green-200 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    request.status === 'under_review' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{request.request_description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Submitted: {new Date(request.submitted_at).toLocaleDateString()}
                  {request.reviewed_at && ` | Reviewed: ${new Date(request.reviewed_at).toLocaleDateString()}`}
                </div>
                {request.admin_notes && (
                  <div className="mt-2 p-2 bg-gray-100 rounded">
                    <strong>Admin Notes:</strong> {request.admin_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerProjectManager;