"use client";

import Footer from "@/components/footer";
import { Navbar } from "@/app/(dashboard)/_components/sidebar/navbar";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar/sidebar";

export default function BatchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full bg-slate-50 min-h-screen flex flex-col">
            <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50 bg-white border-b">
                <Navbar />
            </div>
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-[80px] flex-1 flex flex-col">
                <div className="flex-1 pb-16">
                    {children}
                </div>
                <footer>
                    <Footer />
                </footer>
            </main>
        </div>
    );
}
