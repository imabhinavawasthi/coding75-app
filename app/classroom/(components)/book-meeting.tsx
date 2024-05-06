import { AlarmClock, Clock, Dot, Info, Radio } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BookMeeting = ({ link, type, meeting_time, meeting_frequency }: any) => {
    return (
        <div>
            <Alert className="mb-5">
                <Info className="h-4 w-4" />
                <AlertTitle className="mb-3">Booking Instructions - Please read before booking your session.</AlertTitle>
                <AlertDescription>
                    <p className="flex items-center">
                        <Dot className="mr-2" />
                        <strong>You can book a {type} session in every {meeting_frequency}{meeting_frequency == 1 ? " month" : " months"}</strong> .
                    </p>
                    <p className="flex items-center">
                        <Dot className="mr-2" />
                        Please remember to attend the session after booking it, or cancel it on time in case of any problem, otherwise the session will be considered held.
                    </p>
                    <p className="flex items-center">
                        <Dot className="mr-2" />
                        Be prepared with all your doubts, your resume, and questions you want to ask in your session.
                    </p>
                    <p className="flex items-center">
                        <Dot className="mr-2" />
                        If your mentor doesn&apos;t joins the session on time, do contact our whatsapp support.
                    </p>
                </AlertDescription>
            </Alert>
            <div>
                <a
                    target="_blank"
                    href={link}
                    className="relative block overflow-hidden rounded-lg border shadow-md hover:shadow-inner border-gray-300 p-6 px-6"
                >
                    <span
                        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600"
                    ></span>
                    <div className="mb-4 lg:mb-0 sm:flex sm:justify-between sm:gap-4">
                        <div>
                            <h3 className="mr-2 mb-2 hover:underline text-lg font-medium sm:text-xl text-gray-900">
                                Book a {type} Session
                            </h3>
                            <p className="mt-1 text-xs font-medium text-gray-600">{"1:1 Personalized Session"}</p>
                        </div>
                        <div className="hidden sm:block sm:shrink-0">
                            <Clock strokeWidth={1} className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 mb-2 sm:flex sm:items-center sm:gap-2">
                        <div className="flex items-center gap-1 text-gray-500">
                            <AlarmClock className="h-4 w-4" />
                            <p className="text-xs font-medium">{meeting_time} Minutes</p>
                        </div>
                        <span className="hidden sm:block" aria-hidden="true">&middot;</span>
                        <div className="flex items-center gap-1 text-gray-500">
                            <Radio className="h-4 w-4" />
                            <p className="text-xs font-medium">Live Meeting</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default BookMeeting;