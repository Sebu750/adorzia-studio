import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RankData {
  name: string;
  count: number;
}

interface RankDistributionChartProps {
  data: RankData[];
}

const COLORS = [
  'hsl(280, 75%, 55%)', // F1
  'hsl(260, 65%, 50%)', // F2
  'hsl(220, 15%, 55%)', // Novice
  'hsl(30, 55%, 55%)',  // Apprentice
  'hsl(220, 70%, 55%)', // Designer
  'hsl(142, 70%, 45%)', // Senior
  'hsl(25, 80%, 55%)',  // Lead
  'hsl(340, 70%, 55%)', // Elite
];

export function RankDistributionChart({ data }: RankDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
