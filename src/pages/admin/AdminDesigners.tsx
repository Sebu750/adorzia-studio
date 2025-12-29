import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  Download,
  Eye,
  Edit,
  Crown,
  Ban,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RANKS, RankTier, safeGetRank, isValidRankTier } from "@/lib/ranks";

// Mock designer data - using valid RankTier values
const designers = [
  {
    id: "1",
    name: "Aria Kim",
    email: "aria.kim@email.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    country: "South Korea",
    category: "Fashion",
    rank: "f1" as RankTier,
    subscription: "elite",
    status: "active",
    completedStyleboxes: 47,
    publishedItems: 23,
    revenue: 12450,
    joinedAt: "Mar 2023",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    country: "USA",
    category: "Fashion",
    rank: "creative_director" as RankTier,
    subscription: "pro",
    status: "active",
    completedStyleboxes: 38,
    publishedItems: 18,
    revenue: 9820,
    joinedAt: "Apr 2023",
  },
  {
    id: "3",
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    country: "France",
    category: "Textile",
    rank: "visionary" as RankTier,
    subscription: "pro",
    status: "active",
    completedStyleboxes: 32,
    publishedItems: 15,
    revenue: 7340,
    joinedAt: "May 2023",
  },
  {
    id: "4",
    name: "James Park",
    email: "james.park@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    country: "UK",
    category: "Jewelry",
    rank: "couturier" as RankTier,
    subscription: "pro",
    status: "active",
    completedStyleboxes: 28,
    publishedItems: 12,
    revenue: 5120,
    joinedAt: "Jun 2023",
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    email: "elena.rod@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    country: "Spain",
    category: "Fashion",
    rank: "patternist" as RankTier,
    subscription: "basic",
    status: "active",
    completedStyleboxes: 24,
    publishedItems: 9,
    revenue: 3890,
    joinedAt: "Jul 2023",
  },
  {
    id: "6",
    name: "David Wilson",
    email: "david.w@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    country: "Canada",
    category: "Textile",
    rank: "apprentice" as RankTier,
    subscription: "basic",
    status: "suspended",
    completedStyleboxes: 8,
    publishedItems: 2,
    revenue: 890,
    joinedAt: "Sep 2023",
  },
];

const rankColors: Record<RankTier, string> = {
  'f1': 'bg-rank-f1/10 text-rank-f1 border-rank-f1/30',
  'f2': 'bg-rank-f2/10 text-rank-f2 border-rank-f2/30',
  'apprentice': 'bg-rank-apprentice/10 text-rank-apprentice border-rank-apprentice/30',
  'patternist': 'bg-muted/20 text-muted-foreground border-muted-foreground/30',
  'stylist': 'bg-muted/30 text-foreground border-muted-foreground/40',
  'couturier': 'bg-foreground/10 text-foreground border-foreground/30',
  'visionary': 'bg-foreground/15 text-foreground border-foreground/40',
  'creative_director': 'bg-foreground/20 text-foreground border-foreground/50',
};

const AdminDesigners = () => {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Designer Management
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all registered designers
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="accent" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Designer
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, email..." className="pl-10" />
              </div>
              <Select defaultValue="all-ranks">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-ranks">All Ranks</SelectItem>
                  <SelectItem value="f1">F1 - Founder</SelectItem>
                  <SelectItem value="f2">F2 - Pioneer</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-subs">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subs">All Plans</SelectItem>
                  <SelectItem value="elite">Elite</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-status">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Designers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>StyleBoxes</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designers.map((designer) => (
                  <TableRow key={designer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={designer.avatar} />
                          <AvatarFallback>{designer.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{designer.name}</p>
                          <p className="text-xs text-muted-foreground">{designer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{designer.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(rankColors[designer.rank] || rankColors.apprentice)}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {safeGetRank(designer.rank).name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          designer.subscription === 'elite' ? 'accent' :
                          designer.subscription === 'pro' ? 'secondary' : 'outline'
                        }
                        className="capitalize"
                      >
                        {designer.subscription}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{designer.completedStyleboxes}</span>
                      <span className="text-muted-foreground"> / {designer.publishedItems} pub</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-success">
                        ${designer.revenue.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={designer.status === 'active' ? 'success' : 'destructive'}
                        className="capitalize"
                      >
                        {designer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Crown className="h-4 w-4 mr-2" />
                            Change Rank
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDesigners;
