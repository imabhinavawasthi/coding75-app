import { UserCircle } from "lucide-react";
import Link from "next/link";

const AdminNavbar = ({user}) => {
    return (
        <div>
            <header className="antialiased">
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="flex justify-start items-center">
                            <Link href="/admin" className="flex mr-4">
                                <img src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/coding75-light.png" className="mr-3 h-12" alt="FlowBite Logo" />
                            </Link>
                        </div>
                        <div className="flex items-center lg:order-2">
                            <Link href="/admin/opportunity" type="button" className="hidden sm:inline-flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"><svg aria-hidden="true" className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg> 
                            New Opportunity
                            </Link>
                            <UserCircle className="h-8 w-8 text-primary-700"/><p className="ml-2 "> {user}</p>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}

export default AdminNavbar;