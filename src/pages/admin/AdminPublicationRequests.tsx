import React from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminPublicationReview from '../../components/projects/AdminPublicationReview';

const AdminPublicationRequests: React.FC = () => {
  const { adminUser } = useAdminAuth();

  if (!adminUser) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>Please log in as an admin to review publication requests.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Publication Requests</h1>
          <p className="mt-2 text-gray-600">
            Review designer submissions for marketplace publication
          </p>
        </div>
      </div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AdminPublicationReview adminId={adminUser.id} />
        </div>
      </main>
    </div>
  );
};

export default AdminPublicationRequests;