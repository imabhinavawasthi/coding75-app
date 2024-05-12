import { pro_schedule_pdf_link } from "@/components/social-links";
import ProPdfViewer from "../_components/pdf-viewer";

const ProDetailsPage = () => {
    return (
        <div>
            <ProPdfViewer
            heading="coding75 Pro "
            greenHeading="Schedule 🚀"
            button_text="Schedule"
            pdf_link={pro_schedule_pdf_link}
            description="This pdf contains complete Schedule of coding75 Pro 🚀"
            />
        </div>
    );
}

export default ProDetailsPage;