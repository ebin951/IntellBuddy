
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '../shared/Button';

// Declarations for CDN-loaded libraries
declare const html2canvas: any;
declare const jspdf: any;


interface CertificateModalProps {
  courseName: string;
  studentName: string;
  onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ courseName, studentName, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, {
        backgroundColor: '#020617', // bg-primary color from tailwind config
        scale: 2, // Higher scale for better quality
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        // The jsPDF constructor from UMD is available on jspdf.jsPDF
        const pdf = new jspdf.jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        const safeCourseName = courseName.replace(/[^a-zA-Z0-9]/g, '_');
        const safeStudentName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`Certificate_${safeCourseName}_${safeStudentName}.pdf`);
      });
    }
  };


  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] animate-fade-in overflow-y-auto py-8" onClick={onClose}>
      <div className="bg-secondary rounded-xl shadow-2xl w-full max-w-3xl m-4 transform animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <div ref={certificateRef} className="p-8 border-4 border-brand bg-primary m-4 rounded-lg text-center relative">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-brand rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-brand rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-brand rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-brand rounded-br-lg"></div>

            <h2 className="text-4xl font-bold text-brand font-serif">Certificate of Completion</h2>
            <p className="text-text-secondary mt-6 text-lg">This certificate is proudly presented to</p>
            <p className="text-5xl font-extrabold text-text-primary my-4 tracking-wider">{studentName}</p>
            <p className="text-text-secondary text-lg">for successfully completing the course</p>
            <p className="text-3xl font-bold text-brand mt-4 mb-8">{courseName}</p>
            <div className="flex justify-between items-center w-3/4 mx-auto">
                <div className="text-center">
                    <p className="font-bold text-text-primary text-lg border-b-2 border-highlight pb-1">AI Instructor</p>
                    <p className="text-sm text-text-secondary">Student AI Platform</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-text-primary text-lg border-b-2 border-highlight pb-1">{new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-text-secondary">Date of Completion</p>
                </div>
            </div>
        </div>
        <div className="p-6 text-center flex justify-center gap-4 border-t border-accent">
          <Button onClick={handleDownload}>Download Certificate</Button>
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CertificateModal;
