import { Separator } from "@/components/ui/separator";
import OnlyForPro from "../../(components)/only-for-pro";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Mentorship = () => {
    return (
        <div className="md:container px-3">
            <Card className="min-h-screen w-full overflow-y-scroll">
                <CardHeader>
                    <CardTitle>1:1 Mentorship Sessions</CardTitle>
                    <CardDescription>Book 1:1 Monthly Mentorship Sessions by coding75 Experts.</CardDescription>
                </CardHeader>
                <Separator className="mb-5" />
                <CardContent>
                <OnlyForPro />
                </CardContent>
            </Card>
        </div>
    );
}

export default Mentorship;