import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ErrorBanner = ({ message = "Something went wrong!", description = "Error, try reloading the page again!", icon = <AlertTriangle /> }) => {
    return (
        <div className="md:container px-3">
            <Alert variant="destructive" className='mb-2'>
            {icon}
                <AlertTitle className="ml-4">{message}</AlertTitle>
                <AlertDescription className="ml-4">
                    {description}
                </AlertDescription>
            </Alert>
        </div>
    );
}

export default ErrorBanner;