// Bunker 3.0 - AI Decision Coach and Community Wisdom

// AI Decision Coach
export class AIDecisionCoach {
  constructor() {
    this.coachingHistory = [];
  }

  async coachThroughDecision(decision) {
    const { question, options, stakes, timeline } = decision;

    const coachingSteps = [
      { step: 1, title: 'Frame the Decision', prompt: this.frameDecision(question) },
      { step: 2, title: 'Identify Assumptions', prompt: this.identifyAssumptions(question, options) },
      { step: 3, title: 'Weigh Trade-offs', prompt: this WeighTradeoffs(options) },
      { step: 4, title: 'Consider Time Horizon', prompt: this.considerTimeHorizon(timeline, stakes) },
    ];

    return {
      steps: coachingSteps,
      summary: this.generateSummary(decision),
      recommended: this.recommendOption(decision),
    };
  }

  frameDecision(question) {
    return `The core question is: "${question}". 
    Let's break this down: What does a good outcome look like? 
    What does a bad outcome look like? What's the cost of not deciding?`;
  }

  identifyAssumptions(question, options) {
    return `Key assumptions to challenge:
    1. Are you assuming the options are truly the only choices?
    2. Are you assuming the stakes are accurate?
    3. Are you considering the emotional component?`;
  }

  WeighTradeoffs(options) {
    return options.map(opt => ({
      option: opt.name || opt,
      pros: opt.pros || [],
      cons: opt.cons || [],
      tradeoffs: opt.tradeoffs || [],
    }));
  }

  considerTimeHorizon(timeline, stakes) {
    const urgency = timeline === 'now' ? 'high' : timeline > 30 ? 'low' : 'medium';
    return {
      urgency,
      timePressure: urgency === 'high' ? 'Act decisively but don't rush' : 'Take appropriate time to think',
      stakesNote: stakes > 10000 ? 'High-stakes decision — consider expert advice' : 'Manageable stakes — trust your judgment',
    };
  }

  generateSummary(decision) {
    return `You've identified a ${decision.stakes > 10000 ? 'high' : 'moderate'} stakes decision. 
    Take time to weigh your options carefully.`;
  }

  recommendOption(decision) {
    return null; // Coach doesn't recommend, guides the thinking
  }
}

// Predictive Analysis Service
export class PredictiveAnalysisService {
  analyzeDecision(decision, historical) {
    const similar = historical.filter(h => 
      h.type === decision.type && h.domain === decision.domain
    );

    if (similar.length === 0) {
      return { confidence: 0.2, prediction: 'Insufficient data for prediction' };
    }

    const successRate = similar.filter(h => h.outcome === 'success').length / similar.length;
    const avgOutcome = similar.reduce((sum, h) => sum + (h.outcomeScore || 0.5), 0) / similar.length;

    return {
      confidence: Math.min(0.85, 0.3 + similar.length * 0.08),
      predictedSuccessRate: successRate,
      averageOutcomeScore: avgOutcome,
      similarDecisions: similar.length,
      riskLevel: successRate > 0.6 ? 'low' : successRate > 0.4 ? 'medium' : 'high',
    };
  }
}

// Team Decision Framework
export class TeamDecisionFramework {
  createTeamDecision(decision, teamMembers) {
    return {
      ...decision,
      teamId: teamMembers.map(m => m.id),
      perspectives: teamMembers.map(m => ({
        memberId: m.id,
        opinion: null, // pending input
        confidence: null,
      })),
      consensusScore: 0,
      status: 'awaiting_input',
    };
  }

  aggregateOpinions(teamDecision) {
    const opinions = teamDecision.perspectives.filter(p => p.opinion !== null);
    if (opinions.length === 0) return { consensusScore: 0, status: 'awaiting_input' };

    const agreedOptions = this.findAgreement(opinions);
    const consensusScore = agreedOptions.length > 0 ? opinions.length / teamDecision.perspectives.length : 0;

    return {
      consensusScore,
      agreedOptions,
      dissentingOpinions: opinions.filter(o => !agreedOptions.includes(o.opinion)),
      status: 'ready',
    };
  }

  findAgreement(opinions) {
    const counts = {};
    opinions.forEach(o => {
      counts[o.opinion] = (counts[o.opinion] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts));
    return Object.entries(counts)
      .filter(([_, count]) => count === max && max >= opinions.length * 0.6)
      .map(([option]) => option);
  }
}

// Community Wisdom Aggregation
export class CommunityWisdomService {
  constructor() {
    this.anonymousDecisions = [];
  }

  async getCommunityInsights(decisionType, domain) {
    // Aggregate anonymous decision outcomes from the community
    const relevant = this.anonymousDecisions.filter(
      d => d.type === decisionType && d.domain === domain
    );

    return {
      totalSimilar: relevant.length,
      successRate: relevant.filter(d => d.outcome === 'success').length / Math.max(1, relevant.length),
      averageTimeToOutcome: this.calcAvgTime(relevant),
      topFactors: this.extractTopFactors(relevant),
    };
  }

  calcAvgTime(decisions) {
    const withTime = decisions.filter(d => d.outcomeDate && d.decisionDate);
    if (withTime.length === 0) return null;

    const totalDays = withTime.reduce((sum, d) => {
      return sum + (new Date(d.outcomeDate) - new Date(d.decisionDate)) / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.round(totalDays / withTime.length);
  }

  extractTopFactors(decisions) {
    const factors = [];
    decisions.slice(0, 10).forEach(d => {
      if (d.successFactors) factors.push(...d.successFactors);
    });
    return [...new Set(factors)].slice(0, 5);
  }
}

export const aiDecisionCoach = new AIDecisionCoach();
export const predictiveAnalysisService = new PredictiveAnalysisService();
export const teamDecisionFramework = new TeamDecisionFramework();
export const communityWisdomService = new CommunityWisdomService();
