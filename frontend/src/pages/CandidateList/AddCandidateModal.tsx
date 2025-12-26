import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';

const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  city: z.string().min(1, 'City is required'),
  institute: z.string().min(1, 'Institute is required'),
  educationLevel: z.enum(['Bachelor', 'Master', 'PhD', 'Other']),
  graduationYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
  currentPosition: z.string().min(1, 'Current position is required'),
  currentCompany: z.string().min(1, 'Current company is required'),
  experienceYears: z.coerce.number().min(0),
  noticePeriod: z.string().min(1, 'Notice period is required'),
  reasonToSwitch: z.string().min(1, 'Reason to switch is required'),
  currentSalary: z.coerce.number().min(0),
  expectedSalary: z.coerce.number().min(0),
  expectedSalaryPartTime: z.coerce.number().min(0).optional(),
  appliedPosition: z.string().min(1, 'Applied position is required'),
  loomLink: z.string().url().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  hrRemarks: z.string().optional(),
  interviewerRemarks: z.string().optional(),
   status: z.enum(['New', 'Screening', 'Interviewed', 'Pass', 'Fail', 'On Hold']).optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function AddCandidateModal({ open, onClose, onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      institute: '',
      educationLevel: 'Bachelor',
      graduationYear: new Date().getFullYear(),
      currentPosition: '',
      currentCompany: '',
      experienceYears: 0,
      noticePeriod: '',
      reasonToSwitch: '',
      currentSalary: 0,
      expectedSalary: 0,
      expectedSalaryPartTime: 0,
      appliedPosition: '',
      loomLink: '',
      hrRemarks: '',
      interviewerRemarks: '',
    },
  });

  const handleSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });
      const resumeInput = document.getElementById('resume') as HTMLInputElement;
      if (resumeInput?.files?.[0]) {
        formData.append('resume', resumeInput.files[0]);
      }
      await onSubmit(formData);
      form.reset();
      if (resumeInput) {
        resumeInput.value = '';
      }
    } catch (error) {
      toast.error('Failed to add candidate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<Sheet open={open} onOpenChange={() => { form.reset(); onClose(); }}>

      <SheetContent side="right" className="w-full text-gray-900 bg-white border-l border-gray-200 sm:max-w-3xl overflow-y-auto pb-4">
        <SheetHeader>
          <SheetTitle className='px-4 font-bold text-2xl text-gray-900'>Add New Candidate</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-2 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Name*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Email*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' type="email" placeholder="john@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Phone*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="03001234567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">City*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="Lahore" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="institute" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Institute*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="LUMS" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="educationLevel" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Education Level*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bachelor">Bachelor</SelectItem>
                      <SelectItem value="Master">Master</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="graduationYear" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Graduation Year</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="currentPosition" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Current Position*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="Software Engineer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="currentCompany" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Current Company</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="TechCorp" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="experienceYears" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Experience (Years)</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="noticePeriod" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Notice Period*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="1 month" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="appliedPosition" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Applied Position*</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="Senior Developer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="currentSalary" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Current Salary</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="expectedSalary" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Expected Salary</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="expectedSalaryPartTime" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Expected Salary (Part-Time)</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Resume</label>
                <Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' id="resume" type="file" accept=".pdf" />
              </div>
            <FormField control={form.control} name="reasonToSwitch" render={({ field }) => (
              <FormItem className='col-span-full'>
                <FormLabel className="font-semibold text-gray-700">Reason to Switch*</FormLabel>
                <FormControl><Textarea className='w-full' placeholder="Why are you looking for a change?" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            </div>
              <FormField control={form.control} name="loomLink" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Loom Link (Optional)</FormLabel>
                  <FormControl><Input className='border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' placeholder="https://loom.com/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            
              <FormField control={form.control} name="hrRemarks" render={({ field }) => (
                <FormItem className='col-span-full'>
                  <FormLabel className="font-semibold text-gray-700">HR Remarks (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="HR notes..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="interviewerRemarks" render={({ field }) => (
                <FormItem className='col-span-full'>
                  <FormLabel className="font-semibold text-gray-700">Interviewer Remarks (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Interviewer notes..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <Button type="button" variant="outline" onClick={() => { form.reset(); onClose(); }} disabled={isSubmitting} className="border-gray-300 hover:bg-gray-50">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                {isSubmitting ? 'Adding...' : 'Add Candidate'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
