import { useState } from 'react';
import { candidateService } from '../../services/candidateService';
import type { Candidate } from '../../types/candidate';
import {MessageCircle} from 'lucide-react'
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


interface Props {
  candidate: Candidate;
  onUpdate: (updated: Candidate) => void;
}

const statusOptions = ['New', 'Screening', 'Interviewed', 'Pass', 'Fail', 'On Hold'] as const;
const roleOptions = ['HR', 'Interviewer'] as const;

export default function RemarksWidget({ candidate, onUpdate }: Props) {
  const [role, setRole] = useState<'HR' | 'Interviewer'>('HR');
  const [hrRemarks, setHrRemarks] = useState(candidate.hrRemarks || '');
  const [interviewerRemarks, setInterviewerRemarks] = useState(candidate.interviewerRemarks || '');
  const [status, setStatus] = useState(candidate.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
     
      setSaving(true);
      const updated = await candidateService.update(candidate._id, {
        hrRemarks,
        interviewerRemarks,
        status,
      });
      onUpdate(updated);
     
      toast.success("Remarks updated successfully");
    } catch (err) {
      console.error('Failed to update remarks');
      toast.error("Failed to update remarks");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#dedbd2] rounded-lg border border-[#23140c] p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-[#23140c] mb-4 flex items-center gap-2">
        <span><MessageCircle /></span> REMARKS
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Added by</label>
          <Select value={role} onValueChange={(value) => setRole(value as 'HR' | 'Interviewer')}>
            <SelectTrigger className="w-full bg-[#dedbd2] text-[#1a0e08] border-[#3d2a1f] cursor-pointer">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-[#dedbd2] border-[#3d2a1f]">
              {roleOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-[#1a0e08] focus:bg-[#c9c5ba] focus:text-[#1a0e08] cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">HR Remarks</label>
          <textarea
            value={hrRemarks}
            onChange={(e) => setHrRemarks(e.target.value)}
            disabled={role !== 'HR'}
            className={`w-full bg-[#dedbd2] text-[#1a0e08] border border-[#3d2a1f] rounded p-2 min-h-20 resize-none ${
              role !== 'HR' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            placeholder="Enter HR remarks..."
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Interviewer Remarks</label>
          <textarea
            value={interviewerRemarks}
            onChange={(e) => setInterviewerRemarks(e.target.value)}
            disabled={role !== 'Interviewer'}
            className={`w-full bg-[#dedbd2] text-[#1a0e08] border border-[#3d2a1f] rounded p-2 min-h-20 resize-none ${
              role !== 'Interviewer' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            placeholder="Enter interviewer remarks..."
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Status</label>
          <Select value={status} onValueChange={(value) => setStatus(value as Candidate['status'])}>
            <SelectTrigger className="w-full bg-[#dedbd2] text-[#1a0e08] border-[#3d2a1f] cursor-pointer">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-[#dedbd2] border-[#3d2a1f]">
              {statusOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt}
                  className="text-[#1a0e08] focus:bg-[#c9c5ba] focus:text-[#1a0e08] cursor-pointer"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#4a2c1a] hover:bg-[#5a3c2a] text-[#dedbd2] py-2 rounded cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
