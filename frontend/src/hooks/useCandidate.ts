import { useContext } from 'react';
import { CandidateContext } from '../context/CandidateContext';
import { candidateService } from '../services/candidateService';
import type { Candidate } from '../types/candidate';

export function useCandidate() {
  const context = useContext(CandidateContext);

  if (!context) {
    throw new Error('useCandidate must be used within CandidateProvider');
  }

  const { state, dispatch } = context;

  const fetchCandidates = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await candidateService.getAll();
      dispatch({ type: 'SET_CANDIDATES', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch candidates' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addCandidate = (candidate: Candidate) => {
    dispatch({ type: 'ADD_CANDIDATE', payload: candidate });
  };

  const removeCandidate = (id: string) => {
    dispatch({ type: 'REMOVE_CANDIDATE', payload: id });
  };

  return {
    candidates: state.candidates,
    loading: state.loading,
    error: state.error,
    fetchCandidates,
    addCandidate,
    removeCandidate,
  };
}
