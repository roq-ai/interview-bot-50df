import { QuestionInterface } from 'interfaces/question';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface JobDomainInterface {
  id?: string;
  name: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  question?: QuestionInterface[];
  company?: CompanyInterface;
  _count?: {
    question?: number;
  };
}

export interface JobDomainGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  company_id?: string;
}
