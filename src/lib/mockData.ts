// Mock data for VeraCheck dashboard

export interface NewsPost {
  id: string;
  originalText: string;
  translatedText: string;
  language: string;
  timestamp: Date;
  source: string;
  classification?: 'true' | 'false' | 'misleading';
  confidence?: number;
  pipelineStage?: 1 | 2 | 3;
  retrievedFacts?: RetrievedFact[];
  processingTimeMs?: number;
}

export interface RetrievedFact {
  text: string;
  similarity: number;
  source: string;
}

export interface Metrics {
  throughput: number;
  avgLatency: number;
  llmSkipRate: number;
  costSavings: number;
  accuracy: number;
  totalProcessed: number;
  stage1Count: number;
  stage2Count: number;
  stage3Count: number;
}

const samplePosts: Omit<NewsPost, 'id' | 'timestamp'>[] = [
  {
    originalText: "प्रधानमंत्री ने नई शिक्षा नीति की घोषणा की",
    translatedText: "Prime Minister announced new education policy",
    language: "Hindi",
    source: "Twitter",
    classification: "true",
    confidence: 0.94,
    pipelineStage: 1,
    processingTimeMs: 12,
    retrievedFacts: [
      { text: "PM announced NEP 2024 reforms on March 15", similarity: 0.92, source: "PIB Official" },
      { text: "Education policy revision confirmed by ministry", similarity: 0.87, source: "MoE Press Release" },
    ],
  },
  {
    originalText: "5G towers se corona virus failta hai, sach mein",
    translatedText: "5G towers spread coronavirus, it is true",
    language: "Hinglish",
    source: "WhatsApp Forward",
    classification: "false",
    confidence: 0.98,
    pipelineStage: 1,
    processingTimeMs: 8,
    retrievedFacts: [
      { text: "WHO confirmed no link between 5G and COVID-19", similarity: 0.95, source: "WHO Fact Check" },
      { text: "5G radio waves cannot carry or spread viruses", similarity: 0.91, source: "IEEE Report" },
    ],
  },
  {
    originalText: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೊಸ ಮೆಟ್ರೋ ಮಾರ್ಗ ಪ್ರಾರಂಭ",
    translatedText: "New metro line launched in Bangalore",
    language: "Kannada",
    source: "News18",
    classification: "true",
    confidence: 0.89,
    pipelineStage: 2,
    processingTimeMs: 45,
    retrievedFacts: [
      { text: "Bangalore Metro Phase 2 line opened March 2024", similarity: 0.84, source: "BMRCL" },
    ],
  },
  {
    originalText: "இலங்கையில் புதிய அரசியல் கட்சி தொடங்கப்பட்டது",
    translatedText: "New political party launched in Sri Lanka",
    language: "Tamil",
    source: "Facebook",
    classification: "misleading",
    confidence: 0.72,
    pipelineStage: 3,
    processingTimeMs: 320,
    retrievedFacts: [
      { text: "Party registration pending verification with EC", similarity: 0.68, source: "Election Commission SL" },
      { text: "Coalition formed but not officially a new party", similarity: 0.71, source: "Reuters" },
    ],
  },
  {
    originalText: "गाय का दूध पीने से कैंसर ठीक होता है",
    translatedText: "Claim: cow milk treats cancer",
    language: "Hindi",
    source: "WhatsApp Forward",
    classification: "false",
    confidence: 0.97,
    pipelineStage: 1,
    processingTimeMs: 6,
    retrievedFacts: [
      { text: "No scientific evidence that milk cures cancer - WHO", similarity: 0.96, source: "WHO" },
    ],
  },
  {
    originalText: "India ne Mars mission launch kiya 2024 mein",
    translatedText: "India launched Mars mission in 2024",
    language: "Hinglish",
    source: "Twitter",
    classification: "misleading",
    confidence: 0.78,
    pipelineStage: 3,
    processingTimeMs: 280,
    retrievedFacts: [
      { text: "ISRO Mars Orbiter Mission was in 2013, MOM-2 not yet launched", similarity: 0.82, source: "ISRO" },
    ],
  },
  {
    originalText: "சென்னையில் கடும் மழை எச்சரிக்கை",
    translatedText: "Heavy rain warning in Chennai",
    language: "Tamil",
    source: "NDTV",
    classification: "true",
    confidence: 0.91,
    pipelineStage: 1,
    processingTimeMs: 10,
    retrievedFacts: [
      { text: "IMD issued red alert for Chennai region", similarity: 0.93, source: "IMD" },
    ],
  },
  {
    originalText: "ಭಾರತದ GDP 15% ಬೆಳವಣಿಗೆ ದಾಖಲಿಸಿದೆ",
    translatedText: "India's GDP recorded 15% growth",
    language: "Kannada",
    source: "Facebook",
    classification: "false",
    confidence: 0.95,
    pipelineStage: 2,
    processingTimeMs: 35,
    retrievedFacts: [
      { text: "India GDP growth was 7.8% in Q3 2024 - RBI", similarity: 0.88, source: "RBI" },
    ],
  },
];

let postCounter = 0;

export function generatePost(): NewsPost {
  const template = samplePosts[postCounter % samplePosts.length];
  postCounter++;
  return {
    ...template,
    id: `post-${Date.now()}-${postCounter}`,
    timestamp: new Date(),
  };
}

export function generateMetrics(posts: NewsPost[]): Metrics {
  const total = posts.length || 1;
  const s1 = posts.filter(p => p.pipelineStage === 1).length;
  const s2 = posts.filter(p => p.pipelineStage === 2).length;
  const s3 = posts.filter(p => p.pipelineStage === 3).length;
  const avgLat = posts.reduce((a, p) => a + (p.processingTimeMs || 0), 0) / total;

  return {
    throughput: Math.round(850 + Math.random() * 300),
    avgLatency: Math.round(avgLat || 45),
    llmSkipRate: Math.round(((s1 + s2) / total) * 100),
    costSavings: Math.round(((s1 + s2) / total) * 100 * 0.95),
    accuracy: 92.4 + Math.random() * 3,
    totalProcessed: total,
    stage1Count: s1,
    stage2Count: s2,
    stage3Count: s3,
  };
}

export const verifiedFacts = [
  { id: 1, text: "WHO confirmed no link between 5G and COVID-19", source: "WHO", category: "Health" },
  { id: 2, text: "India GDP growth was 7.8% in Q3 2024", source: "RBI", category: "Economy" },
  { id: 3, text: "PM announced NEP 2024 reforms on March 15", source: "PIB", category: "Education" },
  { id: 4, text: "No scientific evidence that milk cures cancer", source: "WHO", category: "Health" },
  { id: 5, text: "Bangalore Metro Phase 2 opened March 2024", source: "BMRCL", category: "Infrastructure" },
  { id: 6, text: "IMD issued red alert for Chennai region", source: "IMD", category: "Weather" },
  { id: 7, text: "ISRO Mars Orbiter Mission was in 2013", source: "ISRO", category: "Space" },
  { id: 8, text: "COVID vaccines approved by DCGI are safe", source: "ICMR", category: "Health" },
];
