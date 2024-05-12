import { pro_curriculum_pdf_link } from "@/components/social-links";
import ProPdfViewer from "../_components/pdf-viewer";

const ProDetailsPage = () => {
    return (
        <div>
            <ProPdfViewer
            heading="coding75 Pro "
            greenHeading="Details and Curriculum"
            button_text="Curriculum"
            pdf_link={pro_curriculum_pdf_link}
            description="This pdf contains all the details and complete curriculum of coding75 Pro 🚀"
            />
        </div>
    );
}

export default ProDetailsPage;