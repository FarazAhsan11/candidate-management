import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CandidateProvider } from './context/CandidateContext';
import CandidateList from './pages/CandidateList';
import CandidateDetail from './pages/CandidateDetail';
import { Toaster } from './components/ui/sonner';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <CandidateProvider>
        <Routes>
          <Route path="/" element={<CandidateList />} />
          <Route path="/candidate/:id" element={<CandidateDetail />} />
          <Route path='*' element = {<NotFound/>}/>
        </Routes>
        <Toaster />
      </CandidateProvider>
    </BrowserRouter>
  );
}

export default App;
