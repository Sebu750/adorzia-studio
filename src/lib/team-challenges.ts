// Team Challenge Types and Helpers

export interface TeamRole {
  role_id: string;
  role_name: string;
  requirements: string[];
  deliverables: string[];
  badge: {
    name: string;
    icon: string;
    meaning: string;
  };
}

export interface TeamChallenge {
  is_team_challenge: true;
  team_size: number;
  minimum_team_rank_order: number;
  team_role_requirements: TeamRole[];
}

export interface TeamSubmissionStatus {
  status: 'forming' | 'in_progress' | 'submitted' | 'under_review' | 'completed' | 'failed';
  role_assignments: Record<string, string>; // role_id -> user_id
  role_submissions: Record<string, {
    files: string[];
    submitted_at: string;
    status: 'pending' | 'submitted' | 'approved' | 'revision_required';
  }>;
  deadline?: string;
  total_score?: number;
}

export interface RoleAssignment {
  role_id: string;
  role_name: string;
  user_id: string;
  user_name?: string;
  avatar_url?: string;
}

// Get role info by ID
export function getRoleById(roles: TeamRole[], roleId: string): TeamRole | undefined {
  return roles.find(r => r.role_id === roleId);
}

// Check if all roles are assigned
export function areAllRolesAssigned(
  roles: TeamRole[],
  assignments: Record<string, string>
): boolean {
  return roles.every(role => assignments[role.role_id]);
}

// Check if all role submissions are complete
export function areAllRolesSubmitted(
  roles: TeamRole[],
  submissions: Record<string, { status: string }>
): boolean {
  return roles.every(role => 
    submissions[role.role_id]?.status === 'submitted' || 
    submissions[role.role_id]?.status === 'approved'
  );
}

// Calculate team progress percentage
export function calculateTeamProgress(
  roles: TeamRole[],
  submissions: Record<string, { status: string }>
): number {
  if (!roles.length) return 0;
  const submittedCount = roles.filter(role => 
    submissions[role.role_id]?.status === 'submitted' || 
    submissions[role.role_id]?.status === 'approved'
  ).length;
  return Math.round((submittedCount / roles.length) * 100);
}

// Get remaining time string
export function getRemainingTime(deadline: string): {
  hours: number;
  minutes: number;
  isExpired: boolean;
  display: string;
} {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, isExpired: true, display: 'Expired' };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return { 
      hours, 
      minutes, 
      isExpired: false, 
      display: `${days}d ${hours % 24}h remaining` 
    };
  }
  
  return { 
    hours, 
    minutes, 
    isExpired: false, 
    display: `${hours}h ${minutes}m remaining` 
  };
}

// Minimum rank order for team challenges (Stylist = 4)
export const MINIMUM_TEAM_CHALLENGE_RANK = 4;

// Role colors for UI
export const ROLE_COLORS: Record<string, string> = {
  master_cutter: 'from-amber-500 to-orange-600',
  artisan_weaver: 'from-purple-500 to-pink-600',
  draping_specialist: 'from-cyan-500 to-blue-600',
  creative_director: 'from-emerald-500 to-teal-600',
};

// Role icons
export const ROLE_ICONS: Record<string, string> = {
  master_cutter: '✂️',
  artisan_weaver: '🧵',
  draping_specialist: '💫',
  creative_director: '👁️',
};
