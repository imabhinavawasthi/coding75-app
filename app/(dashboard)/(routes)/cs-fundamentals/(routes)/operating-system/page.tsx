"use client"

import BreadCrumb from '@/app/(dashboard)/_components/breadcrumb';
import PageHeadersButton from '@/components/page-headers/page-headers-button';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const OperatingSystem = () => {
  
  return (
    <>
      <div className='lg:container md:container px-3'>
        <div className='overflow-x-scroll'>
        <BreadCrumb links={[
          {
            "title": "CS Fundamentals",
            "href": "/cs-fundamentals"
          },
          {
            "title": "Operating System",
            "href": "/cs-fundamentals/operating-system"
          }
        ]} />
        </div>
        <div>
          <PageHeadersButton greenHeading='System' heading='Operating'
          description='Operating system notes, specially designed for interview preparation 🚀'
          pdf_link='https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/Operating%20System/operating-system-notes.pdf'
          />
        </div>
        <div className='grid grid-cols-10'>
          <div className='col-span-1 hidden lg:block md:block'></div>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${'^3.11.174'}/build/pdf.worker.min.js`}>
            <div className='lg:col-span-8 md:col-span-8 col-span-10' style={{ maxWidth: '100%', minWidth: '100%' }}>
              <Viewer
                fileUrl={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/Operating%20System/operating-system-notes-web.pdf"}
              />
            </div>
          </Worker>
        </div>
      </div>
    </>
  );
}

export default OperatingSystem;