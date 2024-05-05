import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import BookMeeting from "../../(components)/book-meeting";
import { booking_link } from "@/components/social-links";
import SubscriptionCheck from "../../(components)/subscription-check";

const Mentorship = () => {
    return (
        <SubscriptionCheck type="meeting">
            <div className="md:container px-3">
                <Card className="min-h-screen w-full overflow-y-scroll">
                    <CardHeader>
                        <CardTitle>1:1 Mentorship Sessions</CardTitle>
                        <CardDescription>Book 1:1 Monthly Mentorship Sessions by coding75 Experts.</CardDescription>
                    </CardHeader>
                    <Separator className="mb-5" />
                    <CardContent>
                        <BookMeeting
                            link={booking_link}
                            type="1:1 Mentorship"
                            meeting_time={15}
                            meeting_frequency={1}
                        />
                    </CardContent>
                </Card>
            </div>
        </SubscriptionCheck>

    );
}

export default Mentorship;