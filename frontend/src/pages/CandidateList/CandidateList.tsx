import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, } from 'lucide-react';
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
import { IdCard, Table as TableIcon } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import type { Candidate } from '../../types/candidate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  loading?: boolean;
}

export default function CandidateList({ 
  candidates, 
  onDelete, 
  currentPage, 
  totalPages, 
  onPageChange,
  loading = false 
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'table'>('table');
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/candidate/${id}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'cards' | 'table');
    onPageChange(1);
  };

  if (loading) {
    return (
       <div className="min-h-screen bg-gray-50 w-full flex items-start justify-center pt-20">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-lg">No candidates found.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or add a new candidate.</p>
      </div>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className='bg-white border border-gray-200 rounded-lg shadow-sm p-1'>
          <TabsTrigger className='cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white' value="cards">
            <IdCard className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger className='cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white' value="table">
            <TableIcon className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'cards' && (
        <>
         <div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 px-2 sm:px-0">
            {candidates.map((candidate) => (
              <Card
                key={candidate._id}
                onClick={() => handleCardClick(candidate._id)}
                className="bg-white my-2 sm:my-6 text-gray-900 border border-gray-200 group cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200"
              >
                <div className='flex justify-between items-start'>
                  <CardHeader className='flex-1 p-4 sm:p-6'>
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">{candidate.name}</CardTitle>
                    <CardDescription className='text-gray-600 text-sm'>{candidate.appliedPosition}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <Badge className='text-xs sm:text-sm font-medium' variant={getStatusVariant(candidate.status)}>
                      {candidate.status}
                    </Badge>
                  </CardContent>
                </div>
                <CardFooter className="justify-between text-xs sm:text-sm text-gray-600 p-4 sm:p-6 pt-0">
                  <span className="font-medium">{candidate.experienceYears} years experience</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(candidate._id);
                    }}
                    className="opacity-100 sm:opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
         </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={`cursor-pointer w-9 h-9 p-0 text-sm font-medium rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

    
{/* max-h-[calc(100vh-230px)] */}

 {activeTab === 'table' && (
  <>
   <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white flex flex-col">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-700 border-none">
              <TableHead className="text-white font-semibold pl-4">Name</TableHead>
              <TableHead className="text-white font-semibold">Position</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Experience</TableHead>
              <TableHead className="text-white font-semibold text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate._id}
                onClick={() => handleCardClick(candidate._id)}
                className='cursor-pointer hover:bg-blue-50 transition-colors border-gray-300'
              >
                <TableCell className="font-semibold text-gray-900 pl-4">{candidate.name}</TableCell>
                <TableCell className="text-gray-600">{candidate.appliedPosition}</TableCell>
                <TableCell>
                  <Badge className="font-medium" variant={getStatusVariant(candidate.status)}>
                    {candidate.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{candidate.experienceYears} years</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(candidate._id);
                    }}
                    className="text-red-500 hover:text-red-700 pr-4 hover:bg-red-50 p-2 rounded-lg transition-all cursor-pointer inline-flex"
                  >
                    <Trash2 size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={`cursor-pointer w-9 h-9 p-0 text-sm font-medium rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white w-[90%] max-w-md rounded-xl border border-gray-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className='text-gray-600'>
              This action cannot be undone. This will permanently delete the candidate data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-2">
            <AlertDialogCancel className="cursor-pointer w-full sm:w-auto border-gray-300 hover:bg-gray-50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 cursor-pointer w-full sm:w-auto shadow-sm">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
