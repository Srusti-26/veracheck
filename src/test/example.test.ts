import { describe, it, expect } from "vitest";
import { generatePost, generateMetrics } from "@/lib/mockData";

describe("generatePost", () => {
  it("returns a post with required fields", () => {
    const post = generatePost();
    expect(post.id).toBeTruthy();
    expect(post.originalText).toBeTruthy();
    expect(post.translatedText).toBeTruthy();
    expect(post.language).toBeTruthy();
    expect(post.timestamp).toBeInstanceOf(Date);
  });

  it("assigns a valid pipeline stage", () => {
    const post = generatePost();
    expect([1, 2, 3]).toContain(post.pipelineStage);
  });

  it("generates unique IDs across calls", () => {
    const ids = Array.from({ length: 10 }, () => generatePost().id);
    expect(new Set(ids).size).toBe(10);
  });
});

describe("generateMetrics", () => {
  it("returns zero-safe metrics for empty input", () => {
    const m = generateMetrics([]);
    expect(m.totalProcessed).toBe(0);
    expect(m.llmSkipRate).toBeGreaterThanOrEqual(0);
  });

  it("calculates stage distribution correctly", () => {
    const posts = Array.from({ length: 5 }, () => generatePost());
    const m = generateMetrics(posts);
    expect(m.stage1Count + m.stage2Count + m.stage3Count).toBe(posts.length);
    expect(m.totalProcessed).toBe(posts.length);
  });

  it("llmSkipRate reflects stage 1+2 proportion", () => {
    const posts = Array.from({ length: 10 }, () => generatePost());
    const m = generateMetrics(posts);
    const expected = Math.round(((m.stage1Count + m.stage2Count) / posts.length) * 100);
    expect(m.llmSkipRate).toBe(expected);
  });
});
