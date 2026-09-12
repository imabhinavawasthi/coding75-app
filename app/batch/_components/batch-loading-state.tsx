"use client";

import { Logo } from "@/app/(dashboard)/_components/components/logo";

export function BatchLoadingState({ message = "Loading batch details..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="animate-ping">
                <Logo />
            </div>
            <p className="text-sm font-medium text-gray-500">{message}</p>
        </div>
    );
}
