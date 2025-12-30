import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import type { Candidate } from '../../types/candidate';
import CandidateInfo from './candidateInfo';
import RemarksWidget from './remarksWidget';
import { Button } from '../../components/ui/button';

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remarksOpen, setRemarksOpen] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await candidateService.getById(id);
        setCandidate(data);
      } catch (err) {
        setError('Failed to load candidate');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
        <div className="h-screen bg-gray-50 w-screen flex items-center justify-center">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
          <p className="text-red-500 font-semibold text-lg">{error || 'Candidate not found'}</p>
          <Button onClick={() => navigate('/')} className="mt-4 bg-blue-600 hover:bg-blue-700">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              {candidate.name} - {candidate.appliedPosition}
            </h1>
          </div>

          <Button
            onClick={() => setRemarksOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
          >
            <MessageCircle size={18} />
            Remarks & Status
          </Button>
        </div>

        <CandidateInfo candidate={candidate} />

        <RemarksWidget
          candidate={candidate}
          onUpdate={setCandidate}
          open={remarksOpen}
          onOpenChange={setRemarksOpen}
        />
      </div>
    </div>
  );
}
