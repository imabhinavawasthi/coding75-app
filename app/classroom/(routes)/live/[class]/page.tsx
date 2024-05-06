import LiveClassPage from "@/app/classroom/(components)/live-class-page";
import SubscriptionCheck from "@/app/classroom/(components)/subscription-check";

const ClassDetailsPage = ({ params }) => {
    return (
        <div>
            <SubscriptionCheck type="live">
                <LiveClassPage class_url={params?.class} />
            </SubscriptionCheck>
        </div>
    );
}

export default ClassDetailsPage;