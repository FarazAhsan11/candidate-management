import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';

interface FiltersProps {
  search: string;
  position: string;
  status: string;
  experience: string;
  positions: string[];
  sortBy: string;
  onSearchChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const statuses = ['All', 'New', 'Screening', 'Interviewed', 'Pass', 'Fail', 'On Hold'];
const experienceRanges = ['All', '0-2', '3-5', '6+'];
const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'experience-desc', label: 'Experience (High-Low)' },
  { value: 'experience-asc', label: 'Experience (Low-High)' },
];

export default function CandidateFilters({
  search,
  position,
  status,
  experience,
  positions,
  sortBy,
  onSearchChange,
  onPositionChange,
  onStatusChange,
  onExperienceChange,
  onSortChange,
}: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-6 px-2 sm:px-0">
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2.5 border cursor-pointer border-gray-300 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2 font-medium text-gray-700"
          title={showFilters ? 'Hide filters' : 'Show filters'}
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
          <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-around items-center gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
          <Input
            placeholder="Search by name, email, position..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <Select value={position} onValueChange={onPositionChange}>
            <SelectTrigger className="w-full sm:w-40 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-white border-gray-200'>
              <SelectItem className="focus:bg-blue-50 focus:text-blue-900" value="All">All Positions</SelectItem>
              {positions.map((pos) => (
                <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-40 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-white border-gray-200'>
              {statuses.map((s) => (
                <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={experience} onValueChange={onExperienceChange}>
            <SelectTrigger className="w-full sm:w-40 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-white border-gray-200'>
              {experienceRanges.map((exp) => (
                <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={exp} value={exp}>
                  {exp === 'All' ? 'All Experience' : `${exp} years`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-44 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-white border-gray-200'>
              {sortOptions.map((opt) => (
                <SelectItem className="focus:bg-blue-50 focus:text-blue-900" key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
