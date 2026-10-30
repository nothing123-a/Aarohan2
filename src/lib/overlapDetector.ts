import { Complaint, OverlapAlert } from "@/types";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", 
  "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", 
  "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", 
  "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", 
  "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only", 
  "or", "other", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", 
  "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", 
  "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", 
  "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", 
  "you", "your", "yours", "yourself", "yourselves"
]);

function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  setA.forEach(item => {
    if (setB.has(item)) intersectionCount++;
  });
  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : Math.round((intersectionCount / unionCount) * 100);
}

export function analyzeOverlapBetweenComplaints(cA: Complaint, cB: Complaint): OverlapAlert | null {
  if (cA.id === cB.id) return null;

  const isExactInstitutionMatch = cA.aictePermanentId === cB.aictePermanentId;
  const isDifferentBureau = cA.assignedBureau !== cB.assignedBureau;

  const tokensA = tokenize(`${cA.subject} ${cA.description} ${cA.category}`);
  const tokensB = tokenize(`${cB.subject} ${cB.description} ${cB.category}`);

  const textSimilarity = calculateJaccardSimilarity(tokensA, tokensB);

  // Common overlapping keywords
  const overlappingWords: string[] = [];
  tokensA.forEach(w => {
    if (tokensB.has(w)) overlappingWords.push(w);
  });

  // Calculate composite explainable score
  let score = 0;
  const reasons: string[] = [];

  if (isExactInstitutionMatch) {
    score += 45;
    reasons.push(`Exact AICTE Permanent ID match: ${cA.aictePermanentId} (${cA.institutionName})`);
  }

  if (textSimilarity > 15) {
    const textContribution = Math.min(40, Math.round(textSimilarity * 0.7));
    score += textContribution;
    reasons.push(
      `Text similarity score of ${textSimilarity}% (Common keywords: ${overlappingWords.slice(0, 5).join(", ")})`
    );
  }

  if (isDifferentBureau && isExactInstitutionMatch) {
    score += 15;
    reasons.push(
      `Cross-bureau distribution: ${cA.assignedBureau} vs ${cB.assignedBureau} handling same institution concurrently`
    );
  }

  if (cA.category === cB.category && isExactInstitutionMatch) {
    score += 10;
    reasons.push(`Identical grievance category: "${cA.category}"`);
  }

  // Cap score at 99%
  score = Math.min(99, score);

  // Only produce alert if there is significant signal (e.g. same institution or high text similarity)
  if (!isExactInstitutionMatch && textSimilarity < 40) {
    return null;
  }

  const confidenceIndicator = score >= 80 ? "High" : score >= 50 ? "Medium" : "Low";

  let recommendedAction = "Review case records side by side.";
  if (score >= 80) {
    recommendedAction = "High probability of duplicate or cluster issue. Recommend linking cases and establishing inter-bureau coordination.";
  } else if (isExactInstitutionMatch && score < 50) {
    recommendedAction = "Same institution with distinct complaints. Review to ensure absence of systemic correlation or mark as Not Related.";
  } else if (!isExactInstitutionMatch) {
    recommendedAction = "Different institutions with similar wording. Kept independent; no link recommended.";
  }

  return {
    id: `OVR-${cA.id.replace("GRV-", "")}-${cB.id.replace("GRV-", "")}`,
    complaintIdA: cA.id,
    complaintIdB: cB.id,
    institutionName: isExactInstitutionMatch ? cA.institutionName : `${cA.institutionName} vs ${cB.institutionName}`,
    aictePermanentId: isExactInstitutionMatch ? cA.aictePermanentId : `${cA.aictePermanentId} / ${cB.aictePermanentId}`,
    bureauA: cA.assignedBureau,
    bureauB: cB.assignedBureau,
    subjectA: cA.subject,
    subjectB: cB.subject,
    statusA: cA.status,
    statusB: cB.status,
    similarityScore: score,
    confidenceIndicator,
    detectionReasons: reasons,
    recommendedAction,
    isReviewed: false,
    reviewDecision: "pending",
  };
}

