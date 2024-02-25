import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const InfoBanner = ({ message = "", description = "", icon = <Info /> }) => {
    return (
        <div>
            <Alert className='mb-2'>
                {icon}
                <AlertTitle className="ml-4">{message}</AlertTitle>
                <AlertDescription
                    className="ml-4"
                >
                    {description}
                </AlertDescription>
            </Alert>
        </div>
    );
}

export default InfoBanner;