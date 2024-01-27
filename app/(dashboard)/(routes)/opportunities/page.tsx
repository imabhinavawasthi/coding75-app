"use client";

import React, { useEffect, useState } from 'react';
import OpportunityCard from "@/components/cards/opportunity-card";
import { fetchInternships } from './(api)/fetchInternships';
import Loading from '@/components/loading';
import PageHeaderCompanyList from '@/components/page-headers/page-header-company-list';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Info, RotateCcw, Shapes, Terminal } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InfoBanner from '../../_components/info-banner';
import { Separator } from '@/components/ui/separator';
import ErrorBanner from '../../_components/error-banner';

const OpportunitiesPage = () => {
    const [internshipsList, setInternshipsList] = useState([])
    const [batch, setBatch] = useState("all")
    const [status, setStatus] = useState("loading")
    const [cardCount, setCardCount] = useState(20)
    async function fetchData(batchSelect = "all") {
        setStatus("loading")
        try {
            if (batchSelect == "all") {
                const { internships } = await fetchInternships(undefined, undefined);
                internships.sort(function (a, b) {
                    var keyA = new Date(a.created_at),
                        keyB = new Date(b.created_at);
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                });
                setInternshipsList(internships);
            }
            else {
                const { internships } = await fetchInternships(undefined, batchSelect);
                internships.sort(function (a, b) {
                    var keyA = new Date(a.created_at),
                        keyB = new Date(b.created_at);
                    if (keyA < keyB) return 1;
                    if (keyA > keyB) return -1;
                    return 0;
                });
                setInternshipsList(internships);
            }
            setStatus("done")

        } catch (error) {
            setStatus("error")
            console.error("Error fetching data:", error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    function setBatchChange(e: any) {
        console.log(e);
        setBatch(e)
        fetchData(e)
    }
    return (
        <div>
            <div>
                <PageHeaderCompanyList
                    focusHeading="Opportunities"
                    heading="Launch Your Career Journey 🚀"
                />
            </div>

            <div className='container mt-4'>
                <a target="_blank" href="https://telegram.me/cpabhinav">
                    <Alert className='mb-2'>
                        <Shapes className="h-4 w-4 " />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            Join Our <h1 className="inline relative mb-4 font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                                <span className="text-blue-800">
                                    Telegram Channel
                                </span>

                            </h1> and Stay Updated with all the latest Opportunities.
                        </AlertDescription>
                    </Alert>
                </a>
                <Separator className='my-4' />
                <div className='lg:hidden mb-4'>
                    <div className='w-full'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='w-full' variant="outline"><Filter className='w-4 h-4 mr-2' /> Filter</Button>
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
                                            <Select
                                                defaultValue={batch}
                                                onValueChange={(e) => setBatchChange(e)}
                                            >
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
                                                <Select
                                                    defaultValue={batch}
                                                    onValueChange={(e) => setBatchChange(e)}
                                                >
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
                    <div className="flex flex-col col-span-4 lg:col-span-3">
                        {(status == "done") ?
                            <>
                                {(internshipsList.length > 0) ? <>
                                    {internshipsList.slice(0,cardCount)?.map((internship, index) => (
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
                                                batch_eligible={internship?.batch_eligible}
                                                url_slug={internship?.url_slug}
                                            />
                                        </div>
                                    ))}
                                    {cardCount < internshipsList.length ? <>
                                        <Button onClick={(e) => setCardCount(cardCount + 10)} variant='outline'><RotateCcw className='h-4 w-4 mr-2' /> Load More Opportunities</Button>
                                    </> : <>
                                        <a target="_blank" href="https://telegram.me/cpabhinav">
                                            <Alert className='mt-4'>
                                                <Info className='h-4 w-4'/>
                                                <AlertTitle>No More Opportunities!</AlertTitle>
                                                <AlertDescription>
                                                    Join Our <h1 className="inline relative mb-4 font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                                                        <span className="text-blue-800">
                                                            Telegram Channel
                                                        </span>

                                                    </h1> and Stay Updated with all the latest Opportunities.
                                                </AlertDescription>
                                            </Alert>
                                        </a>
                                    </>}

                                </>
                                    :
                                    <>
                                        <InfoBanner message="No Opportunities" description='Please reset your filters to view all opportunities' />
                                    </>}
                            </>
                            :
                            <>
                                {status == "loading" ? <>
                                    <Loading title="Fetching Opportunities" />
                                </> : <>
                                    <ErrorBanner />
                                </>}
                            </>
                        }
                    </div>
                </div>
            </div>

        </div>
    );
}

export default OpportunitiesPage;