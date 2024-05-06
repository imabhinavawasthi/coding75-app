"use client"

import DashboardCard from "@/components/cards/dashboard-card";
import { BarChart2, Briefcase, ChefHat, ChevronRight, Code2, Code2Icon, Cpu, FileJson, GitCompare, LineChart, Rocket, SearchCheck, UserCheck, Users } from "lucide-react";
import DashboardHeader from "./_components/dashboard-header";
import ProductCard from "@/components/cards/product-card";
import ImageFlipCard from "@/components/cards/image-flip-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image1 from "../../../../public/images/resume-1.png"
import Image2 from "../../../../public/images/resume-2.png"
import { pro_discussion_group, pro_updates_group } from "@/components/social-links";

const features = [
  {
    name: 'Live DSA & CP Classes',
    description:
      'Daily live classes covering all the important concepts of DSA & CP with problem solving sessions.',
    icon: Code2Icon,
  },
  {
    name: 'Weekly Project Sessions',
    description: 'Hands-on learning with live project sessions, covering both frontend and backend development with Next.js, Python, Node.js etc.',
    icon: FileJson,
  },
  {
    name: 'Interview Preparation',
    description: 'Interview specific preparation of CS fundamentals topics like operating system, computer system, DBMS and interview specific tips and guidance.',
    icon: SearchCheck,
  },
  {
    name: 'Mock Interviews',
    description: 'Personalized 1:1 mock interviews, tailored to boost your confidence and readiness for success.',
    icon: UserCheck,
  },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mx-5 md:container">
        <DashboardHeader />
        <div className='mb-4 mt-5 md:mt-4 md:flex items-center justify-center '>
          <a className="flex justify-center items-center" target="_blank" href={pro_updates_group}>
            <span className="ml-2 hover:underline flex items-center font-semibold">
              Join coding75 Pro Updates
              <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
              </svg>
              Group
            </span>
          </a>
          <Users className='hidden md:block h-4 w-4 mx-3' />
          <a className="md:mt-0 mt-3 flex justify-center items-center" target="_blank" href={pro_discussion_group}>
            <span className="ml-2 hover:underline flex items-center font-semibold">
              Join coding75 Pro Discussion
              <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
              </svg>
              Group
            </span>
          </a>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-md text-gray-600 font-semibold">DSA & CP Zone</p>
          <div className=" grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Solve Today's POTD"
              heading="Leetcode"
              description="Leetcode Daily Problem with Proper Video Editorial"
              href="/dsa-cp/leetcode-potd"
              icon={Code2}
            />
            <DashboardCard
              title="Contest Solutions"
              heading="Codeforces"
              description="Video Editorial of All Codeforces Contests"
              href="/dsa-cp/codeforces"
              icon={BarChart2}
            />
            <DashboardCard
              title="Contest Solutions"
              heading="Codechef"
              description="Video Editorial of All Codechef Contests"
              href="/dsa-cp/codechef"
              icon={ChefHat}
            />
            <DashboardCard
              title="Interview Preparation"
              heading="CP Expert Sheet"
              description="Handpicked Important CP Problems from Codeforces & Codechef"
              href="/dsa-cp/sheets/expert-sheet"
              icon={LineChart}
            />
          </div>
        </div>
        <div className="mt-10">
          <p className="mb-2 text-md text-gray-600 font-semibold">Interview Preparation Zone</p>
          <div className="grid gap-4 md:grid-cols-3">
            <ProductCard
              title="Projects"
              description="Explore a diverse range of projects that span various domains, including web development, mobile app creation, machine learning, and more."
              href="/projects"
              href_text="Explore Projects"
              icon={Code2}
            />
            <ProductCard
              title="CS Fundamentals"
              description="Operating Systems, Computer Networks, Database Management Systems, and Object-Oriented Programming Interview Specific Resources."
              href="/cs-fundamentals"
              href_text="Learn CS Fundamentals"
              icon={Cpu}
            />
            <ProductCard
              title="Internships"
              description="Stay ahead in your coding career by exploring the vast array of opportunities presented by Coding75 and propel yourself into the forefront of the tech industry."
              href="/opportunities"
              href_text="Explore Opportunities"
              icon={Briefcase}
            />
          </div>
        </div>
        <div className="mt-10">
          <p className="mb-2 text-md text-gray-600 font-semibold">coding75 Exclusives</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="hidden md:block">
              <ImageFlipCard
                image1={Image1}
                image2={Image2}
                title="Resume Builder"
                description="Create an ATS Friendly Latex Resume 🚀"
                href="/resume"
                href_text="Build Resume"
              />
            </div>
            <div className="col-span-2 md:mx-10">
              <Card>
                <CardHeader>
                  <h2 className="text-base font-semibold leading-7 text-primary-600">Learn from the Experts, Engage with Peers, Be a Pro! 🚀</h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center">coding75 Pro <Rocket className="ml-2 text-primary-600" /></p>
                </CardHeader>
                <CardContent>
                  <div>
                    <dl className="space-y-4 text-base leading-7 text-gray-600 lg:max-w-none">
                      {features.map((feature) => (
                        <div key={feature.name} className="relative pl-9">
                          <dt className="inline font-semibold text-gray-900">
                            <feature.icon className="absolute left-1 top-1 h-5 w-5 text-primary-600" aria-hidden="true" />
                            {feature.name}
                          </dt>{' '}
                          <dd className="inline">{feature.description}</dd>
                        </div>
                      ))}
                    </dl>
                    <Link href="/pro">
                      <Button className="flex items-center mt-5 bg-primary-600 hover:bg-primary-700 text-white">
                        Join coding75 Pro <ChevronRight className="h-4 w-4 animate-ping" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
