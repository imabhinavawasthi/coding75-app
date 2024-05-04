import { Separator } from "@/components/ui/separator";
import OnlyForPro from "../../(components)/only-for-pro";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const ResumeReviewClassroom = () => {
    return (
        <div className="md:container px-3">
            <Card className="w-full overflow-y-scroll">
                <CardHeader>
                    <CardTitle>Resume Review</CardTitle>
                    <CardDescription>Persionalised 1:1 Resume Review by coding75 Experts.</CardDescription>
                </CardHeader>
                <Separator className="mb-5" />
                <CardContent>
                <OnlyForPro />
                </CardContent>
            </Card>
        </div>
    );
}

export default ResumeReviewClassroom;