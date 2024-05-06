import { Separator } from "@/components/ui/separator";
import OnlyForPro from "../../(components)/only-for-pro";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Clock, Radio } from "lucide-react";
import BookMeeting from "../../(components)/book-meeting";
import { booking_link } from "@/components/social-links";
import SubscriptionCheck from "../../(components)/subscription-check";

const MockInterview = () => {
    return (
        <SubscriptionCheck type="meeting">
            <div className="md:container px-3">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Mock Interview</CardTitle>
                        <CardDescription>Book 1:1 Mock Interview by coding75 Experts.</CardDescription>
                    </CardHeader>
                    <Separator className="mb-5" />
                    <CardContent>
                        <BookMeeting
                            link={booking_link}
                            type="1:1 Mock Interview"
                            meeting_time={45}
                            meeting_frequency={3}
                        />
                    </CardContent>
                </Card>
            </div>
        </SubscriptionCheck>
    );
}

export default MockInterview;