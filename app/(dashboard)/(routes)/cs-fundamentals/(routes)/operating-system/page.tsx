import PageHeaders from "@/components/page-headers/page-headers";
import { AccordionUI } from "@/components/templates/AccordionUI";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

const OperatingSystem = () => {
    return (
        <div className="container mt-5">
            <div className="mb-3">
                <PageHeaders
                    heading="Operating System"
                    description=""
                />
            </div>

            <div className="grid lg:grid-cols-4 grid-cols-3 gap-5">
                <div className="p-5 lg:col-span-1 col-span-3 divide-x rounded-lg">
                    <div className="font-sans">
                        <div className="text-md">
                            <p className="text-indigo-500">Introduction</p>
                            <div className="text-sm ml-2">
                                <a href="#what-is-operating-system" className="mt-2 flex">
                                    <ChevronRight className="w-4 h-4 " />
                                    <span>What is Operating System?</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 lg:mr-10">
                    <div className="mt-5">
                        <div>
                            <AccordionUI
                                title="What is an Operating System & Types of OS"
                                body={<Fragment>
                                    <div>
                                        <p>An operating system (OS) is software that acts as an interface between computer hardware and user applications. It manages the resources and provides services for the efficient and secure execution of programs. The primary functions of an operating system include process management, memory management, file system management, device management, and user interface.

                                            There are several types of operating systems, including:

                                            Windows: Developed by Microsoft, Windows is a widely used operating system for personal computers. It offers a user-friendly interface, supports a vast range of software applications, and is compatible with various hardware configurations.
                                            macOS: Developed by Apple, macOS is the operating system used on Apple Mac computers. It provides a sleek and intuitive user interface, seamless integration with other Apple devices, and a robust ecosystem of software applications.
                                            Linux: Linux is an open-source operating system that is highly customizable and widely used in server environments and embedded systems. It offers a high level of stability, security, and flexibility. Numerous distributions of Linux, such as Ubuntu, Fedora, and CentOS, cater to different user needs.
                                            Unix: Unix is a powerful multi-user operating system that served as the foundation for many other operating systems, including Linux and macOS. It provides a stable and secure environment and is famous for server applications.
                                            Android: Developed by Google, Android is an open-source operating system primarily designed for mobile devices such as smartphones and tablets. It offers a rich ecosystem of applications and customization options.
                                            iOS: Developed by Apple, iOS is the operating system used on iPhones, iPads, and iPods. It provides a seamless and secure user experience, focusing on performance and integration with other Apple devices.
                                            Real-Time Operating Systems (RTOS): RTOS is designed for systems that require deterministic and real-time response. It is commonly used in embedded systems, control systems, and IoT devices.</p>
                                    </div>
                                </Fragment>}
                            />
                        </div>
                        <div>
                            <AccordionUI
                                title="Difference between Multiprogramming, Multiprocess, Multitasking, and Multithreading"
                                body={<Fragment>
                                    <div>
                                        <p>Multiprocess: Multiprocess refers to the execution of multiple processes on a system with multiple CPUs or CPU cores. Each process is an instance of a running program, and multiple processes can execute concurrently. In multiprocess systems, each process has its own memory space and resources. Multiprocessing aims to increase system throughput and provide faster execution by distributing the workload across multiple processors.
                                            Multithreading: Multithreading involves executing multiple threads within a single process. A thread is a lightweight unit of execution that can run concurrently with other threads within the same process. Threads share the same memory space and resources, such as file handles and network connections. Multithreading allows for parallel execution within a process, enabling better utilization of system resources and potentially improving performance by dividing tasks into smaller units of work that can be executed concurrently.
                                            Multiprogramming: Multiprogramming is a technique where multiple programs are loaded into memory simultaneously, and the CPU switches between them to execute instructions. The purpose of multiprogramming is to maximize CPU utilization and keep the CPU busy by quickly switching between different programs when one is waiting for I/O or other operations. Each program has its own separate memory space.
                                            Multitasking: Multitasking is a technique that allows multiple tasks or processes to run concurrently on a single CPU. The CPU time is divided among the tasks, giving the illusion of parallel execution. The operating system switches between tasks rapidly, giving each task a time slice or quantum to execute. Multitasking is commonly used in modern operating systems to provide responsiveness and the ability to run multiple applications simultaneously.</p>
                                    </div>
                                </Fragment>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OperatingSystem;