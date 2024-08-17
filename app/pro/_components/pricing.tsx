"use client"

import { pro_buy_link, whatsapp_link } from '@/components/social-links';
import { Badge } from '@/components/ui/badge';
import supabase from '@/supabase';
import { BadgePercent, Check, Gem, Rocket, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { toast } from 'sonner';

const Pricing = () => {
    const [launchDate, setLaunchDate] = useState<any>()
    const [surveyFilled, setSurveyFilled] = useState(false)
    const [courseInterest, setCourseInterest] = useState<any>({
        yes: 0,
        no: 0
    })
    const [DBID, setDBID] = useState<any>()
    async function getLaunchDate() {
        try {
            let { data, error } = await supabase
                .from('constants')
                .select('id,launch_date,course_interest,course_not_interested')

            if (error) {
                console.error('Error fetching data:', error);
            }
            else {
                setLaunchDate(data?.[0]?.launch_date)
                setDBID(data?.[0]?.id)
                setCourseInterest({
                    yes: data?.[0]?.course_interest,
                    no: data?.[0]?.course_not_interested,
                })
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
    async function updateCourseInterest(yes: boolean) {
        try {
            if (yes) {
                await supabase
                    .from('constants')
                    .update({ course_interest: courseInterest.yes + 1 })
                    .eq('id', DBID)
            }
            else {
                await supabase
                    .from('constants')
                    .update({ course_not_interested: courseInterest.no + 1 })
                    .eq('id', DBID)
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
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Everything at the <span style={{ color: "#27ae60" }}>cost</span> of less than <span className='text-primary-600'>₹<CountUp start={1000} end={50} />/day</span></h2>
                        <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Our pocket-friendly approach makes high-quality coding education accessible for everyone.</p>
                    </div>
                    <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                        <div className="hidden md:flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
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
                                    <div className='mb-2 mt-8'><Badge className='bg-amber-100 text-amber-700 rounded-sm text-center'>50 % Off<BadgePercent className='h-4 w-4 ml-2' /></Badge></div>
                                    <div className="flex justify-center items-center mb-8">
                                        <span className="mr-2 text-2xl font-extrabold text-gray-600 line-through">₹1999</span>
                                        <span className="mr-2 text-5xl font-extrabold">₹999</span>
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
                                            <span>Live <span className="font-semibold">DSA Problem Solving</span> classes</span>
                                        </li>
                                        <li className="flex items-center space-x-3">
                                            <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                            <span>Live <span className="font-semibold">CP Contest</span> Discussions</span>
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
                                    <a target='_blank' className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">Next Batch Soon</a>
                                    {/* {
                                        launchDate &&
                                        <p className='mt-4 font-semibold tracking-tight'>
                                            Next Batch Starting on &nbsp;
                                            <span className='text-blue-600 font-bold'>{launchDate}</span> - &nbsp;
                                            <span className='text-green-600 font-bold'>Beginner Friendly</span>
                                            .
                                        </p>
                                    } */}
                                    {/* <p className='mt-4 mb-4 font-semibold tracking-tight'>
                                        Beginner Friendly batches are running (Started 15th May) &nbsp;
                                        <span className='text-blue-600 font-bold'>Live Class Recording and 1:1 Sessions Available </span> - &nbsp;
                                        <span className='text-green-600 font-bold'>Join Now</span>
                                        .
                                    </p> */}
                                    <p className='mt-4 mb-4 font-semibold tracking-tight'>
                                        All the slots for current batch are filled &nbsp;
                                        <span className='text-blue-600 font-bold'>Stay Updated </span> - &nbsp;
                                        <span className='text-green-600 font-bold'>Launching Next Batch Soon</span>
                                        .
                                    </p>
                                    <div className="mt-3 mb-3 flex justify-center items-center text-center">
                                        <p className="flex items-center">Still have questions?
                                            <a className="flex items-center" target="_blank" href={whatsapp_link}>
                                                <span className="ml-2 hover:underline flex items-center font-semibold">
                                                    Contact
                                                    <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
                                                    </svg>
                                                    Support
                                                </span>
                                            </a>
                                        </p>
                                    </div>
                                    {/* {
                                        surveyFilled == false &&
                                        <div className='mt-5'>
                                            <p className='font-semibold tracking-tight'>
                                                Survey: Are you interested in joining this?
                                            </p>
                                            <span className="mt-3 inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setSurveyFilled(true)
                                                        updateCourseInterest(true)
                                                        toast.info("Response Saved!")
                                                    }}
                                                    className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                                >
                                                    Yes ✅
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setSurveyFilled(true)
                                                        updateCourseInterest(false)
                                                        toast.info("Response Saved!")
                                                    }}
                                                    className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                                >
                                                    No ❌
                                                </button>
                                            </span>
                                        </div>
                                    }
                                    {
                                        surveyFilled == true &&
                                        <p className='mt-5 font-semibold tracking-tight'>
                                            Response Saved, Thanks!!
                                        </p>
                                    } */}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                            <h3 className="mb-4 text-2xl font-semibold">Self Placed</h3>
                            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">A complete plan for your next one year preparation strategy.</p>
                            <div className='mb-2 mt-8'><Badge className='bg-amber-100 text-amber-700 rounded-sm text-center'>50 % Off<BadgePercent className='h-4 w-4 ml-2' /></Badge></div>
                            <div className="flex justify-center items-center mb-8">
                                <span className="mr-2 text-2xl font-extrabold text-gray-600 line-through">₹15999</span>
                                <span className="mr-2 text-5xl font-extrabold">₹7999</span>
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
                                    <span>Live <span className="font-semibold">DSA Problem Solving</span> classes</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                    <span>Live <span className="font-semibold">CP Contest</span> Discussions</span>
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
                            <a target='_blank' className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">Next Batch Soon</a>
                            {/* {
                                launchDate &&
                                <p className='mt-4 font-semibold tracking-tight'>
                                    Next Batch Starting on &nbsp;
                                    <span className='text-blue-600 font-bold'>{launchDate}</span> -
                                    <span className='text-amber-600 font-bold'>1:1 Personalized Plan Included</span>
                                    .
                                </p>
                            } */}
                            <p className='mt-4 mb-4 font-semibold tracking-tight'>
                                        All the slots for personalised long term mentorship plans are filled &nbsp;
                                        <span className='text-blue-600 font-bold'>Stay Updated </span> - &nbsp;
                                        <span className='text-green-600 font-bold'>Launching Next Batch Soon</span>
                                        .
                                    </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Pricing;