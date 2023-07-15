const mapping: Record<string, string> = {
  'candidate-responses': 'candidate_response',
  companies: 'company',
  'job-domains': 'job_domain',
  questions: 'question',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
