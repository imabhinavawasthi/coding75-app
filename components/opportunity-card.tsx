import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

const OpportunityCard = () => {
    return (
        <div className="mt-3 shadow-lg hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-full">
            <div className="shadow-lg rounded-2xl bg-white dark:bg-gray-800 p-4">
                <div className="flex-row gap-4 flex justify-center items-center">
                    <div className="hidden md:block">
                        <Image
                            alt="profil"
                            src="/logo.png"
                            width={500}
                            height={500}
                            className="mx-auto object-cover rounded-full h-16 w-16 "
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-medium text-gray-600 dark:text-white">
                            Frontend Developement Job
                        </span>
                        <span className="text-xs text-gray-400">
                            crackDSA
                        </span>
                        <span className="text-xs text-gray-400 lg:hidden">
                            Batch 2024, 2025
                        </span>
                    </div>
                    <div className="hidden lg:flex lg:flex-col md:mr-16">
                        <span className="text-lg font-medium text-gray-600 dark:text-white">
                            Batch 2024, 2025
                        </span>
                        <span className="text-xs text-gray-400">
                            Bangalore
                        </span>
                    </div>
                    <div className="hidden sm:flex sm:flex-col">
                        <Button>
                            <ExternalLink className="mr-2 w-5 h-5" />
                            Apply
                        </Button>
                    </div>
                </div>
                <div className="mt-3 flex-row flex justify-center items-center sm:hidden">
                        <Button className="w-full">
                            <ExternalLink className="mr-2 w-5 h-5" />
                            Apply
                        </Button>
                </div>
            </div>
        </div>
    );
}

export default OpportunityCard;