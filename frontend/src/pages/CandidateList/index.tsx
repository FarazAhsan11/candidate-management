import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useCandidate } from '../../hooks/useCandidate';
import { candidateService } from '../../services/candidateService';
import CandidateList from './CandidateList';
import CandidateFilters from './CandidateFilters';
import AddCandidateModal from './AddCandidateModal';
import { Button } from '../../components/ui/button';

const ITEMS_PER_PAGE = 6;

export default function CandidateListPage() {
  const { candidates, loading, error, fetchCandidates, addCandidate, removeCandidate } = useCandidate();

  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('All');
  const [status, setStatus] = useState('All');
  const [experience, setExperience] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date-desc'); 

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, position, status, experience, sortBy]); 

  const positions = useMemo(() => {
    return [...new Set(candidates.map((c) => c.appliedPosition))];
  }, [candidates]);

  const filtered = useMemo(() => {
    if (candidates.length === 0) {
      return [];
    }
    return candidates.filter((c) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.appliedPosition.toLowerCase().includes(searchLower);
        
      const matchesPosition = position === 'All' || c.appliedPosition === position;
      const matchesStatus = status === 'All' || c.status === status;

      let matchesExperience = true;
      if (experience === '0-2') matchesExperience = c.experienceYears <= 2;
      else if (experience === '3-5') matchesExperience = c.experienceYears >= 3 && c.experienceYears <= 5;
      else if (experience === '6+') matchesExperience = c.experienceYears >= 6;

      return matchesSearch && matchesPosition && matchesStatus && matchesExperience;
    });
  }, [candidates, search, position, status, experience]);

  const sorted = useMemo(() => {
    const sortedList = [...filtered];
    
    switch (sortBy) {
      case 'name-asc':
        sortedList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedList.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'experience-asc':
        sortedList.sort((a, b) => a.experienceYears - b.experienceYears);
        break;
      case 'experience-desc':
        sortedList.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'date-asc':
        sortedList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'date-desc':
        sortedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    
    return sortedList;
  }, [filtered, sortBy]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE); 

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE); 
  }, [sorted, currentPage]);

  const handleAddCandidate = async (formData: FormData) => {
    try {
      const newCandidate = await candidateService.create(formData);
      addCandidate(newCandidate);
      setIsModalOpen(false);
      toast.success('Candidate added successfully!');
    } catch (err) {
      toast.error('Failed to add candidate.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await candidateService.delete(id);
      removeCandidate(id);
      toast.success('Candidate deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete candidate.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#dedbd2] w-full flex items-center justify-center">
        <div className="p-4 bg-[#dedbd2] shadow-lg rounded-lg">Loading...</div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-500">{error}</div>;

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
        candidates={paginatedCandidates}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddCandidateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
    </div>
  );
}
