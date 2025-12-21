import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import type { Candidate } from '../../types/candidate';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Pass':
      return 'default';
    case 'Fail':
      return 'destructive';
    case 'On Hold':
      return 'secondary';
    default:
      return 'outline';
  }
};

interface Props {
  candidates: Candidate[];
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CandidateList({ 
  candidates, 
  onDelete, 
  currentPage, 
  totalPages, 
  onPageChange 
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  if (candidates.length === 0) {
    return <p className="text-center text-gray-500 py-8">No candidates found.</p>;
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/candidate/${id}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
        {candidates.map((candidate) => (
          <Card 
            key={candidate._id} 
            onClick={() => handleCardClick(candidate._id)}
            className="bg-[#23140c] my-2 sm:my-6 text-[#dedbd2] border border-transparent group cursor-pointer hover:shadow-md transition duration-200"
          >
            <div className='flex justify-between text-[#dedbd2] items-start'>
              <CardHeader className='flex-1 p-3 sm:p-6'>
                <CardTitle className="text-base sm:text-lg">{candidate.name}</CardTitle>
                <CardDescription className='text-[#dedbd2] text-sm'>{candidate.appliedPosition}</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <Badge className='text-[#dedbd2] text-xs sm:text-sm' variant={getStatusVariant(candidate.status)}>
                  {candidate.status}
                </Badge>
              </CardContent>
            </div>
            <CardFooter className="justify-between text-xs sm:text-sm text-[#dedbd2] p-3 sm:p-6 pt-0">
              <span>{candidate.experienceYears} years experience</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(candidate._id);
                }}
                className="opacity-100 sm:opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-4 sm:mt-6 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`cursor-pointer w-8 h-8 p-0 text-xs sm:text-sm ${
                currentPage === page
                  ? 'bg-[#23140c] text-[#dedbd2]'
                  : 'bg-transparent text-[#23140c] border-[#23140c] hover:bg-[#23140c] hover:text-[#dedbd2]'
              }`}
            >
              {page}
            </Button>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
  <AlertDialogContent className="bg-[#dedbd2] w-[90%] max-w-md rounded-lg">
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription className='text-gray-800'>
        This action cannot be undone. This will permanently delete the candidate data.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
      <AlertDialogCancel className="cursor-pointer w-full sm:w-auto">Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 cursor-pointer w-full sm:w-auto">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </>
  );
}
