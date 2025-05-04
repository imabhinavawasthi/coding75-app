"use client"

import { watermarkAndDownloadPDF } from "../(components)/download-watermark-pdf"

const TestPage = () => {
    const handlePDFUpload = async (e) => {
        const file = e.target.files[0];
        const arrayBuffer = await file.arrayBuffer();

        const userName = "Abhinav Awasthi";
        const userEmail = "abhinav@example.com";
        const userPhone = "+91-9876543210";

        await watermarkAndDownloadPDF(arrayBuffer, userName, userEmail, userPhone);
    };

    return (
        <div>
            <input type="file" onChange={handlePDFUpload} />
        </div>
    );
}

export default TestPage;