// ============================================
// BUNKER — Decision Templates
// ============================================

export const BUILT_IN_TEMPLATES = [
  {
    id: 'job-offer',
    name: 'Job Offer Comparison',
    description: 'Compare multiple job opportunities side by side',
    icon: '💼',
    prefill: {
      problem: 'I\'m deciding between multiple job opportunities and need to think through which one aligns best with my career goals, values, and lifestyle.',
      options: [
        {
          name: '',
          sixMonths: 'What does day-to-day look like? What projects would I work on? Who would I work with?',
          worst: 'The role is not what was described, the team is dysfunctional, or the company culture doesn\'t match my values.',
          best: 'I\'m learning rapidly, building valuable skills, and feel genuinely excited to go to work each day.',
        },
        {
          name: '',
          sixMonths: 'What does day-to-day look like? What projects would I work on? Who would I work with?',
          worst: 'The role is not what was described, the team is dysfunctional, or the company culture doesn\'t match my values.',
          best: 'I\'m learning rapidly, building valuable skills, and feel genuinely excited to go to work each day.',
        },
      ],
      tradeoffs: 'What does choosing each option cost me? Am I giving up growth, salary, work-life balance, or location?',
      regretAnswer: 'Which would I regret more: taking the wrong job and having to pivot, or turning down an opportunity and wondering "what if"?',
    },
  },
  {
    id: 'moving-decision',
    name: 'Moving Decision',
    description: 'Evaluate a move to a new city or home',
    icon: '🏠',
    prefill: {
      problem: 'I\'m deciding whether to move to a new place. This decision affects my daily life, relationships, career, and finances.',
      options: [
        {
          name: 'Stay where I am',
          sixMonths: 'Everything continues as it is. Familiar routines, established relationships, known job situation.',
          worst: 'I watch opportunities pass me by while I stay in my comfort zone. Nothing changes.',
          best: 'I deepen existing relationships, consolidate my position, and make the most of where I already am.',
        },
        {
          name: 'Make the move',
          sixMonths: 'Getting settled in the new place. Learning the area, making new connections, adapting to a new routine.',
          worst: 'I lose my support network, struggle to adapt, or realize the move was a mistake.',
          best: 'I flourish in the new environment, build a better life, and look back grateful I took the leap.',
        },
      ],
      tradeoffs: 'What am I giving up? Friends, family, local knowledge, established routines? What might I gain?',
      regretAnswer: 'Which would I regret more: staying and wondering "what if," or moving and leaving behind what matters most?',
    },
  },
  {
    id: 'major-purchase',
    name: 'Major Purchase',
    description: 'Evaluate a significant buying decision',
    icon: '💳',
    prefill: {
      problem: 'I\'m considering a major purchase. I need to think through whether this is a good use of my money and whether it aligns with my priorities.',
      options: [
        {
          name: 'Buy it',
          sixMonths: 'I own the item and it\'s part of my daily life. The novelty has worn off but the value remains.',
          worst: 'Buyer\'s remorse sets in. The cost was not worth the benefit. I could have used that money elsewhere.',
          best: 'The purchase enhances my life in a meaningful way. Every time I use it, I\'m glad I bought it.',
        },
        {
          name: 'Don\'t buy it',
          sixMonths: 'The money stays in my account. I\'ve moved on and forgotten about the purchase.',
          worst: 'I still want it and feel like I denied myself something I would have enjoyed.',
          best: 'I\'m relieved I didn\'t spend the money. I find I don\'t actually need it as much as I thought.',
        },
      ],
      tradeoffs: 'What else could I do with this money? What is the true cost when you factor in maintenance, opportunity cost, etc.?',
      regretAnswer: 'Which would I regret more: buying something I don\'t need, or passing on something I\'ll always wonder about?',
    },
  },
];

export const USER_TEMPLATES_KEY = 'bunker_user_templates';

export function getUserTemplates() {
  try {
    const raw = localStorage.getItem(USER_TEMPLATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserTemplate(template) {
  const existing = getUserTemplates();
  const newTemplate = {
    ...template,
    id: template.id || crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = existing.some(t => t.id === newTemplate.id)
    ? existing.map(t => t.id === newTemplate.id ? newTemplate : t)
    : [...existing, newTemplate];
  localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(updated));
  return newTemplate;
}

export function deleteUserTemplate(id) {
  const existing = getUserTemplates();
  const updated = existing.filter(t => t.id !== id);
  localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(updated));
}

export function getAllTemplates() {
  return [...BUILT_IN_TEMPLATES, ...getUserTemplates()];
}
