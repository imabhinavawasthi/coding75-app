"use client";

const OpportunityCard = ({ title, company_name, location, company_logo, apply_link, url_slug }) => {
    return (
        <div>
            <a href={`/opportunities/${url_slug}`}>
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
                                    <p className="text-sm text-gray-600">
                                        {company_name}
                                    </p>
                                    <div className="hidden lg:block md:block w-[1px] h-3 bg-gray-400">
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Batch 2024, 2025
                                    </p>
                                    <div className="hidden lg:block md:block w-[1px] h-3 bg-gray-400">
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                        {location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </a>
        </div>
    );
}

export default OpportunityCard;