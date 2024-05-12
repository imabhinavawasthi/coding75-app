import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import AccordianPro from "./accordian-pro";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

const ProSchedule = () => {
    return (
        <div>
            <section className="md:container px-5">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="mb-4 lg:mb-8">
                        <h2 className="mb-4 lg:text-6xl md:text-4xl text-4xl  text-center text-gray-900 tracking-tight font-extrabold dark:text-white">Schedule</h2>
                        <p className="text-left text-gray-500 sm:text-xl dark:text-gray-400">Topicwise schedule of all the topics that will be covered in the coding75 Pro Subscription.</p>
                    </div>
                    <Accordion type="multiple" defaultValue={["mentorship", "dsa","cp","projects","cs"]} className="w-full">
                        <AccordionItem className="md:text-2xl text-xl" value="mentorship" >
                            <AccordionTrigger>1:1 Personalized Mentorship</AccordionTrigger>
                            <AccordionContent>
                                <AccordianPro heading={"1:1 Mentorship Session"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">You can book a 1:1 Mentorship Session Every Week (i.e. Once Per Week)</p>
                                        <p className="mb-2 text-gray-900 font-semibold">Duration - 30 Mins</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"1:1 Mock Interviews"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">You can book 1:1 Mock Interviews Twice Every Month</p>
                                        <p className="mb-2 text-gray-900 font-semibold">Duration - 60 Mins</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"1:1 Resume Review"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">You can book a 1:1 Resume Review Session Every Month (i.e. Once Per Month)</p>
                                        <p className="mb-2 text-gray-900 font-semibold">Duration - 15 Mins</p>
                                    </div>
                                </AccordianPro>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem className="md:text-2xl text-xl" value="dsa" >
                            <AccordionTrigger>Data Structures and Algorithms</AccordionTrigger>
                            <AccordionContent>
                                <AccordianPro heading={"Class Schedule"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Live DSA Classes will be held 3 days a week, here are the tentative days for classes, but this can be changed based on any other clashes like contests, etc.</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Monday</li>
                                            <li>Wednesday</li>
                                            <li>Friday</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">The focus will be more on Problem Solving for Interview Preparation</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 1"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Basics of Programming Language</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Input/Output</li>
                                            <li>Time & Space Complexity Analysis</li>
                                            <li>Loops and Control Statements</li>
                                            <li>Operators</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 2"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Function, Recursion, and Maths</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Functions</li>
                                            <li>In-build Functions</li>
                                            <li>Recursion</li>
                                            <li>Recursive Tree & Recursive Stack</li>
                                            <li>Maths for DSA</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 3"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Arrays and Strings
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Arrays</li>
                                            <li>Operations on Arrays</li>
                                            <li>2D Arrays/Matrix</li>
                                            <li>Strings</li>
                                            <li>String Operations</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 4 & 5"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Greedy Algorithms, Sorting & Searching
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Hashing</li>
                                            <li>Two Pointers</li>
                                            <li>Sliding Window</li>
                                            <li>Binary Search</li>
                                            <li>Sorting Algorithms</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 6"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Linked List
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Linked List Definition</li>
                                            <li>Singly Linked List</li>
                                            <li>Doubly Linked List</li>
                                            <li>Circular Linked List</li>
                                            <li>Linked List Manipulation Problems</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 7"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Stack & Queue
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Stack Basics and Operations</li>
                                            <li>Queue Basics and Operations</li>
                                            <li>Problem Solving</li>
                                            <li>Patterns</li>
                                            <li>Interview Questions</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 8"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Deque & Priority Queue
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Deque & Priority Queue</li>
                                            <li>Operations</li>
                                            <li>Problem Solving</li>
                                            <li>Patterns</li>
                                            <li>Interview Questions</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 9 & 10"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Tree, Binary Search Tree, and Binary Tree
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Trees</li>
                                            <li>Types of Trees</li>
                                            <li>Tree Methodology</li>
                                            <li>Tree Traversals - Preorder, Postorder, Inorder, Level order</li>
                                            <li>Binary Tree</li>
                                            <li>Binary Search Tree</li>
                                            <li>Operations on Binary Search Tree</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 11"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Heaps & Backtracking
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Heaps Basics</li>
                                            <li>Operations on Heaps</li>
                                            <li>Backtracking</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 12 & 13"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Dynamic Programming
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Dynamic Programming</li>
                                            <li>Recursive and Iterative Approach</li>
                                            <li>Tabulation and Iteration</li>
                                            <li>Dynamic Programming Patterns</li>
                                            <li>Knapsack, LCS, LIS - all important Dynamic Programming concepts.</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 14 & 15"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">
                                            Graphs
                                        </p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Graphs</li>
                                            <li>Types of Graphs</li>
                                            <li>Adjacency Matrix</li>
                                            <li>Adjacency List</li>
                                            <li>Graphs Operations</li>
                                            <li>DFS & BFS</li>
                                            <li>Shortest Path Algorithms</li>
                                            <li>Minimum Spanning Tree</li>
                                            <li>DSU Basics</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem className="md:text-2xl text-xl" value="cp" >
                            <AccordionTrigger>Competitive Programming</AccordionTrigger>
                            <AccordionContent>
                                <AccordianPro heading={"Class Schedule"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Contest Discussion Classes will be held on the same day, or one day after the contest.</p>
                                        <p className="mb-2 text-gray-900 font-semibold">CP Concept Classes will help on weekends or weekdays. (Twice a week)</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 1-4"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of CP Operations</li>
                                            <li>Fast Input / Output</li>
                                            <li>Greedy Approaches</li>
                                            <li>Two Pointers</li>
                                            <li>Sliding Window</li>
                                            <li>Constructive Algorithms</li>
                                            <li>Hashing</li>
                                            <li>Searching & Sorting</li>
                                            <li>Suffix, Prefix Arrays</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 5-8"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Number Theory</li>
                                            <li>Prime Numbers</li>
                                            <li>Modular Arithmetic</li>
                                            <li>Bit Manipulation</li>
                                            <li>Bitwise Tips and Tricks</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 9-12"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Constructive Algorithms</li>
                                            <li>Interactive Problems</li>
                                            <li>Observation Based Questions</li>
                                            <li>Constraints Based Problems</li>
                                            <li>Live Contest Solving</li>
                                        </ul>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 13-15"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Live Problem Solving of all the above concepts.</p>
                                    </div>
                                </AccordianPro>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem className="md:text-2xl text-xl" value="projects" >
                            <AccordionTrigger>Project Building</AccordionTrigger>
                            <AccordionContent>
                                <AccordianPro heading={"Class Schedule"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Live Project Building Classes will be held on weekends (Twice a week)</p>
                                        <p className="mb-2 text-gray-900 font-semibold">Mostly on Saturday and Sunday, but we can schedule more classes based on the interest of the students.</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 1-4"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Basics of Frontend Development</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>HTML & CSS</li>
                                            <li>Tailwind CSS</li>
                                            <li>Javascript</li>
                                            <li>Typescript</li>
                                            <li>Next.js</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">Along with this, 2 minor and 1 major project of frontend will be build.</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 5-8"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Basics of Backend Development</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Node.js</li>
                                            <li>Python Flask</li>
                                            <li>Database Connectivity</li>
                                            <li>Firebase and Supabase Integration</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">Along with this, 2 minor and 1 major project of backend will be build.</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 9-15"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Full Stack Development</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Frontend</li>
                                            <li>Backend</li>
                                            <li>Database</li>
                                            <li>State Management</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">2 Major Full-Stack Projects will be made, which will be resume-friendly.</p>
                                    </div>
                                </AccordianPro>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem className="md:text-2xl text-xl" value="cs" >
                            <AccordionTrigger>CS Fundamentals</AccordionTrigger>
                            <AccordionContent>
                                <AccordianPro heading={"Class Schedule"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Live CS Fundamental classes will be scheduled on weekends.</p>
                                        <p className="mb-2 text-gray-900 font-semibold">All the important interview preparation topics will be covered.</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 1-8 - OS (Parallely classes of DMBS will be held)"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Operating System</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Operating System</li>
                                            <li>Types of OS</li>
                                            <li>Program, Process, Thread</li>
                                            <li>CPU Scheduling Algorithms</li>
                                            <li>The Critical Section Problem</li>
                                            <li>Deadlocks</li>
                                            <li>Memory Management</li>
                                            <li>Paging</li>
                                            <li>Segmentation</li>
                                            <li>Fragmentation</li>
                                            <li>Disk Management</li>
                                            <li>Disk scheduling algorithms</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">All the important interview questions will be discussed.</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 1-8 - DMBS (Parallely classes of OS will be held)"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Database Management System</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Data & Information</li>
                                            <li>File System</li>
                                            <li>Application Architecture</li>
                                            <li>Schema and Instances</li>
                                            <li>Data Models</li>
                                            <li>Normalization</li>
                                            <li>ACID Properties</li>
                                            <li>Serializability</li>
                                        </ul>
                                        <p className="mb-2 mt-2 text-gray-900 font-semibold">SQL</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>All important SQL queries</li>
                                            <li>Important Theory Questions</li>
                                            <li>Joins</li>
                                            <li>Practice</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">All the important interview questions will be discussed.</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 9-15 - CN (Parallely classes of OOPs will be held)"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Computer Networks</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of CN</li>
                                            <li>Network Topologies</li>
                                            <li>Types of Network</li>
                                            <li>Computer Network Protocols</li>
                                            <li>Transmission Media</li>
                                            <li>VPN (Virtual Private Network)</li>
                                            <li>OSI Model</li>
                                            <li>TCP/IP Reference Model</li>
                                            <li>TCP and UDP</li>
                                            <li>HTTP and HTTPS</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">All the important interview questions will be discussed.</p>
                                    </div>
                                </AccordianPro>
                                <AccordianPro heading={"Week 9-15 - OOPs (Parallely classes of CN will be held)"}>
                                    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                                        <p className="mb-2 text-gray-900 font-semibold">Object Oriented Programming</p>
                                        <ul className="ps-5 text-black list-disc">
                                            <li>Basics of Object-Oriented Programming</li>
                                            <li>Classes and Objects</li>
                                            <li>Constructor</li>
                                            <li>Inheritance</li>
                                            <li>Encapsulation</li>
                                            <li>Access Specifier</li>
                                            <li>Abstraction</li>
                                            <li>Virtual Methods</li>
                                            <li>Polymorphism</li>
                                            <li>Function Overloading and Overriding</li>
                                        </ul>
                                        <p className="mb-2 text-gray-900 font-semibold">All the important interview questions will be discussed.</p>
                                    </div>
                                </AccordianPro>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="flex justify-center items-center flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <div className='lg:w-1/4 md:w-1/2 w-3/4 hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                        <Link href="#pricing" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            <GraduationCap className="mr-2 -ml-1 w-5 h-5" />
                            Subscribe to coding75 Pro 
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProSchedule;