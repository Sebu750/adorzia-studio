import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FOUNDER_TIERS } from '@/lib/founder-tiers';

interface SlotData {
  f1Remaining: number;
  f2Remaining: number;
  f1Total: number;
  f2Total: number;
  f1Sold: number;
  f2Sold: number;
}

export const useFounderSlots = () => {
  return useQuery({
    queryKey: ['founder-slots'],
    queryFn: async (): Promise<SlotData> => {
      // Count completed F1 purchases
      const { count: f1Count, error: f1Error } = await supabase
        .from('foundation_purchases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .eq('rank_id', 'f1');

      // Count completed F2 purchases
      const { count: f2Count, error: f2Error } = await supabase
        .from('foundation_purchases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .eq('rank_id', 'f2');

      if (f1Error || f2Error) {
        console.error('Error fetching slot counts:', f1Error || f2Error);
      }

      const f1Total = FOUNDER_TIERS.f1.maxSlots || 1000;
      const f2Total = FOUNDER_TIERS.f2.maxSlots || 500;
      const f1Sold = f1Count || 0;
      const f2Sold = f2Count || 0;

      return {
        f1Remaining: Math.max(0, f1Total - f1Sold),
        f2Remaining: Math.max(0, f2Total - f2Sold),
        f1Total,
        f2Total,
        f1Sold,
        f2Sold,
      };
    },
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
};
