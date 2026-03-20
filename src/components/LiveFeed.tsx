import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsPost } from "@/lib/mockData";
import { ClassificationBadge } from "./ClassificationBadge";

interface LiveFeedProps {
  posts: NewsPost[];
  onSelectPost: (post: NewsPost) => void;
  selectedPostId?: string;
}

export function LiveFeed({ posts, onSelectPost, selectedPostId }: LiveFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [posts.length]);

  return (
    <div className="glass rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <h2 className="font-semibold text-sm tracking-wide uppercase text-foreground">Live Feed</h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{posts.length} posts</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {posts.map((post) => (
            <motion.button
              key={post.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              onClick={() => onSelectPost(post)}
              className={`w-full text-left p-3 rounded-md transition-all ${
                selectedPostId === post.id
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-secondary/50 hover:bg-secondary border border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{post.source} · {post.language}</span>
                <ClassificationBadge classification={post.classification} size="sm" />
              </div>
              <p className="text-xs text-foreground/90 line-clamp-2 leading-relaxed">{post.originalText}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-mono text-muted-foreground">{post.processingTimeMs}ms</span>
                <span className="text-[10px] font-mono text-muted-foreground">Stage {post.pipelineStage}</span>
                {post.confidence && (
                  <span className="text-[10px] font-mono text-primary ml-auto">{(post.confidence * 100).toFixed(0)}%</span>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
