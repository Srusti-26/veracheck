import { Metrics } from "@/lib/mockData";
import { motion } from "framer-motion";

interface MetricsDashboardProps {
  metrics: Metrics;
  latencyHistory: number[];
  throughputHistory: number[];
}

function MiniChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ label, value, unit, color, children }: { label: string; value: string | number; unit?: string; color?: string; children?: React.ReactNode }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 border border-border/30">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-xl font-bold font-mono ${color || 'text-foreground'}`}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground font-mono">{unit}</span>}
      </div>
      {children}
    </div>
  );
}

export function MetricsDashboard({ metrics, latencyHistory, throughputHistory }: MetricsDashboardProps) {
  const total = metrics.stage1Count + metrics.stage2Count + metrics.stage3Count || 1;

  return (
    <div className="glass rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border/50">
        <h2 className="font-semibold text-sm tracking-wide uppercase text-foreground">Metrics</h2>
      </div>
      <div className="p-3 flex-1 overflow-y-auto space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Throughput" value={metrics.throughput} unit="req/s" color="text-primary">
            <div className="mt-2 h-8">
              <MiniChart data={throughputHistory} color="hsl(160, 84%, 39%)" height={32} />
            </div>
          </StatCard>
          <StatCard label="Avg Latency" value={metrics.avgLatency} unit="ms" color="text-warning">
            <div className="mt-2 h-8">
              <MiniChart data={latencyHistory} color="hsl(38, 92%, 50%)" height={32} />
            </div>
          </StatCard>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatCard label="LLM Skip" value={metrics.llmSkipRate} unit="%" color="text-primary" />
          <StatCard label="Cost Save" value={`${metrics.costSavings}%`} color="text-success" />
          <StatCard label="Accuracy" value={metrics.accuracy.toFixed(1)} unit="%" color="text-foreground" />
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-secondary/50 rounded-lg p-3 border border-border/30">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Pipeline Distribution</span>
          <div className="mt-3 space-y-2">
            {[
              { label: "Stage 1: Similarity", count: metrics.stage1Count, color: "bg-primary" },
              { label: "Stage 2: Heuristic", count: metrics.stage2Count, color: "bg-warning" },
              { label: "Stage 3: LLM", count: metrics.stage3Count, color: "bg-misleading" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="text-foreground">{((s.count / total) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.count / total) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${s.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <StatCard label="Total Processed" value={metrics.totalProcessed} />
      </div>
    </div>
  );
}
