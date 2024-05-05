import { cn } from "@/lib/utils";
import { AlarmClock, Book, CalendarClock, Clock, Code2Icon, ExternalLink, FileVideo, FileVideo2, Link2, Pin, PlayCircleIcon, Radio, UserCircle, Video, VideoIcon } from "lucide-react";
import Link from "next/link";

function convertEpochToIST(epochSeconds) {
    // Convert epoch seconds to milliseconds
    var date = new Date((epochSeconds - 19800) * 1000);

    // Adjust time to IST (Indian Standard Time, UTC+5:30)
    date.setHours(date.getHours() + 5); // Add 5 hours for IST
    date.setMinutes(date.getMinutes() + 30); // Add 30 minutes for IST

    // Format date as per the specified format
    var hours = date.getHours();
    var minutes: any = date.getMinutes();
    var period = (hours >= 12) ? "PM" : "AM";
    hours = (hours > 12) ? hours - 12 : hours;
    hours = (hours == 0) ? 12 : hours; // Handle midnight
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    // Format date
    var formattedDate = hours + ":" + minutes + " " + period + ", " + date.getDate() + "th " + getMonthName(date.getMonth());

    return formattedDate;
}

function getMonthName(monthIndex) {
    var months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthIndex];
}


const ResourceCard = ({ heading, link, sub_title, instructor_name, class_duration, class_subtopics = [], class_timing, type, class_recording = null, class_notes = null, class_resources = false }:any) => {
    return (
        <div>
            <Link
                href={link}
                className={cn(type == "live" && "bg-blue-50", "relative block overflow-hidden rounded-lg border shadow-md hover:shadow-inner border-gray-300 p-6 px-6")}
            >
                <span
                    className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600"
                ></span>
                <div className="mb-4 lg:mb-0 sm:flex sm:justify-between sm:gap-4">
                    <div>
                        <h3 className="mr-2 mb-2 hover:underline text-lg font-medium sm:text-xl text-gray-900">
                            {heading}
                        </h3>
                        <div className="flex items-center">
                            <CalendarClock className="h-3 w-3 mr-1" />
                            <p className="text-xs">{convertEpochToIST(class_timing)}</p>
                        </div>
                        <p className="mt-1 text-xs font-medium text-gray-600">{sub_title}</p>
                    </div>
                    <div className="hidden sm:block sm:shrink-0">
                        {
                            type == "upcoming" &&
                            <Clock strokeWidth={1} className="w-6 h-6 text-blue-600" />
                        }
                        {
                            type == "past" &&
                            <FileVideo strokeWidth={1} className="w-6 h-6 text-blue-600" />
                        }
                        {
                            type == "live" &&
                            <Radio strokeWidth={1} className="w-6 h-6 text-red-600 animate-ping" />
                        }

                    </div>
                </div>
                <div className="mt-4 mb-2 sm:flex sm:items-center sm:gap-2">
                    <div className="flex items-center gap-1 text-gray-500">
                        <UserCircle className="h-4 w-4" />
                        <p className="text-xs font-medium">{instructor_name}</p>
                    </div>
                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>
                    <div className="flex items-center gap-1 text-gray-500">
                        <AlarmClock className="h-4 w-4" />
                        <p className="text-xs font-medium">{class_duration} Minutes</p>
                    </div>
                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                    <div className="flex items-center gap-1 text-gray-500">
                        <Radio className="h-4 w-4" />
                        <p className="text-xs font-medium">Live Class</p>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                    {class_subtopics.map((tag) => (
                        <span key={tag}
                            className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                {
                    class_resources &&
                    <div className="grid mt-5 md:grid-cols-2 gap-x-5 gap-y-5 grid-cols-1">
                        {
                            class_recording ?
                                <span className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 justify-center flex items-center w-full">
                                    Class Recording <Video className="h-4 w-4 ml-2" />
                                </span>
                                :
                                <>
                                    <span className="text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 justify-center flex items-center w-full">
                                        Class Recording (Updating Soon) <Clock className="h-4 w-4 ml-2" />
                                    </span>
                                </>

                        }
                        {
                            class_notes ?
                                <span className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 justify-center dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex items-center w-full">
                                    Class Notes <Book className="h-4 w-4 ml-2" />
                                </span>
                                :
                                <>
                                    <span className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 justify-center flex items-center w-full">
                                        Class Notes (Updating Soon) <Clock className="h-4 w-4 ml-2" />
                                    </span>
                                </>
                        }
                    </div>
                }
            </Link>
        </div>
    );
}

export default ResourceCard;