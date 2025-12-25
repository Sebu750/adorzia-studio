import { useWizardContext } from "../WizardContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Users, Award } from "lucide-react";
import { RANK_INFO } from "@/lib/ranks";
import { SOVEREIGN_ATELIER_ROLES } from "@/lib/sovereign-atelier";

interface TeamRole {
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

export function TeamSettingsTab() {
  const { formData, updateFormData } = useWizardContext();
  
  const isTeamChallenge = (formData as any).is_team_challenge || false;
  const teamSize = (formData as any).team_size || 4;
  const minimumTeamRankOrder = (formData as any).minimum_team_rank_order || 4;
  const teamRoleRequirements: TeamRole[] = (formData as any).team_role_requirements || [];

  const handleToggleTeamChallenge = (enabled: boolean) => {
    updateFormData('is_team_challenge' as any, enabled);
    if (enabled && teamRoleRequirements.length === 0) {
      // Default to Sovereign Atelier roles template
      updateFormData('team_role_requirements' as any, SOVEREIGN_ATELIER_ROLES);
      updateFormData('team_size' as any, 4);
      updateFormData('minimum_team_rank_order' as any, 4);
    }
  };

  const handleAddRole = () => {
    const newRole: TeamRole = {
      role_id: `role_${Date.now()}`,
      role_name: 'New Role',
      requirements: [],
      deliverables: [],
      badge: {
        name: 'Badge Name',
        icon: '🎖️',
        meaning: 'Badge description'
      }
    };
    updateFormData('team_role_requirements' as any, [...teamRoleRequirements, newRole]);
  };

  const handleUpdateRole = (index: number, updates: Partial<TeamRole>) => {
    const updated = [...teamRoleRequirements];
    updated[index] = { ...updated[index], ...updates };
    updateFormData('team_role_requirements' as any, updated);
  };

  const handleRemoveRole = (index: number) => {
    updateFormData('team_role_requirements' as any, teamRoleRequirements.filter((_, i) => i !== index));
  };

  const handleUseSovereignTemplate = () => {
    updateFormData('team_role_requirements' as any, SOVEREIGN_ATELIER_ROLES);
    updateFormData('team_size' as any, 4);
    updateFormData('minimum_team_rank_order' as any, 4);
  };

  return (
    <div className="space-y-6">
      {/* Team Challenge Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <Label className="text-base font-medium">Team Challenge</Label>
            <p className="text-sm text-muted-foreground">
              Enable team-based submission with role assignments
            </p>
          </div>
        </div>
        <Switch
          checked={isTeamChallenge}
          onCheckedChange={handleToggleTeamChallenge}
        />
      </div>

      {isTeamChallenge && (
        <>
          {/* Team Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Team Size</Label>
              <Input
                type="number"
                min={2}
                max={8}
                value={teamSize}
                onChange={(e) => updateFormData('team_size' as any, parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Minimum Rank Required</Label>
              <Select
                value={String(minimumTeamRankOrder)}
                onValueChange={(v) => updateFormData('minimum_team_rank_order' as any, parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RANK_INFO).map(([key, rank]) => (
                    <SelectItem key={key} value={String(rank.order)}>
                      {rank.name} ({rank.scRequired}+ SC)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Template */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Award className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Use a pre-built template:</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleUseSovereignTemplate}
            >
              Sovereign Atelier (4 Roles)
            </Button>
          </div>

          {/* Role Definitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Team Roles</Label>
              <Button variant="outline" size="sm" onClick={handleAddRole}>
                <Plus className="h-4 w-4 mr-1" />
                Add Role
              </Button>
            </div>

            {teamRoleRequirements.map((role, index) => (
              <Card key={role.role_id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-xl">{role.badge.icon}</span>
                      {role.role_name}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveRole(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role ID</Label>
                      <Input
                        value={role.role_id}
                        onChange={(e) => handleUpdateRole(index, { role_id: e.target.value })}
                        placeholder="e.g., master_cutter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role Name</Label>
                      <Input
                        value={role.role_name}
                        onChange={(e) => handleUpdateRole(index, { role_name: e.target.value })}
                        placeholder="e.g., Master Cutter (Pattern & Silhouette)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Requirements (one per line)</Label>
                    <Textarea
                      value={role.requirements.join('\n')}
                      onChange={(e) => handleUpdateRole(index, { 
                        requirements: e.target.value.split('\n').filter(Boolean) 
                      })}
                      rows={3}
                      placeholder="Enter requirements..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Deliverables (one per line)</Label>
                    <Textarea
                      value={role.deliverables.join('\n')}
                      onChange={(e) => handleUpdateRole(index, { 
                        deliverables: e.target.value.split('\n').filter(Boolean) 
                      })}
                      rows={3}
                      placeholder="Enter deliverables..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Badge Icon</Label>
                      <Input
                        value={role.badge.icon}
                        onChange={(e) => handleUpdateRole(index, { 
                          badge: { ...role.badge, icon: e.target.value } 
                        })}
                        placeholder="🎖️"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Badge Name</Label>
                      <Input
                        value={role.badge.name}
                        onChange={(e) => handleUpdateRole(index, { 
                          badge: { ...role.badge, name: e.target.value } 
                        })}
                        placeholder="Golden Scissors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Badge Meaning</Label>
                      <Input
                        value={role.badge.meaning}
                        onChange={(e) => handleUpdateRole(index, { 
                          badge: { ...role.badge, meaning: e.target.value } 
                        })}
                        placeholder="Your patterns are production-ready."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {teamRoleRequirements.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No roles defined yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleUseSovereignTemplate}
                >
                  Use Sovereign Atelier Template
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
