import { Shield, CheckCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * FR 1.6: Authenticity Verification Badge Component
 * Displays digital certificate of authenticity on product pages
 */

interface AuthenticityBadgeProps {
  productId: string;
}

export function AuthenticityBadge({ productId }: AuthenticityBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { data: certificate, isLoading } = useQuery({
    queryKey: ['product-authenticity', productId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-authenticity`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            action: 'get_certificate',
            product_id: productId,
          }),
        }
      );

      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="h-16 bg-muted rounded-lg animate-pulse" />
    );
  }

  if (!certificate) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">Authenticity Guaranteed</h4>
              <Badge variant="outline" className="text-xs border-primary/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">
              This item comes with a digital certificate of authenticity from{' '}
              <span className="font-medium text-foreground">
                {certificate.designer.brand_name || certificate.designer.name}
              </span>
            </p>

            {!showDetails ? (
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs"
                onClick={() => setShowDetails(true)}
              >
                View Certificate Details
              </Button>
            ) : (
              <div className="mt-3 space-y-3 pt-3 border-t border-border/50">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate No.</span>
                    <span className="font-mono font-medium">{certificate.certificate_number}</span>
                  </div>
                  
                  {certificate.materials && certificate.materials.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials</span>
                      <span className="font-medium text-right">{certificate.materials.join(', ')}</span>
                    </div>
                  )}
                  
                  {certificate.production?.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crafted In</span>
                      <span className="font-medium">{certificate.production.location}</span>
                    </div>
                  )}
                  
                  {certificate.design_info?.date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Design Date</span>
                      <span className="font-medium">
                        {new Date(certificate.design_info.date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {certificate.intellectual_property && certificate.intellectual_property.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Protected Intellectual Property
                    </p>
                    <div className="space-y-1">
                      {certificate.intellectual_property.map((ip: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs py-0">
                            {ip.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-muted-foreground truncate">
                            {ip.registration_number} ({ip.country})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0 text-xs"
                  onClick={() => setShowDetails(false)}
                >
                  Hide Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
