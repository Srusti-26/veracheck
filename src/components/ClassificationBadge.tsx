import { cn } from "@/lib/utils";

interface ClassificationBadgeProps {
  classification?: 'true' | 'false' | 'misleading';
  size?: 'sm' | 'md';
}

export function ClassificationBadge({ classification, size = 'md' }: ClassificationBadgeProps) {
  if (!classification) return null;

  const styles = {
    true: "bg-success/15 text-success border-success/30",
    false: "bg-destructive/15 text-destructive border-destructive/30",
    misleading: "bg-misleading/15 text-misleading border-misleading/30",
  };

  const labels = {
    true: "✓ True",
    false: "✗ False",
    misleading: "⚠ Misleading",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-mono font-medium",
      styles[classification],
      size === 'sm' ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2.5 py-1"
    )}>
      {labels[classification]}
    </span>
  );
}
