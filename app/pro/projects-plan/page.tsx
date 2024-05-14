import { pro_projects_plan, pro_schedule_pdf_link } from "@/components/social-links";
import ProPdfViewer from "../_components/pdf-viewer";

const ProProjectsPage = () => {
    return (
        <div>
            <ProPdfViewer
            heading="coding75 Pro "
            greenHeading="Project Plan 🚀"
            button_text="Project Plan"
            pdf_link={pro_projects_plan}
            description="This pdf contains complete Project Plan of coding75 Pro 🚀"
            />
        </div>
    );
}

export default ProProjectsPage;