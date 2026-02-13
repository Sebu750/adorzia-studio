import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { supabaseAdmin as supabase } from '@/integrations/supabase/admin-client';
import { format, subDays, startOfDay } from 'date-fns';

export function RevenueChart() {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ['admin-earnings-chart'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data, error } = await supabase
        .from('earnings')
        .select('amount, created_at')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Process data into daily aggregates
  const chartData = (() => {
    if (!earnings || earnings.length === 0) {
      // Generate placeholder data for last 7 days
      return Array.from({ length: 7 }).map((_, i) => ({
        date: format(subDays(new Date(), 6 - i), 'MMM d'),
        amount: 0,
      }));
    }

    const dailyMap = new Map<string, number>();
    
    earnings.forEach(e => {
      const day = format(startOfDay(new Date(e.created_at)), 'MMM d');
      dailyMap.set(day, (dailyMap.get(day) || 0) + Number(e.amount));
    });

    return Array.from(dailyMap.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));
  })();

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(35, 70%, 50%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(35, 70%, 50%)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="date" 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
        />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="hsl(35, 70%, 50%)" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
