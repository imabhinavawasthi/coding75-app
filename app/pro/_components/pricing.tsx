"use client"

import { Badge } from '@/components/ui/badge';
import supabase from '@/supabase';
import { Check, Gem, Rocket, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const Pricing = () => {
    const [launchDate, setLaunchDate] = useState<any>()
    async function getLaunchDate() {
        try {
            let { data, error } = await supabase
                .from('constants')
                .select('launch_date')

            if (error) {
                console.error('Error fetching data:', error);
            }
            else {
                setLaunchDate(data?.[0]?.launch_date)
            }

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
    useEffect(() => {
        getLaunchDate()
    }, [])
    return (
        <div>
            <section>
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Everything at the <span style={{ color: "#27ae60" }}>cost</span> of less than <span className='text-primary-600'>₹<CountUp start={1000} end={20} />/day</span></h2>
                        <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Our pocket-friendly approach makes high-quality coding education accessible for everyone.</p>
                    </div>
                    <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                            <h3 className="mb-4 text-2xl font-semibold">Basic</h3>
                            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Get access to free resources and opportunity updates.</p>
                            <div className="flex justify-center items-baseline my-8">
                                <span className="mr-2 text-5xl font-extrabold">₹0</span>
                                <span className="text-gray-500 dark:text-gray-400">/month</span>
                            </div>
                            <ul role="list" className="mb-8 space-y-4 text-left">
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Youtube Videos & Resources</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Opportunity Updates</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <X className="flex-shrink-0 w-5 h-5 text-red-500 dark:text-red-400" />
                                    <span>Live <span className="font-semibold">DSA and CP</span> classes</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <X className="flex-shrink-0 w-5 h-5 text-red-500 dark:text-red-400" />
                                    <span>1:1 <span className="font-semibold">Mock Interviews</span></span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <X className="flex-shrink-0 w-5 h-5 text-red-500 dark:text-red-400" />
                                    <span>Personalized<span className="font-semibold"> Resume Review</span></span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <X className="flex-shrink-0 w-5 h-5 text-red-500 dark:text-red-400" />
                                    <span>Live<span className="font-semibold"> Project Building</span> Sessions</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <X className="flex-shrink-0 w-5 h-5 text-red-500 dark:text-red-400" />
                                    <span>1:1<span className="font-semibold"> Mentorship</span> Sessions</span>
                                </li>
                            </ul>
                            <a href="https://telegram.me/coding75" target="_blank" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">Join Now</a>
                        </div>
                        <div className='scale-105'>
                            <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                <div className="shadow-2xl z-40 flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                    <div className='mb-2'><Badge className='bg-primary-100 text-primary-700 rounded-sm text-center'>Most Popular <Rocket className='h-4 w-4 ml-2' /></Badge></div>
                                    <h3 className="mb-4 text-2xl font-semibold">Pro</h3>
                                    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Relevant for beginners, live classes and mentorship sessions.</p>
                                    <div className="flex justify-center items-baseline my-8">
                                        <span className="mr-2 text-5xl font-extrabold">₹499</span>
                                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                                    </div>
                                    <ul role="list" className="mb-8 space-y-4 text-left">
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>Youtube Videos & Resources</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>Opportunity Updates</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>Live <span className="font-semibold">DSA and CP</span> classes</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>1:1 <span className="font-semibold">Mock Interviews</span></span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>Personalized<span className="font-semibold"> Resume Review</span></span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>Live<span className="font-semibold"> Project Building</span> Sessions</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>1:1<span className="font-semibold"> Mentorship</span> Sessions</span>
                                        </li>
                                    </ul>
                                    <a className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">Launching Soon ⏰</a>
                                    {
                                        launchDate &&
                                        <p className='mt-4 font-semibold tracking-tight'>
                                            Next Batch Starting on &nbsp;
                                             <span className='text-blue-600 font-bold'>{launchDate}</span> - &nbsp;
                                             <span className='text-green-600 font-bold'>Beginner Friendly</span>
                                             .
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                            <h3 className="mb-4 text-2xl font-semibold">Self Placed</h3>
                            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">A complete plan for your next one year preparation strategy.</p>
                            <div className="flex justify-center items-baseline my-8">
                                <span className="mr-2 text-5xl font-extrabold">₹3999</span>
                                <span className="text-gray-500 dark:text-gray-400">/year</span>
                            </div>
                            <ul role="list" className="mb-8 space-y-4 text-left">
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Youtube Videos & Resources</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Opportunity Updates</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Live <span className="font-semibold">DSA and CP</span> classes</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>1:1 <span className="font-semibold">Mock Interviews</span></span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Personalized<span className="font-semibold"> Resume Review</span></span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Live<span className="font-semibold"> Project Building</span> Sessions</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>1:1<span className="font-semibold"> Mentorship</span> Sessions</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Gem className="flex-shrink-0 w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                                    <span>Personalised<span className="font-semibold"> preparation plan</span> for 1 year</span>
                                </li>
                            </ul>
                            <a className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">
                                Launching Soon ⏰
                            </a>
                            {
                                        launchDate &&
                                        <p className='mt-4 font-semibold tracking-tight'>
                                            Next Batch Starting on &nbsp;
                                             <span className='text-blue-600 font-bold'>{launchDate}</span> - 
                                             <span className='text-amber-600 font-bold'>1:1 Personalized Plan Included</span>
                                             .
                                        </p>
                                    }
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Pricing;