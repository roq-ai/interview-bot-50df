import axios from 'axios';
import queryString from 'query-string';
import { JobDomainInterface, JobDomainGetQueryInterface } from 'interfaces/job-domain';
import { GetQueryInterface } from '../../interfaces';

export const getJobDomains = async (query?: JobDomainGetQueryInterface) => {
  const response = await axios.get(`/api/job-domains${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createJobDomain = async (jobDomain: JobDomainInterface) => {
  const response = await axios.post('/api/job-domains', jobDomain);
  return response.data;
};

export const updateJobDomainById = async (id: string, jobDomain: JobDomainInterface) => {
  const response = await axios.put(`/api/job-domains/${id}`, jobDomain);
  return response.data;
};

export const getJobDomainById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/job-domains/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteJobDomainById = async (id: string) => {
  const response = await axios.delete(`/api/job-domains/${id}`);
  return response.data;
};
