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
      <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="text-blue-600" />
            REMARKS & STATUS
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add or update remarks and status for <span className="font-semibold text-gray-900">{candidate.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Added by</label>
            <Select value={role} onValueChange={(value) => setRole(value as 'HR' | 'Interviewer')}>
              <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white border-gray-200">
                {roleOptions.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="text-gray-900 focus:bg-blue-50 focus:text-blue-900 cursor-pointer"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">HR Remarks</label>
            <textarea
              value={hrRemarks}
              onChange={(e) => setHrRemarks(e.target.value)}
              disabled={role !== 'HR'}
              className={`w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 min-h-28 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
                role !== 'HR' ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
              }`}
              placeholder="Enter HR remarks..."
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Interviewer Remarks</label>
            <textarea
              value={interviewerRemarks}
              onChange={(e) => setInterviewerRemarks(e.target.value)}
              disabled={role !== 'Interviewer'}
              className={`w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 min-h-28 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
                role !== 'Interviewer' ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
              }`}
              placeholder="Enter interviewer remarks..."
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Status</label>
            <Select value={status} onValueChange={(value) => setStatus(value as Candidate['status'])}>
              <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white border-gray-200">
                {statusOptions.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="text-gray-900 focus:bg-blue-50 focus:text-blue-900 cursor-pointer"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
