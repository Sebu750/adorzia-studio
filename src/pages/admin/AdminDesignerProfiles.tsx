import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Star, 
  StarOff, 
  Eye, 
  Search,
  RefreshCw 
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAdminDesignerProfiles } from "@/hooks/useAdminDesignerProfiles";

interface DesignerProfile {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  brand_name: string;
  category: string;
  status: string;
  role: string;
  is_approved: boolean;
  is_featured: boolean;
  approved_at?: string;
  approved_by?: string;
  featured_at?: string;
  featured_by?: string;
  created_at: string;
  last_login_at?: string;
}

const AdminDesignerProfiles = () => {
  const { profiles, loading: hookLoading, error, loadProfiles, updateProfileApproval, updateProfileFeatureStatus } = useAdminDesignerProfiles();
  const [filteredProfiles, setFilteredProfiles] = useState<DesignerProfile[]>(profiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Apply filters when search term or filters change
  useEffect(() => {
    let result = profiles;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(profile => 
        profile.name.toLowerCase().includes(term) ||
        profile.email.toLowerCase().includes(term) ||
        profile.brand_name.toLowerCase().includes(term) ||
        profile.bio?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'approved') {
        result = result.filter(profile => profile.is_approved);
      } else if (filterStatus === 'pending') {
        result = result.filter(profile => !profile.is_approved && profile.status !== 'rejected');
      } else if (filterStatus === 'rejected') {
        result = result.filter(profile => profile.status === 'rejected');
      }
    }

    // Apply featured filter
    if (filterFeatured !== 'all') {
      if (filterFeatured === 'featured') {
        result = result.filter(profile => profile.is_featured);
      } else if (filterFeatured === 'not-featured') {
        result = result.filter(profile => !profile.is_featured);
      }
    }

    setFilteredProfiles(result);
  }, [profiles, searchTerm, filterStatus, filterFeatured]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfiles();
    setRefreshing(false);
  };

  const handleProfileAction = async (userId: string, action: 'approve' | 'unapprove' | 'feature' | 'unfeature') => {
    try {
      if (action === 'approve' || action === 'unapprove') {
        await updateProfileApproval(userId, action === 'approve');
      } else {
        await updateProfileFeatureStatus(userId, action === 'feature');
      }
    } catch (error: any) {
      alert(`Error ${action}ing profile: ${error.message}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Designer Profiles</h1>
            <p className="text-sm text-muted-foreground">
              Manage designer profiles for the marketplace
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search designers..."
                  className="pl-8 w-full px-3 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-3 py-2 border rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              className="px-3 py-2 border rounded-md"
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value as any)}
            >
              <option value="all">All Featured</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </CardContent>
        </Card>

        {/* Profiles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Designer Profiles ({filteredProfiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive">
                <p>Error loading profiles: {error}</p>
                <Button variant="destructive" size="sm" onClick={loadProfiles} className="mt-2">
                  Retry
                </Button>
              </div>
            )}
            {hookLoading ? (
              <div className="flex items-center justify-center h-32">
                <p>Loading profiles...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-muted-foreground">No profiles found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Designer</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Approval</th>
                      <th className="text-left py-3 px-4">Featured</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((profile) => (
                      <tr key={profile.user_id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={profile.avatar_url || '/placeholder-avatar.jpg'} 
                              alt={profile.name} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{profile.name}</div>
                              <div className="text-sm text-muted-foreground">{profile.email}</div>
                              <div className="text-xs text-muted-foreground">{profile.brand_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={
                              profile.status === 'active' ? 'default' : 
                              profile.status === 'pending_approval' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {profile.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {profile.is_approved ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>Approved on {formatDate(profile.approved_at)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span>Pending</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {profile.is_featured ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>Featured</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <StarOff className="h-4 w-4 text-gray-400" />
                              <span>Not Featured</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {!profile.is_approved ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleProfileAction(profile.user_id, 'approve')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleProfileAction(profile.user_id, 'unapprove')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Unapprove
                              </Button>
                            )}
                            
                            {!profile.is_featured ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleProfileAction(profile.user_id, 'feature')}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Feature
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleProfileAction(profile.user_id, 'unfeature')}
                              >
                                <StarOff className="h-4 w-4 mr-2" />
                                Unfeature
                              </Button>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => window.open(`/shop/designer/${profile.user_id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDesignerProfiles;