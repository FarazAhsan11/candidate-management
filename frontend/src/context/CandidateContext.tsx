import { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CandidateAction, CandidateState } from '../types/candidate';

const initialState: CandidateState = {
  candidates: [],
  loading: false,
  error: null,
};

function candidateReducer(state: CandidateState, action: CandidateAction): CandidateState {
  switch (action.type) {
    case 'SET_CANDIDATES':
      return { ...state, candidates: action.payload };
    case 'ADD_CANDIDATE':
      return { ...state, candidates: [...state.candidates, action.payload] };
    case 'REMOVE_CANDIDATE':
      return { ...state, candidates: state.candidates.filter(c => c._id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface CandidateContextType {
  state: CandidateState;
  dispatch: React.Dispatch<CandidateAction>;
}

export const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(candidateReducer, initialState);

  return (
    <CandidateContext.Provider value={{ state, dispatch }}>
      {children}
    </CandidateContext.Provider>
  );
}
