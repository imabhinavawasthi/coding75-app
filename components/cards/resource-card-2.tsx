import { Code2Icon, Link2, VideoIcon } from "lucide-react";

const ResourceCard2 = ({heading, description, link, icon, extra_details, trending_tag}) => {
    return (
        <div>
            <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
                <div className="flex items-start sm:gap-8">
                    <div
                        className="hidden sm:grid sm:h-20 sm:w-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-indigo-500"
                        aria-hidden="true"
                    >
                        <div className="flex items-center gap-1 indigo-500">
                            {icon}
                        </div>
                    </div>

                    <div>
                        {trending_tag&&<strong
                            className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                        >
                            {trending_tag}
                        </strong>}

                        <h3 className="mt-4 text-lg font-medium sm:text-xl">
                            <a href={link} className="hover:underline"> {heading} </a>
                        </h3>

                        <p className="mt-1 text-sm text-gray-700">
                            {description}
                        </p>

                        {extra_details&&
                        <div className="mt-4 sm:flex sm:items-center sm:gap-2">
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
                    </div>}
                    </div>
                </div>
            </article>
        </div>
    );
}

export default ResourceCard2;