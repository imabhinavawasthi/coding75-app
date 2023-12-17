'use client';

import Image from 'next/image';
import { Fragment, useState } from 'react'
import { Dialog, Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, Menu, RocketIcon, TargetIcon, Users, X } from 'lucide-react';

const navigation = [
    { name: 'Projects', href: '/projects' },
    { name: 'DSA/CP', href: '/dsa-cp' },
    { name: 'Interview Preparation', href: '/interview-preparation' },
    { name: 'Internships', href: '/opportunities' },
]

const callsToAction = [
    { name: 'Watch demo', href: '#', icon: ChevronDownIcon },
    { name: 'Contact sales', href: '#', icon: ChevronDownIcon },
]

const products = [
    { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChevronDownIcon },
    { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: ChevronDownIcon },
    { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: ChevronDownIcon },
    { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: ChevronDownIcon },
    { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ChevronDownIcon },
]

export default function HeaderSection() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div>
            <div className="bg-white">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <a href='/' className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <Image
                                    className="h-8 w-auto"
                                    src="/logo-bg.png"
                                    alt=""
                                    width={500}
                                    height={500}
                                />
                            </a>
                        </div>
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open main menu</span>
                                {/* <Menu className="h-6 w-6" aria-hidden="true" /> */}
                            </button>
                        </div>
                        <Popover.Group className="hidden lg:flex lg:gap-x-12">
                            <Popover className="relative">
                                <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                    Product
                                    <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                        <div className="p-4">
                                            {products.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                                >
                                                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                                    </div>
                                                    <div className="flex-auto">
                                                        <a href={item.href} className="block font-semibold text-gray-900">
                                                            {item.name}
                                                            <span className="absolute inset-0" />
                                                        </a>
                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                            {callsToAction.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                                                >
                                                    <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-semibold leading-6 text-gray-900">
                                    {item.name}
                                </a>
                            ))}
                        </Popover.Group>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <a href="/community" className="flex text-md font-semibold leading-6 text-gray-900">
                                <Users />&nbsp; Join Community <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </nav>
                    {/* <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog> */}
                </header>

                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="mb-8 flex justify-center text-xs">
                            <div className="relative rounded-full px-2 py-1 text-xs lg:text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                                Amazing Coding Resources.{' '}
                                <a href="/resources" className="font-semibold text-indigo-600">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    Start Learning
                                </a>
                            </div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Your College Coding Journey Just Got Easier
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Your gateway to coding mastery. We&apos;re here to empower students with all the essential resources they need to succeed in coding, from in-depth tutorials to real-world projects and more. 🚀
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <a
                                    href="/dashboard"
                                    className="rounded-md flex bg-indigo-600 px-3.5 py-2.5 text-xs lg:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Get Started&nbsp;&nbsp;<RocketIcon />
                                </a>
                                <a href="/community" className="flex text-xs lg:text-sm font-semibold leading-6 text-gray-900">
                                    <Users />&nbsp; Join Community&nbsp; <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
