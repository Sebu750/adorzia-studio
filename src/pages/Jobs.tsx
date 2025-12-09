import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  DollarSign,
  Building,
  Bookmark,
  ExternalLink,
  Filter
} from "lucide-react";

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Fashion Designer",
      company: "Luxe Mode Paris",
      location: "Paris, France",
      type: "Full-time",
      salary: "$80k - $120k",
      category: "Fashion",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100",
      description: "Join our creative team to lead seasonal collections for our luxury fashion house.",
      tags: ["Luxury", "Haute Couture", "Leadership"],
    },
    {
      id: 2,
      title: "Freelance Textile Designer",
      company: "EcoFabrics Co.",
      location: "Remote",
      type: "Freelance",
      salary: "$50 - $80/hr",
      category: "Textile",
      posted: "1 week ago",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
      description: "Create sustainable textile patterns for our eco-conscious fabric line.",
      tags: ["Sustainable", "Remote", "Patterns"],
    },
    {
      id: 3,
      title: "Jewelry Design Consultant",
      company: "Artisan Gems",
      location: "New York, USA",
      type: "Contract",
      salary: "$60k - $90k",
      category: "Jewelry",
      posted: "3 days ago",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100",
      description: "Consult on new jewelry collections for our artisanal gemstone brand.",
      tags: ["Gemstones", "Luxury", "Consulting"],
    },
    {
      id: 4,
      title: "Brand Collaboration Designer",
      company: "Adorzia Partnerships",
      location: "Remote",
      type: "Project",
      salary: "$5,000 - $15,000",
      category: "Fashion",
      posted: "Just now",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
      description: "Design a capsule collection in collaboration with a major streetwear brand.",
      tags: ["Collaboration", "Streetwear", "Project-based"],
      featured: true,
    },
  ];

  const applications = [
    {
      job: "Senior Fashion Designer",
      company: "Luxe Mode Paris",
      status: "In Review",
      applied: "Nov 28, 2024",
    },
    {
      job: "Creative Director",
      company: "Urban Threads",
      status: "Interview",
      applied: "Nov 15, 2024",
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Job Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover opportunities from brands and studios in the Adorzia network
          </p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search jobs..." className="pl-10" />
              </div>
              <div className="flex gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="textile">Textile</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} hover className={job.featured ? "border-accent/50 bg-accent/5" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex gap-4 flex-1">
                        <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                          <Building className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display text-lg font-semibold">{job.title}</h3>
                              {job.featured && (
                                <Badge variant="accent">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-2">{job.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="h-4 w-4" />
                              {job.type}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {job.posted}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:flex-col gap-3 lg:items-end shrink-0">
                        <Button variant="accent" className="gap-2 flex-1 lg:flex-none">
                          Apply Now
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="shrink-0">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Your Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                      <div>
                        <h3 className="font-medium">{app.job}</h3>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">Applied {app.applied}</p>
                      </div>
                      <Badge variant={app.status === "Interview" ? "success" : "warning"}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Bookmark className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">No Saved Jobs</h3>
                <p className="text-muted-foreground">
                  Save jobs you're interested in to review later
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Jobs;
