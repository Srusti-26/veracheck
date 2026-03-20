import { NewsPost } from "@/lib/mockData";
import { ClassificationBadge } from "./ClassificationBadge";
import { motion } from "framer-motion";

interface AnalysisPanelProps {
  post: NewsPost | null;
}

export function AnalysisPanel({ post }: AnalysisPanelProps) {
  if (!post) {
    return (
      <div className="glass rounded-lg h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Select a post to analyze</p>
      </div>
    );
  }

  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-lg h-full overflow-y-auto"
    >
      <div className="px-4 py-3 border-b border-border/50">
        <h2 className="font-semibold text-sm tracking-wide uppercase text-foreground">Analysis</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Original */}
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Original ({post.language})</label>
          <p className="text-sm text-foreground mt-1 bg-secondary/50 rounded-md p-3 font-mono leading-relaxed">{post.originalText}</p>
        </div>

        {/* Translated */}
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Translated (English)</label>
          <p className="text-sm text-foreground mt-1 bg-secondary/50 rounded-md p-3 leading-relaxed">{post.translatedText}</p>
        </div>

        {/* Classification */}
        <div className="flex items-center gap-3">
          <ClassificationBadge classification={post.classification} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Confidence</span>
              <span className="text-xs font-mono text-primary">{((post.confidence || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(post.confidence || 0) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Pipeline Stage */}
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Pipeline Stage</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 rounded-md p-2 text-center text-xs font-mono border ${
                  post.pipelineStage === s
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-secondary/30 border-border/30 text-muted-foreground"
                }`}
              >
                {s === 1 && "Similarity"}
                {s === 2 && "Heuristic"}
                {s === 3 && "LLM"}
              </div>
            ))}
          </div>
        </div>

        {/* Processing */}
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <span>⏱ {post.processingTimeMs}ms</span>
          <span>📡 {post.source}</span>
        </div>

        {/* Retrieved Facts */}
        {post.retrievedFacts && post.retrievedFacts.length > 0 && (
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Retrieved Facts</label>
            <div className="space-y-2 mt-2">
              {post.retrievedFacts.map((fact, i) => (
                <div key={i} className="bg-secondary/50 rounded-md p-3 border border-border/30">
                  <p className="text-xs text-foreground/90 leading-relaxed">{fact.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{fact.source}</span>
                    <span className="text-[10px] font-mono text-primary">sim: {fact.similarity.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
