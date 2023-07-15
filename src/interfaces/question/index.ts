import { CandidateResponseInterface } from 'interfaces/candidate-response';
import { JobDomainInterface } from 'interfaces/job-domain';
import { GetQueryInterface } from 'interfaces';

export interface QuestionInterface {
  id?: string;
  content: string;
  job_domain_id?: string;
  created_at?: any;
  updated_at?: any;
  candidate_response?: CandidateResponseInterface[];
  job_domain?: JobDomainInterface;
  _count?: {
    candidate_response?: number;
  };
}

export interface QuestionGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  job_domain_id?: string;
}
