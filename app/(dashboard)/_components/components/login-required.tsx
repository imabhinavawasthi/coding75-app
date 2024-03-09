import { LogIn } from "lucide-react";

export default function LoginRequiredPage() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-md text-center lg:py-16 lg:px-12">
                <LogIn className="mx-auto mb-4 w-10 h-10 text-gray-400" />
                <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 lg:mb-6 md:text-5xl xl:text-6xl dark:text-white">Login Required</h1>
                <p className="font-light text-gray-500 md:text-lg xl:text-xl dark:text-gray-400">Please login to access this page.</p>
            </div>
        </section>
    )
}