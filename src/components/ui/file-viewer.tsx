import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from './button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Card } from './card';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface FileViewerProps {
  file: File | string;
  onClose?: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  };

  // Handle different file types
  const renderContent = () => {
    const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
    const fileType = typeof file === 'string' ? file.split('.').pop()?.toLowerCase() : file.type;

    if (fileType === 'pdf' || fileType === 'application/pdf') {
      return (
        <div className="flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            <Button onClick={previousPage} disabled={pageNumber <= 1} size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center">
              Page {pageNumber} of {numPages}
            </span>
            <Button onClick={nextPage} disabled={pageNumber >= numPages} size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={zoomIn} size="sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button onClick={zoomOut} size="sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="border rounded-lg overflow-hidden"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      );
    } else if (fileType?.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img src={fileUrl} alt="Preview" className="max-w-full h-auto rounded-lg" />
        </div>
      );
    } else if (fileType === 'txt' || fileType === 'text/plain') {
      return (
        <div className="bg-white p-4 rounded-lg max-h-[600px] overflow-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {typeof file !== 'string' && (
              <FileContent file={file} />
            )}
          </pre>
        </div>
      );
    } else {
      return (
        <div className="text-center p-4">
          <p>Preview not available for this file type</p>
          <p className="text-sm text-muted-foreground mt-1">({fileType})</p>
        </div>
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {typeof file === 'string' ? file.split('/').pop() : file.name}
        </h3>
        {onClose && (
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        )}
      </div>
      {renderContent()}
    </Card>
  );
}

// Helper component to read and display text file content
function FileContent({ file }: { file: File }) {
  const [content, setContent] = useState<string>('');

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target?.result as string);
    };
    reader.readAsText(file);
  }, [file]);

  return <>{content}</>;
}