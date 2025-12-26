import type { Candidate } from "../../types/candidate";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState, useEffect } from "react";
import LoomPlayer from 'react-loom-player';
import {
  ChevronLeft,
  ChevronRight,
  FileUser,
  BriefcaseBusiness,
  Wallet,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  candidate: Candidate;
}

export default function CandidateInfo({ candidate }: Props) {
  const [pdfWidth, setPdfWidth] = useState(400);
  const [isVideoLoading, setIsVideoLoading] = useState(true);


  useEffect(() => {
    const updatePdfWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPdfWidth(300);
      } else if (width < 1024) {
        setPdfWidth(600);
      } else if (width < 1536) {
        setPdfWidth(700);
      } else {
        setPdfWidth(850);
      }
    };

    updatePdfWidth();
    window.addEventListener('resize', updatePdfWidth);
    return () => window.removeEventListener('resize', updatePdfWidth);
  }, []);

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="bg-[#dedbd2] rounded-lg flex flex-col xl:col-span-2">
      <Tabs defaultValue="resume">
      <TabsList className="bg-[#dedbd2]  shadow-lg">
        <TabsTrigger value="resume">Resume</TabsTrigger>
        <TabsTrigger value="loom-video">Loom Video</TabsTrigger>
      </TabsList>
      <TabsContent value="resume">
                {candidate.resumeFile ? (
          <div className="flex flex-col ">
            <div className=" bg-white shadow-lg rounded overflow-auto flex justify-center p-2">
              <Document
                file={candidate.resumeFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} width={pdfWidth} />
              </Document>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-2 text-[#23140c]">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                  className="p-2 bg-[#4a2c1a] text-[#dedbd2] rounded disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  disabled={pageNumber >= (numPages || 1)}
                  onClick={() => setPageNumber(pageNumber + 1)}
                  className="p-2 bg-[#4a2c1a] text-[#dedbd2] rounded disabled:opacity-50 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="bg-[#4a2c1a] text-[#dedbd2] border-none hover:bg-[#5a3c2a] hover:text-[#dedbd2]"
                onClick={() => window.open(candidate.resumeFile, "_blank")}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">No resume uploaded</p>
          </div>
        )}
      </TabsContent>
<TabsContent value="loom-video">
  {candidate.loomLink ? (
    <div className="relative [&_iframe]:max-w-full">
      {isVideoLoading && (
        <div className="absolute bg-[#dedbd2] inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a2c1a]"></div>
        </div>
      )}
      <LoomPlayer 
        src={candidate.loomLink} 
        autoplay 
        muted 
        timestamps={30}
        onLoad={() => setIsVideoLoading(false)}
      />
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-500">No Video Available</p>
    </div>
  )}
</TabsContent>

      </Tabs>

      </div>

      <div className="flex flex-col gap-2 xl:col-span-1">
        <div className="bg-[#dedbd2] border border-[#23140c] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#23140c] mb-4 flex items-center gap-2">
            <span>
              <FileUser />
            </span>{" "}
            BASIC INFO
          </h2>
          <div className="space-y-2 text-[#23140c]">
            <p>
              <span className="text-gray-600">Name:</span> {candidate.name}
            </p>
            <p>
              <span className="text-gray-600">Email:</span> {candidate.email}
            </p>
            <p>
              <span className="text-gray-600">Phone:</span> {candidate.phone}
            </p>
            <p>
              <span className="text-gray-600">City:</span> {candidate.city}
            </p>
          </div>
        </div>

        <div className="bg-[#dedbd2] border border-[#23140c] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#23140c] mb-4 flex items-center gap-2">
            <span>
              <FileUser />
            </span>{" "}
            EDUCATION
          </h2>
          <div className="space-y-2 text-[#23140c]">
            <p>
              <span className="text-gray-600">Institute:</span>{" "}
              {candidate.institute}
            </p>
            <p>
              <span className="text-gray-600">Degree:</span>{" "}
              {candidate.educationLevel}
            </p>
            <p>
              <span className="text-gray-600">Year:</span>{" "}
              {candidate.graduationYear}
            </p>
          </div>
        </div>

        <div className="bg-[#dedbd2] border border-[#23140c] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#23140c] mb-4 flex items-center gap-2">
            <span>
              <BriefcaseBusiness />
            </span>{" "}
            PROFESSIONAL
          </h2>
          <div className="space-y-2 text-[#23140c]">
            <p>
              <span className="text-gray-600">Current:</span>{" "}
              {candidate.currentPosition}
            </p>
            <p>
              <span className="text-gray-600">Company:</span>{" "}
              {candidate.currentCompany}
            </p>
            <p>
              <span className="text-gray-600">Experience:</span>{" "}
              {candidate.experienceYears} years
            </p>
            <p>
              <span className="text-gray-600">Notice:</span>{" "}
              {candidate.noticePeriod}
            </p>
          </div>
        </div>

        <div className="bg-[#dedbd2] border border-[#23140c] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[#23140c] mb-4 flex items-center gap-2">
            <span>
              <Wallet />
            </span>{" "}
            COMPENSATION
          </h2>
          <div className="space-y-2 text-[#23140c]">
            <p>
              <span className="text-gray-600">Current:</span>{" "}
              {candidate.currentSalary}
            </p>
            <p>
              <span className="text-gray-600">Expected:</span>{" "}
              {candidate.expectedSalary}
            </p>
            {!!candidate.expectedSalaryPartTime && (
              <p>
                <span className="text-gray-600">Part-time:</span>{" "}
                {candidate.expectedSalaryPartTime}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
