import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ErrorBanner = ({ message = "Something went wrong!", description = "Error, try reloading the page again!", icon = <AlertTriangle /> }) => {
    return (
        <div>
            <Alert className='mb-2'>
                <div className="w-4 h-4">
                    {icon}
                </div>
                <AlertTitle>{message}</AlertTitle>
                <AlertDescription>
                    {description}
                </AlertDescription>
            </Alert>
        </div>
    );
}

export default ErrorBanner;