import { DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function EmptyEarnings() {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <DollarSign className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">
          No Earnings Yet
        </h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Submit your designs for publication to start earning from marketplace sales
        </p>
        <Button 
          variant="default" 
          className="gap-2"
          onClick={() => navigate("/portfolio")}
        >
          <Send className="h-4 w-4" />
          Go to Portfolio
        </Button>
      </CardContent>
    </Card>
  );
}
