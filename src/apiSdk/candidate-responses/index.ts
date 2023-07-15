import axios from 'axios';
import queryString from 'query-string';
import { CandidateResponseInterface, CandidateResponseGetQueryInterface } from 'interfaces/candidate-response';
import { GetQueryInterface } from '../../interfaces';

export const getCandidateResponses = async (query?: CandidateResponseGetQueryInterface) => {
  const response = await axios.get(`/api/candidate-responses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCandidateResponse = async (candidateResponse: CandidateResponseInterface) => {
  const response = await axios.post('/api/candidate-responses', candidateResponse);
  return response.data;
};

export const updateCandidateResponseById = async (id: string, candidateResponse: CandidateResponseInterface) => {
  const response = await axios.put(`/api/candidate-responses/${id}`, candidateResponse);
  return response.data;
};

export const getCandidateResponseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/candidate-responses/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCandidateResponseById = async (id: string) => {
  const response = await axios.delete(`/api/candidate-responses/${id}`);
  return response.data;
};
