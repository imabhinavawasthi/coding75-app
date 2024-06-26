import { Code2Icon, FileJson, SearchCheck, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import DashboardPic from "../../public/images/dashboard.png"

const features = [
  {
    name: 'DSA CP Resources',
    description:
      'Empower your coding journey with a rich collection of Data Structures and Competitive Programming resources.',
    icon: Code2Icon,
  },
  {
    name: 'Projects',
    description: 'Explore a variety of coding projects—web development, mobile apps, machine learning, and more. ',
    icon: FileJson,
  },
  {
    name: 'Interview Preparation',
    description: 'Complete kit for your interview preparation with resume review, mock interviews and all.',
    icon: SearchCheck,
  },
]

export default function FeatureSection() {
  return (


    <div>


      <div className="overflow-hidden bg-white py-24 sm:py-16 md:px-0 px-3">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-primary-600">1 Stop Solution for All Your Needs</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">coding75 Resources</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  From coding resources and interview prep to career opportunities and a supportive community, we are your one-stop solution for navigating the world of technology and achieving your goals seamlessly.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
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
              </div>
            </div>
            <Link className='hover:scale-75' href="dashboard">
            <Image
              src={DashboardPic}
              alt="Product screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-2xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
