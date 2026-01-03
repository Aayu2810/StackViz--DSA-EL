import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ProcessingStep } from '@/types';

interface StackGraphProps {
  history: ProcessingStep[];
  currentHeight: number;
}

const StackGraph: React.FC<StackGraphProps> = ({ history, currentHeight }) => {
  // Generate chart data from history
  const chartData = React.useMemo(() => {
    let height = 0;
    const data: { time: number; height: number; event: string }[] = [
      { time: 0, height: 0, event: 'Start' }
    ];

    history.forEach((step, index) => {
      if (step.type === 'push') {
        height++;
        data.push({
          time: index + 1,
          height,
          event: `Push: ${step.task?.title || 'Task'}`,
        });
      } else if (step.type === 'pop') {
        height--;
        data.push({
          time: index + 1,
          height,
          event: `Pop: ${step.task?.title || 'Task'}`,
        });
      }
    });

    // Add current state
    if (data.length > 0) {
      data.push({
        time: data.length,
        height: currentHeight,
        event: 'Current',
      });
    }

    return data;
  }, [history, currentHeight]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel px-3 py-2 text-sm">
          <p className="text-foreground font-medium">Height: {payload[0].value}</p>
          <p className="text-muted-foreground text-xs">{payload[0].payload.event}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Stack Height Over Time</h3>
        <span className="text-xs font-mono px-2 py-1 rounded bg-primary/20 text-primary">
          Current: {currentHeight}
        </span>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="stackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }}
              axisLine={{ stroke: 'hsl(240, 10%, 18%)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(215, 20%, 55%)' }}
              axisLine={{ stroke: 'hsl(240, 10%, 18%)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="stepAfter"
              dataKey="height"
              stroke="hsl(262, 83%, 58%)"
              strokeWidth={2}
              fill="url(#stackGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default StackGraph;
