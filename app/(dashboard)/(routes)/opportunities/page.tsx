"use client";

import React, { useEffect, useState } from 'react';
import OpportunityCard from "@/components/cards/opportunity-card";
import { fetchInternships } from './(api)/fetchInternships';
import Loading from '@/components/loading';
import PageHeaderCompanyList from '@/components/page-headers/page-header-company-list';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Terminal } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import UnderlineImage from "../../../(dashboard)/_components/img/underline.png"
import Image from 'next/image';

const OpportunitiesPage = () => {
    const [internshipsList, setInternshipsList] = useState([])
    useEffect(() => {
        async function fetchData() {
            try {
                const { internships } = await fetchInternships({ "slug_url": null });
                setInternshipsList(internships);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [])
    return (
        <div>
            <div>
                <PageHeaderCompanyList
                    focusHeading="Opportunities"
                    heading="Launch Your Career Journey 🚀"
                />
            </div>

            <div className='container mt-4'>
                <Alert className='mb-2'>
                    <Terminal className="h-4 w-4 " />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        Join Our <h1 className="inline relative mb-4 font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                            <a target="_blank" href="https://telegram.me/cpabhinav">
                            <span className="text-blue-800">
                                Telegram Channel
                            </span>
                            <Image
                                src={UnderlineImage}
                                alt="underline"
                                className="mt-1 h-2 absolute top-2 left-0"
                            />
                            </a>
                        </h1> and Stay Updated with all the latest Opportunities.
                    </AlertDescription>
                </Alert>

                <div className='lg:hidden'>
                    <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Filter className='w-4 h-4 mr-2' /> Filter</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle><Filter className='w-4 h-4 mr-2' /> Filter</DialogTitle>
                                <DialogDescription>
                                    Find opportunity that fits you right.
                                </DialogDescription>
                            </DialogHeader>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Select>
                                            <SelectTrigger id="batch">
                                                <SelectValue placeholder="Select Your Batch" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="all">All Batches</SelectItem>
                                                <SelectItem value="2023">Batch 2023</SelectItem>
                                                <SelectItem value="2024">Batch 2024</SelectItem>
                                                <SelectItem value="2025">Batch 2025</SelectItem>
                                                <SelectItem value="2026">Batch 2026</SelectItem>
                                                <SelectItem value="2027">Batch 2027</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-6">
                    <div className='col-span-4 lg:col-span-1 hidden lg:block'>
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex justify-center items-center gap-x-2 text-lg'><Filter className='w-4 h-4' /> Filter</CardTitle>
                                    <CardDescription>Find opportunity that fits you right.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                        <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-1.5">
                                                <Select>
                                                    <SelectTrigger id="batch">
                                                        <SelectValue placeholder="Select Your Batch" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="all">All Batches</SelectItem>
                                                        <SelectItem value="2023">Batch 2023</SelectItem>
                                                        <SelectItem value="2024">Batch 2024</SelectItem>
                                                        <SelectItem value="2025">Batch 2025</SelectItem>
                                                        <SelectItem value="2026">Batch 2026</SelectItem>
                                                        <SelectItem value="2027">Batch 2027</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    {internshipsList? <div className="flex flex-col col-span-4 lg:col-span-3">
                        {internshipsList?.map((internship, index) => (
                            <div
                                key={index}
                                className='mb-4'
                            >
                                <OpportunityCard

                                    title={internship?.internship_title}
                                    company_name={internship?.company_name}
                                    location={internship?.internship_location}
                                    company_logo={internship?.company_logo || "https://cdn-icons-png.flaticon.com/512/3666/3666417.png"}
                                    apply_link={internship?.apply_link}
                                    url_slug={internship?.url_slug}
                                />
                            </div>
                        ))}
                    </div> :
                        <Loading title="Fetching Opportunities" />}
                </div>
            </div>

        </div>
    );
}

export default OpportunitiesPage;