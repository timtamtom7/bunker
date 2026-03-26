// Bunker 2.0 Design System - Clean Intellectual Theme

export const intellectualTheme = {
  colors: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceElevated: '#F0F2F5',
    primary: '#2C3E50', // intellectual navy
    accent: '#3498DB', // clear blue
    textPrimary: '#1A252F',
    textSecondary: '#5D6D7E',
    textTertiary: '#85929E',
    border: '#E5E8EB',
    error: '#E74C3C',
    success: '#27AE60',
    warning: '#F39C12',
  },
  typography: {
    display: { fontFamily: "'Inter', -apple-system, sans-serif", fontSize: '38px', fontWeight: '700', lineHeight: '1.1' },
    heading1: { fontFamily: "'Inter', -apple-system, sans-serif", fontSize: '28px', fontWeight: '600', lineHeight: '1.2' },
    heading2: { fontFamily: "'Inter', -apple-system, sans-serif", fontSize: '20px', fontWeight: '600', lineHeight: '1.3' },
    body: { fontFamily: "'Inter', -apple-system, sans-serif", fontSize: '16px', fontWeight: '400', lineHeight: '1.6' },
    caption: { fontFamily: "'Inter', -apple-system, sans-serif", fontSize: '13px', fontWeight: '400' },
    mono: { fontFamily: "'Space Mono', monospace", fontSize: '14px' },
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', pill: '999px' },
};

// Predictive Decision AI
export class PredictiveDecisionService {
  constructor() {
    this.decisionPatterns = [];
  }

  async predictOutcome(decision, historicalDecisions) {
    // Predict likely outcomes based on:
    // - Historical decision patterns
    // - Similar past decisions
    // - External factors
    const similar = this.findSimilarDecisions(decision, historicalDecisions);

    if (similar.length === 0) {
      return { confidence: 0.2, prediction: 'No similar decisions found for prediction' };
    }

    const successRate = similar.filter(d => d.outcome === 'success').length / similar.length;

    return {
      confidence: Math.min(0.9, 0.3 + similar.length * 0.1),
      predictedOutcome: successRate > 0.6 ? 'likely_success' : successRate > 0.4 ? 'uncertain' : 'risky',
      successRate: successRate,
      similarCount: similar.length,
      keyFactors: this.extractKeyFactors(similar),
    };
  }

  findSimilarDecisions(decision, historical) {
    return historical.filter(h => {
      const typeMatch = h.type === decision.type;
      const domainMatch = h.domain === decision.domain;
      const sizeMatch = Math.abs((h.stake || 0) - (decision.stake || 0)) < 10000;
      return typeMatch && domainMatch && sizeMatch;
    });
  }

  extractKeyFactors(similarDecisions) {
    const factors = { pros: [], cons: [] };

    similarDecisions.slice(0, 5).forEach(d => {
      if (d.keyFactors) {
        factors.pros.push(...(d.keyFactors.pros || []));
        factors.cons.push(...(d.keyFactors.cons || []));
      }
    });

    return {
      pros: [...new Set(factors.pros)].slice(0, 3),
      cons: [...new Set(factors.cons)].slice(0, 3),
    };
  }

  recommendTiming(decision) {
    // Recommend best timing for decision based on:
    // - Urgency level
    // - Preparation time needed
    // - External factors
    const { urgency, preparationDays } = decision;

    if (urgency === 'high') {
      return { recommended: 'now', rationale: 'High urgency — act quickly' };
    }

    return {
      recommended: `${preparationDays || 7} days`,
      rationale: preparationDays > 14 ? 'Complex decision — take time to prepare' : 'Standard preparation period recommended',
    };
  }
}

export const predictiveDecisionService = new PredictiveDecisionService();
