"use client"

import DashboardCard from "@/components/cards/dashboard-card";
import { BarChart2, Briefcase, ChefHat, ChevronRight, Code2, Code2Icon, Cpu, FileJson, GitCompare, LineChart, Rocket, SearchCheck, UserCheck } from "lucide-react";
import DashboardHeader from "./_components/dashboard-header";
import ProductCard from "@/components/cards/product-card";
import ImageFlipCard from "@/components/cards/image-flip-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
              heading="CP Specialist Sheet"
              description="Handpicked Important CP Problems from Codeforces & Codechef"
              href="/dsa-cp/sheets/specialist-sheet"
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
                image1="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/resume-1.png"
                image2="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/images/resume-2.png"
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
                        Join coding75 Pro <ChevronRight className="h-4 w-4 animate-ping"/>
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
