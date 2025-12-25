import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, AlertTriangle, Users } from "lucide-react";
import { ROLE_ICONS, type TeamRole, areAllRolesAssigned } from "@/lib/team-challenges";

interface TeamMember {
  id: string;
  name: string;
  avatar_url?: string;
  rank_name?: string;
  sc?: number;
}

interface TeamRoleAssignmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: TeamRole[];
  teamMembers: TeamMember[];
  assignments: Record<string, string>;
  onAssign: (roleId: string, userId: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function TeamRoleAssignment({
  open,
  onOpenChange,
  roles,
  teamMembers,
  assignments,
  onAssign,
  onConfirm,
  isLoading
}: TeamRoleAssignmentProps) {
  const allAssigned = areAllRolesAssigned(roles, assignments);
  
  // Get assigned user IDs to prevent double assignment
  const assignedUserIds = Object.values(assignments).filter(Boolean);
  
  // Get available members for a role (not assigned to other roles)
  const getAvailableMembers = (roleId: string) => {
    const currentAssignment = assignments[roleId];
    return teamMembers.filter(
      member => member.id === currentAssignment || !assignedUserIds.includes(member.id)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Team Roles
          </DialogTitle>
          <DialogDescription>
            Assign each team member to a specific role. Each member can only have one role.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {roles.map((role) => {
              const assignedMember = teamMembers.find(m => m.id === assignments[role.role_id]);
              const availableMembers = getAvailableMembers(role.role_id);
              
              return (
                <div 
                  key={role.role_id}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ROLE_ICONS[role.role_id] || '👤'}</span>
                      <div>
                        <h4 className="font-semibold">{role.role_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {role.requirements.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {role.badge.name}
                    </Badge>
                  </div>

                  {/* Deliverables preview */}
                  <div className="mb-3 p-2 rounded bg-muted/50">
                    <p className="text-xs font-medium mb-1">Key Deliverables:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {role.deliverables.slice(0, 3).map((d, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                      {role.deliverables.length > 3 && (
                        <li className="text-primary">+{role.deliverables.length - 3} more</li>
                      )}
                    </ul>
                  </div>

                  {/* Member selector */}
                  <Select
                    value={assignments[role.role_id] || ''}
                    onValueChange={(value) => onAssign(role.role_id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select team member...">
                        {assignedMember && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={assignedMember.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {assignedMember.name?.charAt(0) || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{assignedMember.name}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No available members
                        </div>
                      ) : (
                        availableMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback className="text-xs">
                                  {member.name?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{member.name}</span>
                              {member.rank_name && (
                                <Badge variant="outline" className="text-xs ml-2">
                                  {member.rank_name}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!allAssigned && (
            <div className="flex items-center gap-2 text-amber-500 text-sm mr-auto">
              <AlertTriangle className="h-4 w-4" />
              <span>All roles must be assigned</span>
            </div>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!allAssigned || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-600"
          >
            {isLoading ? 'Starting...' : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirm & Start Challenge
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
