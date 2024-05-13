import SubscriptionCheck from "../../(components)/subscription-check";
import SchedulePage from "./schedule-page";

const Schedule = () => {
    return (
        <div>
            <SubscriptionCheck type={"live"}>
                <SchedulePage />
            </SubscriptionCheck>
        </div>
    );
}

export default Schedule;