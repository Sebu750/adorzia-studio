import { Activity, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptyActivity() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Activity className="h-6 w-6 text-muted-foreground" />
      </div>
      <h4 className="font-medium mb-1">No Recent Activity</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Start a Stylebox to see your activity here
      </p>
      <Button 
        variant="outline" 
        size="sm"
        className="gap-2"
        onClick={() => navigate("/styleboxes")}
      >
        <Box className="h-4 w-4" />
        Browse Styleboxes
      </Button>
    </div>
  );
}
