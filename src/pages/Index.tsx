import { useState, useEffect, useCallback } from "react";
import { generatePost, generateMetrics, NewsPost, Metrics } from "@/lib/mockData";
import { LiveFeed } from "@/components/LiveFeed";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { MetricsDashboard } from "@/components/MetricsDashboard";
import { AdminPanel } from "@/components/AdminPanel";

type Tab = 'dashboard' | 'admin';

export default function Index() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({ throughput: 0, avgLatency: 0, llmSkipRate: 0, costSavings: 0, accuracy: 0, totalProcessed: 0, stage1Count: 0, stage2Count: 0, stage3Count: 0 });
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [throughputHistory, setThroughputHistory] = useState<number[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');

  const addPost = useCallback(() => {
    const post = generatePost();
    setPosts(prev => {
      const next = [post, ...prev].slice(0, 100);
      const m = generateMetrics(next);
      setMetrics(m);
      setLatencyHistory(h => [...h.slice(-29), m.avgLatency]);
      setThroughputHistory(h => [...h.slice(-29), m.throughput]);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(addPost, 1800);
    return () => clearInterval(interval);
  }, [isStreaming, addPost]);

  // Seed initial posts
  useEffect(() => {
    for (let i = 0; i < 6; i++) addPost();
  }, [addPost]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">V</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground">VeraCheck</h1>
            <p className="text-[10px] text-muted-foreground font-mono">Real-Time Vernacular Fact-Checker</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-secondary/50 rounded-md p-0.5">
            {(['dashboard', 'admin'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'dashboard' ? 'Dashboard' : 'Admin'}
              </button>
            ))}
          </div>

          {/* Stream toggle */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1 text-xs font-mono rounded-md border transition-colors ${
              isStreaming
                ? 'border-primary/40 text-primary bg-primary/10'
                : 'border-border text-muted-foreground bg-secondary/50'
            }`}
          >
            {isStreaming ? '● Live' : '○ Paused'}
          </button>
        </div>
      </header>

      {/* Content */}
      {tab === 'dashboard' ? (
        <div className="flex-1 grid grid-cols-12 gap-2 p-2 overflow-hidden">
          <div className="col-span-3 min-h-0">
            <LiveFeed posts={posts} onSelectPost={setSelectedPost} selectedPostId={selectedPost?.id} />
          </div>
          <div className="col-span-5 min-h-0">
            <AnalysisPanel post={selectedPost} />
          </div>
          <div className="col-span-4 min-h-0">
            <MetricsDashboard metrics={metrics} latencyHistory={latencyHistory} throughputHistory={throughputHistory} />
          </div>
        </div>
      ) : (
        <div className="flex-1 p-2 overflow-hidden">
          <AdminPanel />
        </div>
      )}
    </div>
  );
}
