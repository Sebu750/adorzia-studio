import { FolderOpen, Box, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface EmptyPortfolioProps {
  onUpload?: () => void;
}

export function EmptyPortfolio({ onUpload }: EmptyPortfolioProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">
          No Projects Yet
        </h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Complete a Stylebox challenge or upload your own work to build your portfolio
        </p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/styleboxes")}
          >
            <Box className="h-4 w-4" />
            Browse Styleboxes
          </Button>
          <Button variant="default" className="gap-2" onClick={onUpload}>
            <Upload className="h-4 w-4" />
            Upload Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
