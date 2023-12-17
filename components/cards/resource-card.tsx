import { Code2Icon, Link2, Pin, PlayCircleIcon, VideoIcon } from "lucide-react";
import { Button } from "../ui/button";

const ResourceCard = ({heading, description, link, sub_title}) => {
    return (
        <div>
            <a
                href={link}
                className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
            >
                <span
                    className="absolute inset-x-0 bottom-0 h-2 bg-indigo-600"//bg-gradient-to-r from-green-300 via-blue-500 to-purple-600
                ></span>

                <div className="mb-4 lg:mb-0 sm:flex sm:justify-between sm:gap-4">
                    <div>
                        <h3 className="hover:underline text-lg font-medium sm:text-xl text-gray-900">
                            {heading}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-gray-600">📌 {sub_title}</p>
                    </div>

                    <div className="hidden sm:block sm:shrink-0">
                        <PlayCircleIcon strokeWidth={1} className="w-16 h-16 text-indigo-500"/>
                    </div>
                </div>

                <div >
                    <p className="max-w-[40ch] text-sm text-gray-500">
                        {description}
                    </p>
                </div>
                <div className="mt-4 lg:mb-4 mb-4 sm:flex sm:items-center sm:gap-2">
                        <div className="flex items-center gap-1 text-gray-500">
                            <VideoIcon className="h-4 w-4"/>

                            <p className="text-xs font-medium">Video Editorial</p>
                        </div>

                        <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                        <div className="flex items-center gap-1 text-gray-500">
                            <Code2Icon className="h-4 w-4"/>

                            <p className="text-xs font-medium">Code</p>
                        </div>
                        <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                        <div className="flex items-center gap-1 text-gray-500">
                            <Link2 className="h-4 w-4"/>

                            <p className="text-xs font-medium">Link</p>
                        </div>
                    </div>
                    <div className="w-full">
                    <Button className="min-w-full lg:hidden hover:border-indigo-500 bg-indigo-500 hover:bg-white hover:text-indigo-800">Start Solving →</Button>
                    </div>
            </a>
        </div>
    );
}

export default ResourceCard;