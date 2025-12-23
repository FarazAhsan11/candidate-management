import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { candidateService } from '../../services/candidateService';
import type { CandidateResponse } from '../../services/candidateService';
import type { Candidate } from '../../types/candidate';
import CandidateList from './CandidateList';
import CandidateFilters from './CandidateFilters';
import AddCandidateModal from './AddCandidateModal';
import { Button } from '../../components/ui/button';
import { useDebounce } from '../../hooks/useDebounce';

const ITEMS_PER_PAGE = 12;

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);  
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('All');
  const [status, setStatus] = useState('All');
  const [experience, setExperience] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date-desc');
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: CandidateResponse = await candidateService.getAll({
        search: debouncedSearch || undefined,
        position: position !== 'All' ? position : undefined,
        status: status !== 'All' ? status : undefined,
        experience: experience !== 'All' ? experience : undefined,
        sortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      
      setCandidates(response.candidates);
      setPositions(response.positions);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error(err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false); 
    }
  }, [debouncedSearch, position, status, experience, sortBy, currentPage]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, position, status, experience, sortBy]);

  const handleAddCandidate = async (formData: FormData) => {
    try {
      await candidateService.create(formData);
      setIsModalOpen(false);
      toast.success('Candidate added successfully!');
      fetchCandidates();
    } catch (err) {
      toast.error('Failed to add candidate.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await candidateService.delete(id);
      toast.success('Candidate deleted successfully!');
      fetchCandidates();
    } catch (err) {
      toast.error('Failed to delete candidate.');
    }
  };

  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-[#dedbd2] w-full flex items-center justify-center">
        <div className="p-4 bg-[#dedbd2] shadow-lg rounded-lg">Loading...</div>
      </div>
    );
  }

  if (error && isInitialLoad) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-2 sm:p-4 bg-[#dedbd2] min-h-screen">
      <div className="flex flex-col sm:flex-row p-3 sm:p-4 gap-3 sm:gap-0 sm:justify-between border rounded-md border-transparent bg-[#23140c] items-center px-3 sm:px-6 mb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#dedbd2] text-center sm:text-left">
          Candidates Management Dashboard
        </h1>
        <Button 
          className='cursor-pointer bg-[#dedbd2] text-black hover:bg-[#d0ba98] w-full sm:w-auto' 
          onClick={() => setIsModalOpen(true)}
        >
          + Add Candidate
        </Button>
      </div>

      <CandidateFilters
        search={search}
        position={position}
        status={status}
        experience={experience}
        positions={positions}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onPositionChange={setPosition}
        onStatusChange={setStatus}
        onExperienceChange={setExperience}
        onSortChange={setSortBy}
      />

      <CandidateList
        candidates={candidates}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />

      <AddCandidateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
    </div>
  );
}
