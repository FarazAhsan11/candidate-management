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
    <div className="mb-4 px-2 sm:px-0">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 border cursor-pointer border-[#23140c] rounded-md bg-[#dedbd2] hover:bg-[#23140c] hover:text-white transition-colors"
          title={showFilters ? 'Hide filters' : 'Show filters'}
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-2 sm:gap-4">
          <Input
            placeholder="Search by name, email, position..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 border border-[#23140c]"
          />

          <Select value={position} onValueChange={onPositionChange}>
            <SelectTrigger className="w-full sm:w-40 border border-[#23140c] bg-[#dedbd2]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-[#dedbd2]'>
              <SelectItem className="" value="All">All Positions</SelectItem>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-40 border border-[#23140c] bg-[#dedbd2]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-[#dedbd2]'>
              {statuses.map((s) => (
                <SelectItem className="hover:bg-[#23140c] hover:text-white" key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={experience} onValueChange={onExperienceChange}>
            <SelectTrigger className="w-full sm:w-40 border border-[#23140c] bg-[#dedbd2]">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-[#dedbd2]'>
              {experienceRanges.map((exp) => (
                <SelectItem key={exp} value={exp}>
                  {exp === 'All' ? 'All Experience' : `${exp} years`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-44 border border-[#23140c] bg-[#dedbd2]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent position="popper" className='bg-[#dedbd2]'>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
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
