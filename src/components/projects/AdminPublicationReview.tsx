import React, { useState, useEffect } from 'react';
import { PublicationRequest, Project, ProjectAsset } from '../../lib/dual-layer-types';
import { supabase } from '../../integrations/supabase/client';

interface AdminPublicationReviewProps {
  adminId: string;
}

const AdminPublicationReview: React.FC<AdminPublicationReviewProps> = ({ adminId }) => {
  const [pendingRequests, setPendingRequests] = useState<PublicationRequest[]>([]);
  const [allRequests, setAllRequests] = useState<PublicationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PublicationRequest | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectAssets, setProjectAssets] = useState<ProjectAsset[]>([]);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  // Load publication requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all publication requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('publication_requests')
          .select(`
            *,
            projects!publication_requests_project_id_fkey(
              id, title, description, designer_id, category, tags, thumbnail_url, project_type, metadata, status, visibility, created_at
            )
          `)
          .order('submitted_at', { ascending: false });

        if (requestsError) throw requestsError;

        const requestsWithProjects = requestsData.map(req => ({
          ...req,
          project: req.projects
        }));

        setAllRequests(requestsWithProjects as any);
        
        // Filter pending requests
        const pending = requestsWithProjects.filter(
          (req: any) => req.status === 'pending'
        );
        setPendingRequests(pending);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching publication requests:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load project and assets when a request is selected
  useEffect(() => {
    if (!selectedRequest) {
      setSelectedProject(null);
      setProjectAssets([]);
      return;
    }

    // The project is already included in the selectedRequest from the fetch
    if ((selectedRequest as any).project) {
      setSelectedProject((selectedRequest as any).project);
      
      // Load project assets
      const loadAssets = async () => {
        const { data, error } = await supabase
          .from('project_assets')
          .select('*')
          .eq('project_id', selectedRequest.project_id)
          .order('display_order');

        if (error) {
          console.error('Error loading assets:', error);
        } else {
          setProjectAssets(data || []);
        }
      };

      loadAssets();
    }
  }, [selectedRequest]);

  const handleReview = async (requestId: string, status: 'approved' | 'rejected' | 'under_review', notes?: string) => {
    try {
      const { error } = await supabase
        .from('publication_requests')
        .update({
          status,
          admin_notes: notes || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      setAllRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status, admin_notes: notes || null, reviewed_at: new Date().toISOString(), reviewed_by: adminId } 
            : req
        )
      );

      setPendingRequests(prev => prev.filter(req => req.id !== requestId));

      // If approved, create marketplace product
      if (status === 'approved') {
        await convertToProduct(requestId);
      }

      // Clear selection if we just reviewed the selected request
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error reviewing request:', error);
    }
  };

  const convertToProduct = async (requestId: string) => {
    try {
      // First, get the full request with project data
      const { data: requestData, error: requestError } = await supabase
        .from('publication_requests')
        .select(`
          *,
          projects!publication_requests_project_id_fkey(*)
        `)
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      const request = requestData as any;
      const project = request.projects;

      // Create a marketplace product from the project data
      const { data: productData, error: productError } = await supabase
        .from('marketplace_products')
        .insert([{
          title: project.title,
          description: project.description || '',
          designer_id: project.designer_id,
          price: 0, // Admin sets price later
          inventory_count: 0, // Admin manages inventory
          status: 'draft', // Admin publishes when ready
          // Map inspiration details from project metadata
          images: project.metadata?.images || [],
          tags: project.tags || [],
          // Link back to the original publication request
          portfolio_publication_id: request.id // This might be a new field we need to add
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Update the request to link to the created product
      await supabase
        .from('publication_requests')
        .update({
          marketplace_conversion_id: productData.id
        })
        .eq('id', requestId);

      console.log(`Converted request ${requestId} to product ${productData.id}`);
    } catch (error) {
      console.error('Error converting to product:', error);
    }
  };

  const handleApprove = (requestId: string) => {
    handleReview(requestId, 'approved', adminNotes);
    setAdminNotes('');
  };

  const handleReject = (requestId: string) => {
    handleReview(requestId, 'rejected', adminNotes);
    setAdminNotes('');
  };

  const handleRequestReview = (requestId: string) => {
    handleReview(requestId, 'under_review', adminNotes);
    setAdminNotes('');
  };

  if (loading) {
    return <div className="p-6">Loading publication requests...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Publication Request Review</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingRequests.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'all'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Requests ({allRequests.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">
            {activeTab === 'pending' ? 'Pending Requests' : 'All Requests'}
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(activeTab === 'pending' ? pendingRequests : allRequests).map(request => {
              const project = (request as any).project;
              return (
                <div
                  key={request.id}
                  className={`border rounded-lg p-3 cursor-pointer ${
                    selectedRequest?.id === request.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{request.request_title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        request.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : request.status === 'approved'
                          ? 'bg-green-200 text-green-800'
                          : request.status === 'rejected'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    Project: {project?.title || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    By: {request.designer_id} | {new Date(request.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Request Details Panel */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <div className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedRequest.request_title}</h2>
                  <p className="text-gray-600">{selectedRequest.request_description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedRequest.status === 'pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : selectedRequest.status === 'approved'
                      ? 'bg-green-200 text-green-800'
                      : selectedRequest.status === 'rejected'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-blue-200 text-blue-800'
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>

              {selectedProject && (
                <>
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <strong>Title:</strong> {selectedProject.title}
                      </div>
                      <div>
                        <strong>Category:</strong> {selectedProject.category || 'N/A'}
                      </div>
                      <div>
                        <strong>Type:</strong> {selectedProject.project_type}
                      </div>
                      <div>
                        <strong>Visibility:</strong> {selectedProject.visibility}
                      </div>
                      <div className="md:col-span-2">
                        <strong>Description:</strong>
                        <p className="text-sm">{selectedProject.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Assets */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Project Assets</h3>
                    {projectAssets.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {projectAssets.map(asset => (
                          <div key={asset.id} className="border rounded p-2">
                            <div className="text-xs truncate">{asset.file_name}</div>
                            <div className="text-xs text-gray-500">{asset.asset_category || 'N/A'}</div>
                            <a
                              href={asset.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline block mt-1"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No assets uploaded for this project.</p>
                    )}
                  </div>
                </>
              )}

              {/* Review Actions */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Review Decision</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Enter notes for the designer..."
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={selectedRequest.status !== 'pending'}
                    className={`px-4 py-2 rounded ${
                      selectedRequest.status === 'pending'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Approve for Marketplace
                  </button>
                  
                  <button
                    onClick={() => handleRequestReview(selectedRequest.id)}
                    disabled={selectedRequest.status !== 'pending'}
                    className={`px-4 py-2 rounded ${
                      selectedRequest.status === 'pending'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Request Review
                  </button>
                  
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={selectedRequest.status !== 'pending'}
                    className={`px-4 py-2 rounded ${
                      selectedRequest.status === 'pending'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Reject Request
                  </button>
                </div>

                {selectedRequest.marketplace_conversion_id && (
                  <div className="mt-4 p-3 bg-green-100 rounded text-green-800">
                    ✅ Converted to marketplace product: {selectedRequest.marketplace_conversion_id}
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p><strong>Submitted:</strong> {new Date(selectedRequest.submitted_at).toLocaleString()}</p>
                {selectedRequest.reviewed_at && (
                  <p>
                    <strong>Reviewed:</strong> {new Date(selectedRequest.reviewed_at).toLocaleString()} by {selectedRequest.reviewed_by}
                  </p>
                )}
                {selectedRequest.admin_notes && (
                  <p><strong>Notes:</strong> {selectedRequest.admin_notes}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-500">Select a publication request to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPublicationReview;