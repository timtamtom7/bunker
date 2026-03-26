// Platform Ecosystem and API - Bunker

const API_BASE = 'https://api.bunker.app/v1';

// REST API Client
export class BunkerAPI {
  constructor(token) {
    this.token = token;
  }

  async fetchDecisions(limit = 50) {
    const res = await fetch(`${API_BASE}/decisions?limit=${limit}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return res.json();
  }

  async createDecision(decision) {
    const res = await fetch(`${API_BASE}/decisions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(decision),
    });
    return res.json();
  }

  async recordOutcome(decisionId, outcome) {
    const res = await fetch(`${API_BASE}/decisions/${decisionId}/outcome`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(outcome),
    });
    return res.json();
  }

  async getSynthesis(decisionId) {
    const res = await fetch(`${API_BASE}/decisions/${decisionId}/synthesis`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return res.json();
  }
}

// Project Management Integrations
export const PM_INTEGRATIONS = {
  asana: {
    name: 'Asana',
    status: 'planned',
    icon: 'list',
    features: ['Sync decisions to tasks', 'Link decisions to projects'],
  },
  linear: {
    name: 'Linear',
    status: 'planned',
    icon: 'chart.bar',
    features: ['Link decisions to issues', 'Track decision impact'],
  },
  notion: {
    name: 'Notion',
    status: 'planned',
    icon: 'doc.text',
    features: ['Embed decisions in docs', 'Link decisions to pages'],
  },
  slack: {
    name: 'Slack',
    status: 'planned',
    icon: 'message',
    features: ['Decision notifications', 'Team decision channels'],
  },
};

// Decision Export Service
export class DecisionExportService {
  async exportToCSV(decisionIds) {
    console.log(`Exporting ${decisionIds?.length || 'all'} decisions to CSV`);
    return { success: true, format: 'csv', downloadUrl: '#' };
  }

  async exportToPDF(decisionIds) {
    console.log(`Exporting ${decisionIds?.length || 'all'} decisions to PDF`);
    return { success: true, format: 'pdf', downloadUrl: '#' };
  }

  async exportToJSON() {
    console.log('Exporting all decisions to JSON');
    return { success: true, format: 'json', downloadUrl: '#' };
  }
}

// Webhook Events
export const WEBHOOK_EVENTS = {
  DECISION_CREATED: 'decision.created',
  DECISION_UPDATED: 'decision.updated',
  OUTCOME_RECORDED: 'outcome.recorded',
  TEAM_DECISION_CREATED: 'team.decision.created',
  SYNTHESIS_GENERATED: 'synthesis.generated',
};
