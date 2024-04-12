"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";

const OpportunityCard = ({ title, company_name, location, company_logo, apply_link, batch_eligible, url_slug, experience, skills }) => {
    return (
        <div>
            <Link href={`/opportunities/${url_slug}`}>
                <div className="w-full flex flex-col justify-center items-start h-auto gap-3 p-6 border-gray-500 rounded-xl bg-gray-50 hover:cursor-pointer hover:bg-gray-100 hover:border-gray-600 hover:shadow-lg transition-all duration-500 capitalize">
                    {/* <div className="flex gap-3 self-stretch items-center justify-between flex-wrap">
                        <div className="flex gap-2 items-center flex-wrap">
                            <p className="flex text-sm text-gray-600 capitalize">
                            Batch 2024, 2025</p>
                            <div className="w-[1px] h-3 bg-gray-400">
                            </div>
                            <p className="text-sm text-gray-600">
                                Internship
                            </p>
                            <div className="w-[1px] h-3 bg-gray-400">
                            </div>
                            <p className="text-sm text-gray-600">
                            {location}
                            </p>
                        </div>
                    </div> */}
                    <div className="flex lg:py-2 md:py-1 py-0 gap-3 self-stretch items-start">
                        <span className="relative flex shrink-0 overflow-hidden w-12 h-12 rounded-full">
                            <img className="aspect-square h-full w-full object-contain" alt="company_logo" width="48" height="48" src={company_logo} />
                        </span>
                        <div className="w-full flex flex-col items-start gap-1 flex-wrap">
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-sm md:text-md lg:text-lg">
                                    {title}
                                </p>
                            </div>
                            <div className="w-full flex gap-3 justify-between items-stretch flex-wrap">
                                <div className="lg:flex md:flex grid  gap-x-2 items-center">
                                    <p className="lg:mb-0 md:mb-0 mb-4 text-sm text-gray-600">
                                        <Badge variant="destructive">{company_name}</Badge>
                                    </p>
                                    <div className="hidden lg:block md:block w-[1px] h-3 bg-gray-400">
                                    </div>
                                    {batch_eligible &&
                                        <p className="lg:mb-0 md:mb-0 mb-4 gap-x-1 text-sm text-gray-600">
                                            Batch: {batch_eligible?.map((data) => {
                                                return <>
                                                    <Badge className="mr-1 mb-1" variant="basic">{data}</Badge>
                                                </>
                                            })}
                                        </p>}
                                    {experience &&
                                        <p className="lg:mb-0 overflow-hidden md:mb-0 mb-4 flex gap-x-1 text-sm text-gray-600">
                                            <Badge variant="basic">{experience}</Badge>
                                        </p>}
                                    <div className="hidden lg:block md:block w-[1px] h-3 bg-gray-400">
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                        <Badge variant="secondary">{location}</Badge>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {skills &&
                        <p className="lg:mb-0 md:mb-0 gap-x-1 text-sm text-gray-600">
                            {skills?.map((data) => {
                                return <>
                                    <Badge className="mr-1 mb-1" variant="outline">{data}</Badge>
                                </>
                            })}
                        </p>}
                </div>
            </Link>
        </div>
    );
}

export default OpportunityCard;