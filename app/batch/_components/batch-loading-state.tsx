"use client";

export function BatchLoadingState({ message = "Loading batch details..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3.5">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
            {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
        </div>
    );
}

