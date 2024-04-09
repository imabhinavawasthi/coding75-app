// import PageHeaders from "@/components/page-headers/page-headers";
// import Feature3 from "../../../../_components/img/feature3.png"


{/* <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Latest</span> */ }
{/* <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                                        <ExternalLink className="w-3.5 h-3.5 me-2.5" /> Learn
                                    </a> */}

const DSARoadmap = () => {
    return (
        <div>
            <div>
                {/* <PageHeaders
                    heading="DSA Mastery Roadmap 🚀"
                    description="Explore step-by-step concepts, solve beginner-friendly challenges, and build a solid foundation for your coding journey. Start your adventure to algorithmic mastery today!"
                image={Feature3}
                /> */}
                <div className="mt-5 container">
                    <div>
                        <p id="level0" className="text-xl font-bold mb-10">Complete DSA Mastery Roadmap 🚀</p>
                        <div className="lg:px-10 md:px-8 px-5">
                            <ol className="relative border-s border-gray-200 dark:border-gray-700">
                                <li className="mb-10 ms-6">
                                    <span id="level1" className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Prerequisites<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 0</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Before diving into DSA, make sure you have a solid understanding of the following:</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Basic Programming:</strong> You should be comfortable with at least one programming language (e.g., Python, Java, C++).</li>
                                        <li><strong>Understanding of Variables and Data Types:</strong> Know how to declare variables and understand different data types.</li>
                                        <li><strong>Input and Output:</strong> You should know how to take input and output.</li>
                                        <li><strong>Control Structures:</strong> Understand concepts like loops and conditional statements.</li>
                                        <li><strong>Functions/Methods:</strong> Know how to define and call functions/methods.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Introduction to DSA<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 1</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understand the importance of data structures and algorithms.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>What is DSA? </strong>
                                            Understand the fundamental concepts of Data Structures and Algorithms, forming the basis for efficient problem-solving in programming.
                                        </li>
                                        <li><strong>Importance of DSA:</strong>
                                            Recognize the crucial role of DSA in optimizing software solutions, enhancing problem-solving efficiency, and enabling scalable applications.
                                        </li>
                                        <li><strong>Time and Space Complexity:</strong>
                                            Grasp the importance of evaluating algorithm efficiency through time and space complexity analysis, aiding in selecting optimal solutions.
                                        </li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Arrays and Strings<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 1</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understand about arrays and strings.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Arrays: </strong>
                                            Master the fundamentals of arrays, covering declaration, manipulation, and common operations like searching and sorting.
                                        </li>
                                        <li><strong>Strings:</strong>
                                            Explore string manipulation techniques, including concatenation, substring extraction, and solving problems related to strings.
                                        </li>
                                        <li><strong>2D Arrays/Matrix:</strong>
                                            Understand the representation and manipulation of two-dimensional arrays or matrices in programming.
                                        </li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Searching and Sorting<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 1</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Learn all sorting and searching algorithms.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Searching: </strong>
                                            Learn various searching algorithms like linear search, binary search, and their applications.
                                        </li>
                                        <li><strong>Sorting:</strong>
                                            Explore sorting algorithms such as bubble sort, insertion sort, and quicksort, understanding their implementation and efficiency.
                                        </li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Maps, Sets and Hashing<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 1</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understand the concept of hashing.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Maps and Sets: </strong>
                                            Master the usage of maps and sets in programming, understanding their applications and advantages.
                                        </li>
                                        <li><strong>Hashing:</strong>
                                            Grasp the concept of hashing and its applications, including efficient data retrieval and storage.
                                        </li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Mathematics<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 1</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understand the maths concepts in DSA.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Prime Numbers and Factors: </strong>
                                            Understand prime numbers, factorization, and their significance in algorithmic problem-solving.

                                        </li>
                                        <li><strong>Bit Manipulation:</strong>
                                            Explore bitwise operations and their applications, including solving problems efficiently using bit manipulation.
                                        </li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Recursion & Backtracking<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 1</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understand the maths concepts in DSA.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Recursion: </strong>
                                            Master the concept of recursion and its application in problem-solving.
                                        </li>
                                        <li><strong>Backtracking:</strong>
                                            Understand backtracking techniques and their application in solving problems with a trial-and-error approach.
                                        </li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Greedy Algorithms<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Level 1</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Be greedy and learn them.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>2 Pointers: </strong>
                                            Learn the 2-pointer technique for efficient traversal and manipulation of arrays and linked lists.
                                        </li>
                                        <li><strong>Sliding Window:</strong>
                                            Understand the sliding window technique for solving problems involving subarrays with a constant-size window.
                                        </li>
                                        <li><strong>Subarray/ Subsequence Problems:</strong>
                                            Explore problems related to subarrays and subsequences, applying various techniques to solve them.
                                        </li>
                                        <li><strong>Kadane&apos;s Algo:</strong>
                                            Master Kadane&apos;s algorithm for finding the maximum subarray sum efficiently.
                                        </li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span id="level2" className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-green-600 dark:text-white">Level 1 Done!<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Practice Time!</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Don&apos;t forgot to practice questions regularly.</div>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Linked List<span className="bg-amber-100 text-amber-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-amber-900 dark:text-amber-300 ms-3">Level 2</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Learn to manage links and arrange them.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Singly Linked List: </strong>
                                            Understand the concepts of singly linked lists, including node manipulation and common operations.
                                        </li>
                                        <li><strong>Doubly Linked List:</strong>
                                            Learn the implementation and operations of doubly linked lists, extending the capabilities of singly linked lists.
                                        </li>
                                        <li><strong>Circular Linked List:</strong>Explore circular linked lists and their applications in different scenarios.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Stack & Queue<span className="bg-amber-100 text-amber-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-amber-900 dark:text-amber-300 ms-3">Level 2</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understanding stacks and queues.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Stack: </strong> Master the stack data structure, understanding its implementation and solving problems using stacks.</li>
                                        <li><strong>Queue:</strong> Learn the concepts of queues, their implementation, and applications in problem-solving.</li>
                                        <li><strong>Deque:</strong> Learn the concepts of queues, their implementation, and applications in problem-solving.</li>
                                        <li><strong>Priority Queue:</strong> Learn the concepts of queues, their implementation, and applications in problem-solving.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Basic Graph & Trees<span className="bg-amber-100 text-amber-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-amber-900 dark:text-amber-300 ms-3">Level 2</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understanding basics of graphs and trees.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Trees: </strong> Learn the concepts of queues, their implementation, and applications in problem-solving.</li>
                                        <li><strong>Binary Trees:</strong> Explore binary trees, their properties, and applications in programming.</li>
                                        <li><strong>Binary Search Trees:</strong> Learn the implementation and operations of binary search trees, understanding their role in searching algorithms.</li>
                                        <li><strong>Graphs:</strong> Grasp the fundamentals of graph theory, including representation and traversal techniques.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span id="level3" className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-green-600 dark:text-white">Level 2 Done!<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Practice Time!</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Don&apos;t forgot to practice questions regularly.</div>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Dynamic Programming<span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ms-3">Level 3</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understanding the concept of dynamic programming.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Basics of Dynamic Programming: </strong> Understand the foundational concepts of dynamic programming and its role in optimization problems.</li>
                                        <li><strong>Memoization Approach:</strong> Explore the memoization approach in dynamic programming, understanding its implementation and advantages.</li>
                                        <li><strong>Tabulation Approach:</strong> Learn the tabulation approach in dynamic programming, providing an alternative solution to optimization problems.</li>
                                        <li><strong>Knapsack DP:</strong> Master dynamic programming using the knapsack problem as an example, understanding its applications.</li>
                                        <li><strong>Partition DP:</strong> Explore dynamic programming problems related to partitioning and efficient problem-solving techniques.</li>
                                        <li><strong>Digit DP:</strong> Understand dynamic programming problems involving digits and their applications in algorithmic problem-solving.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Advanced Graph and Trees<span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ms-3">Level 3</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Understanding the concept of advanced trees and graphs.</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Minimum Spanning Tree: </strong> Learn the concept of minimum spanning trees in graph theory and its applications.</li>
                                        <li><strong>Disjoint Sets:</strong> Grasp the concept of disjoint sets and their applications, including efficient connectivity checks.</li>
                                        <li><strong>Heaps:</strong> Understand heap data structures, including implementation and applications in priority queue operations.</li>
                                        <li><strong>Segment Trees:</strong> Understand heap data structures, including implementation and applications in priority queue operations.</li>
                                        <li><strong>Fenwick/BI Trees:</strong> Learn the concepts and implementation of Fenwick/Binary Indexed Trees, especially their use in prefix sum calculations.</li>
                                        <li><strong>Tries:</strong> Understand trie data structures and their applications in solving problems related to strings and dynamic sets.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Advanced DSA<span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ms-3">Level 3</span></h3>
                                    <div className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">No end of this.....</div>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Red Black Trees: </strong>Explore the red-black tree, a self-balancing binary search tree, and its properties.</li>
                                        <li><strong>B Trees:</strong> Grasp the concepts of B-trees, understanding their applications in database systems.</li>
                                        <li><strong>Advanced String Algorithms:</strong> Learn advanced string algorithms, including pattern matching and substring search techniques.</li>
                                        <li><strong>and so on......:</strong> There is no end of DSA.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 id="done" className="flex items-center mb-1 text-lg font-semibold text-green-600 dark:text-white">Level 3 Done!<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Practice Time!</span></h3>
                                    <ol className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                        <li><strong>Practice Regularly: </strong> Emphasize consistent practice on online platforms to reinforce concepts and improve problem-solving skills.</li>
                                        <li><strong>Participate in Contests: </strong> Engage in coding contests on platforms like LeetCode and Codeforces to gain exposure to diverse problem types.</li>
                                        <li><strong>Mock Interviews:</strong> Practice mock interviews regularly to enhance problem-solving under time constraints and improve interview skills.</li>
                                        <li><strong>Interview Preparation:</strong> Prepare for technical interviews by understanding common algorithms and data structures, and practice solving problems similar to those encountered in real interviews.</li>
                                    </ol>
                                </li>
                                <li className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-green-600 dark:text-white">Your Dream Job! 🎉<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">You Did IT!</span></h3>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DSARoadmap;