import { Separator } from "@/components/ui/separator";
import OnlyForPro from "../../(components)/only-for-pro";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const MockInterview = () => {
    return (
        <div className="md:container px-3">
            <Card className="min-h-screen w-full overflow-y-scroll">
                <CardHeader>
                    <CardTitle>Mock Interview</CardTitle>
                    <CardDescription>Book 1:1 Mock Interview by coding75 Experts.</CardDescription>
                </CardHeader>
                <Separator className="mb-5" />
                <CardContent>
                    <OnlyForPro />
                </CardContent>
            </Card>
        </div>
    );
}

export default MockInterview;