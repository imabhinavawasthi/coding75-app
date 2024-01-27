import { Code2Icon, Link2, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ResourceCard2 = ({ heading, description, link, icon, extra_details, trending_tag = undefined }) => {
    return (
        <div>
            <Link href={link}>
                <article className="hidden lg:block md:block hover:bg-gray-100 rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
                    <div className="flex items-start sm:gap-8">
                        <span className="relative flex shrink-0 overflow-hidden w-15 h-15 rounded-full">
                            <Image
                                className="aspect-square object-contain"
                                alt="company_logo" width="48" height="48" src={icon}
                            />
                        </span>

                        <div>
                            {trending_tag && <div
                                className="mb-4"
                            >
                                <span className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white">
                                    {trending_tag}
                                </span>

                            </div>}

                            <h3 className="text-lg font-medium sm:text-xl">
                                {heading}
                            </h3>

                            <p className="mt-1 text-sm text-gray-700">
                                {description}
                            </p>

                            {extra_details &&
                                <div className="mt-4 sm:flex sm:items-center sm:gap-2">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <VideoIcon className="h-4 w-4" />

                                        <p className="text-xs font-medium">Video Editorial</p>
                                    </div>

                                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Code2Icon className="h-4 w-4" />

                                        <p className="text-xs font-medium">Code</p>
                                    </div>
                                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Link2 className="h-4 w-4" />

                                        <p className="text-xs font-medium">Link</p>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </article>
                <article className="lg:hidden md:hidden hover:bg-gray-100 rounded-xl bg-white p-4 ring ring-indigo-50">
                    <div className="flex justify-center items-center gap-4">
                        <span className="relative flex shrink-0 overflow-hidden w-15 h-15 rounded-full">
                            <Image
                                className="aspect-square object-contain"
                                alt="company_logo" width="48" height="48" src={icon}
                            />
                        </span>
                        <h3 className="text-lg font-medium sm:text-xl">
                            {heading}
                        </h3>
                    </div>
                    <p className="mt-4 text-sm text-gray-700">
                        {description}
                    </p>
                    {extra_details &&
                                <div className="mt-4 sm:flex sm:items-center sm:gap-2">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <VideoIcon className="h-4 w-4" />

                                        <p className="text-xs font-medium">Video Editorial</p>
                                    </div>

                                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Code2Icon className="h-4 w-4" />

                                        <p className="text-xs font-medium">Code</p>
                                    </div>
                                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Link2 className="h-4 w-4" />

                                        <p className="text-xs font-medium">Link</p>
                                    </div>
                                </div>}
                </article>
            </Link>
        </div>
    );
}

export default ResourceCard2;