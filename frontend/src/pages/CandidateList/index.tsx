import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { candidateService } from '../../services/candidateService';
import type { CandidateResponse } from '../../services/candidateService';
import type { Candidate } from '../../types/candidate';
import CandidateList from './candidateList';
import CandidateFilters from './candidateFilters';
import AddCandidateModal from './addCandidateModal';
import { Button } from '../../components/ui/button';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/authContext';
import { LogOut, User, Plus, KeyRound, MoreVertical } from 'lucide-react';
import ChangePasswordModal from '../../components/changePassword';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const ITEMS_PER_PAGE = 12;

export default function CandidateListPage() {
  const { user, logout } = useAuth();
  
  // Server data
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  // Filters & pagination
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('All');
  const [status, setStatus] = useState('All');
  const [experience, setExperience] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && isInitialLoad) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-2 sm:p-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border rounded-xl border-gray-200 bg-white shadow-sm px-4 sm:px-8 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Candidates Management Dashboard
        </h1>
        
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.name || user?.email}
                </span>
                {user?.role === 'admin' && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded">
                    Admin
                  </span>
                )}
                <MoreVertical className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsChangePasswordModalOpen(true)}>
                <KeyRound className="w-4 h-4 mr-2" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}
