import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { GraduationCap, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function FAQS() {
    return (
        <div>
            <div>
                <h2 className="text-center mb-10 lg:text-6xl text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Have Questions?</h2>
            </div>
            <div className="grid grid-cols-4 mt-5">
                <div className="col-span-1 hidden lg:block md:block"></div>
                <div className="lg:col-span-2 md:col-span-2 col-span-4 lg:px-0 md:px-0 px-10">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xl">Is it accessible?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-xl">Is it styled?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It comes with default styles that matches the other
                                components&apos; aesthetic.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-xl">Is it animated?</AccordionTrigger>
                            <AccordionContent>
                                Yes. It&apos;s animated by default, but you can disable it if you prefer.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <div className="mt-20">
            <h2 className="text-center mb-10 lg:text-6xl text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">So, what are you waiting for?</h2>
                <div className="flex justify-center items-center flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <div className='lg:w-1/4 md:w-1/2 w-3/4 hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                        <Link href="#pricing" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            <GraduationCap className="mr-2 -ml-1 w-5 h-5" />
                            Purchase Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
