import { useState } from "react";
import { verifiedFacts } from "@/lib/mockData";
import { toast } from "sonner";

export function AdminPanel() {
  const [facts, setFacts] = useState(verifiedFacts);
  const [newFact, setNewFact] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const addFact = () => {
    if (!newFact.trim() || !newSource.trim()) return;
    setFacts(prev => [...prev, {
      id: Date.now(),
      text: newFact,
      source: newSource,
      category: newCategory || "General",
    }]);
    setNewFact("");
    setNewSource("");
    setNewCategory("");
    toast.success("Fact added & embeddings re-indexed");
  };

  return (
    <div className="glass rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border/50">
        <h2 className="font-semibold text-sm tracking-wide uppercase text-foreground">Admin — Fact Database</h2>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Add form */}
        <div className="space-y-2">
          <input
            value={newFact}
            onChange={e => setNewFact(e.target.value)}
            placeholder="Verified fact text..."
            className="w-full bg-secondary/50 border border-border/30 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <div className="flex gap-2">
            <input
              value={newSource}
              onChange={e => setNewSource(e.target.value)}
              placeholder="Source"
              className="flex-1 bg-secondary/50 border border-border/30 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <input
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Category"
              className="flex-1 bg-secondary/50 border border-border/30 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <button
            onClick={addFact}
            className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Add Fact & Re-index Embeddings
          </button>
        </div>

        {/* Fact list */}
        <div className="space-y-1.5">
          {facts.map(f => (
            <div key={f.id} className="bg-secondary/50 rounded-md p-3 border border-border/30">
              <p className="text-xs text-foreground/90 leading-relaxed">{f.text}</p>
              <div className="flex gap-2 mt-1.5">
                <span className="text-[10px] font-mono text-primary">{f.source}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{f.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
