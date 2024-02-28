import { Layout } from "lucide-react";
import Link from "next/link";

const BreadCrumb = ({ links = [{}] }) => {
    return (
        <div>
            <div className="flex px-5 py-3" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link href="/dashboard" className="inline-flex items-center text-xs md:text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <Layout strokeWidth={2} className="w-5 h-5 me-2.5"/>
                            Dashboard
                        </Link>
                    </li>
                    {
                        links.map((data) => {
                            return (
                                <>
                                    <li aria-current="page">
                                        <div className="flex items-center">
                                            <svg className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                            </svg>
                                            <Link href={data["href"]}><span className="ms-1 text-xs md:text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{data["title"]}</span></Link>
                                        </div>
                                    </li>
                                </>
                            )
                        })
                    }
                </ol>
            </div>
        </div>
    );
}

export default BreadCrumb;