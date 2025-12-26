import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import type { Candidate } from '../../types/candidate';
import CandidateInfo from './CandidateInfo';
import RemarksWidget from './RemarksWidget';
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
        <div className="h-screen bg-[#dedbd2] w-screen flex items-center justify-center">
        <div className="p-4 bg-[#dedbd2] shadow-lg rounded-lg">Loading...</div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-[#dedbd2]  flex items-center justify-center">
        <p className="text-red-500">{error || 'Candidate not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dedbd2] p-6">
      <div className="px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-[#23140c] hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-2xl font-medium text-[#23140c]">
              {candidate.name} - {candidate.appliedPosition}
            </h1>
          </div>

          <Button
            onClick={() => setRemarksOpen(true)}
            className="bg-[#4a2c1a] hover:bg-[#5a3c2a] text-[#dedbd2] gap-2"
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
