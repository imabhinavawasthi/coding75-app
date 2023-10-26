import { Building, ExternalLink, GraduationCap, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const OpportunityCard = ({ title, company_name, location, company_logo, apply_link, url_slug }) => {
    return (
        <div>
            <div className="mt-3 shadow-lg hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-full">
                <div className="shadow-lg rounded-2xl bg-white dark:bg-gray-800 p-4">
                    <div className="flex-row gap-4 flex justify-center items-center">
                        <div className="hidden lg:block lg:mr-10">
                            <img
                                alt="company_logo"
                                src={company_logo}
                                className="mx-auto object-cover rounded-full h-16 w-16 "
                            />
                        </div>
                        <div className="flex flex-col mr-10">
                            <Link href={`/opportunities/${url_slug}`}>
                                <span className="text-lg font-medium text-indigo-800 dark:text-white">
                                    {title}
                                </span>
                            </Link>

                            <span className="text-md text-gray-400 flex items-center">
                                <Building size={18} />&nbsp;{company_name}
                            </span>
                            <span className="text-sm text-gray-400 flex items-center">
                                <GraduationCap size={16} />&nbsp;Batch 2024, 2025
                            </span>
                            <span className="text-sm text-gray-400 flex items-center">
                                <MapPin size={16} />&nbsp;{location}
                            </span>
                        </div>
                        {/* <div className="hidden lg:flex lg:flex-col md:mr-16">
                        <span className="text-lg font-medium text-gray-600 dark:text-white">
                            Batch 2024, 2025
                        </span>
                        <span className="text-xs text-gray-400">
                            {location}
                        </span>
                    </div> */}
                        <div className="hidden sm:flex sm:flex-col">
                            <a href={apply_link} target="_blank" className="w-full">
                                <Button className="w-full">
                                    <ExternalLink className="mr-2 w-5 h-5" />
                                    Apply
                                </Button>
                            </a>
                        </div>
                    </div>
                    <div className="mt-3 flex-row flex justify-center items-center sm:hidden">
                        <a href={apply_link} target="_blank" className="w-full">
                            <Button className="w-full">
                                <ExternalLink className="mr-2 w-5 h-5" />
                                Apply
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OpportunityCard;