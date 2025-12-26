import { useState, useEffect } from 'react';
import { candidateService } from '../../services/candidateService';
import type { Candidate } from '../../types/candidate';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  candidate: Candidate;
  onUpdate: (updated: Candidate) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = ['New', 'Screening', 'Interviewed', 'Pass', 'Fail', 'On Hold'] as const;
const roleOptions = ['HR', 'Interviewer'] as const;

export default function RemarksWidget({ candidate, onUpdate, open, onOpenChange }: Props) {
  const [role, setRole] = useState<'HR' | 'Interviewer'>('HR');
  const [hrRemarks, setHrRemarks] = useState(candidate.hrRemarks || '');
  const [interviewerRemarks, setInterviewerRemarks] = useState(candidate.interviewerRemarks || '');
  const [status, setStatus] = useState(candidate.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHrRemarks(candidate.hrRemarks || '');
    setInterviewerRemarks(candidate.interviewerRemarks || '');
    setStatus(candidate.status);
  }, [candidate]);

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
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to update remarks');
      toast.error("Failed to update remarks");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#dedbd2] border-[#23140c] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#23140c] flex items-center gap-2">
            <MessageCircle />
            REMARKS
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add or update remarks and status for {candidate.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
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
              className={`w-full bg-[#dedbd2] text-[#1a0e08] border border-[#3d2a1f] rounded p-2 min-h-24 resize-none ${
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
              className={`w-full bg-[#dedbd2] text-[#1a0e08] border border-[#3d2a1f] rounded p-2 min-h-24 resize-none ${
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

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#4a2c1a] hover:bg-[#5a3c2a] text-[#dedbd2] py-2 rounded cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
