import { whatsapp_link } from "@/components/social-links"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

const faqs = [
    {
        key: "How frequently will classes be held? ",
        value: "Alternate DSA & CP on weekdays at 8 pm and Project Building / CS Fundamental Sessions on weekends. Our schedule ensures regular engagement while allowing flexibility for participants."
    },
    {
        key: "Are class recordings available after the class?",
        value: "Yes, you will get access to the class recording as well as complete class materials."
    },
    {
        key: "What topics will be included in classes?",
        value: "We are providing you a complete interview package; thus, the classes will cover essential topics such as Data Structures and Algorithms (DSA), practical Projects, and fundamental Computer Science concepts to prepare you comprehensively for interviews."
    },
    {
        key: "Will there be development related sessions?",
        value: "Yes, we will have weekly project building sessions on tech stacks like MERN Stack, Next.JS, Java, and Python, enabling hands-on experience and practical application of concepts."
    },
    {
        key: "Where to buy the pro plan from?",
        value: "Visit the pricing section and make your payment. After payment is done, you will receive an email inviting you to join our community group and you will get access to pro portal in our website- coding75.com, where all the details regarding classes and sessions are shared. Pro plans are available on a subscription basis, with options for monthly or yearly plans that can be renewed for continued access to our resources."
    },
    {
        key: "Is there any community support?",
        value: "Yes, with the pro plan, you will gain access to our exclusive community with pro fellows. Our community provides a supportive environment where you can learn from experts, engage with peers, and truly elevate your skills and knowledge. \"Learn from the Experts, Engage with Peers, Be a Pro!\" "
    },
    {
        key: "What is your refund policy?",
        value: "We do not offer refunds for our subscription plans. Once you subscribe, you have access to our classes/sessions and community resources for the duration of your subscription. We are committed to providing you with the best learning experience possible, and we believe that you will find great value in our classes. Therefore, we do not anticipate any requests for refunds. Rest assured, we are dedicated to delivering high-quality education and support to help you achieve your learning goals, and will not make you think of refunds 😉."
    }
]

export default function FAQS() {
    return (
        <div>
            <div>
                <h2 className="text-center mb-10 lg:text-4xl text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white">Have Questions?</h2>
            </div>
            <div className="grid grid-cols-4 mt-5">
                <div className="col-span-1 hidden lg:block md:block"></div>
                <div className="lg:col-span-2 md:col-span-2 col-span-4 lg:px-0 md:px-0 px-10">
                    <Accordion type="single" collapsible className="w-full">
                        {
                            faqs?.map((data, index) => {
                                return (
                                    <AccordionItem key={index} value={`${index}`}>
                                        <AccordionTrigger className="md:text-2xl text-left tracking-tighter font-semibold">{data?.key}</AccordionTrigger>
                                        <AccordionContent >
                                            <p className="md:text-lg text-md tracking-tighter text-left">{data?.value}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })
                        }
                    </Accordion>
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-10 flex justify-center items-center text-center">
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
                <h2 className="text-center mb-10 lg:text-4xl text-2xl tracking-tight font-extrabold text-gray-900 dark:text-white">So, what are you waiting for?</h2>
                <div className="flex justify-center items-center flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <div className='lg:w-1/4 md:w-1/2 w-3/4 hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                        <Link href="#pricing" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            <GraduationCap className="mr-2 -ml-1 w-5 h-5" />
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
