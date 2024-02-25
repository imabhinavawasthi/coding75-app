const CodeEditorCard = () => {
    return (
        <div>
            <div className="relative rounded-lg bg-slate-900 p-2">
                <div className="relative flex text-center">
                    <div className="flex pl-3.5 pt-3"><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.5 mr-1.5 h-3 w-3 text-red-500">
                        <circle r="12" cy="12" cx="12"></circle>
                    </svg><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.75 mr-1.5 h-3 w-3 text-yellow-500">
                            <circle r="12" cy="12" cx="12"></circle>
                        </svg><svg viewBox="0 0 24 24" fill="currentColor" className="-ml-0.75 mr-1.5 h-3 w-3 text-green-500">
                            <circle r="12" cy="12" cx="12"></circle>
                        </svg></div><span className="absolute inset-x-0 top-2 text-xs text-slate-500">coding75.tsx</span>
                </div>
                <div className="mt-5 space-y-1.5 px-5 pb-10">
                    <p className="mt-4 font-mono text-xs font-normal tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;</span><span className="text-pink-400">Learn</span><span className="text-slate-500">&gt;</span>
                    </p>
                    <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;</span><span className="text-pink-400">Text</span><span className="text-slate-500">&gt;</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">1 stop solution for all your needs.</span></span><span className="text-slate-500">&lt;/</span><span className="text-pink-400">Text</span><span className="text-slate-500">&gt;</span>
                    </p>
                    <p className="ml-3 font-mono text-xs font-normal leading-4 tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;</span><span className="text-pink-400">Metric</span><span className="text-slate-500">&gt;</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">coding75 Resources</span></span><span className="text-slate-500">&lt;/</span><span className="text-pink-400">Metric</span><span className="text-slate-500">&gt;</span>
                    </p>
                    <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;</span><span className="text-pink-400">Flex</span><span className="ml-2 text-violet-400">className<span className="text-slate-500">=</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400"></span></span></span><span className="text-slate-500">&gt;</span>
                    </p>
                    <p className="ml-6 font-mono text-xs font-normal tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;</span><span className="text-pink-400">Text</span><span className="text-slate-500">&gt;</span><span className="text-slate-500">&lt;</span><span className="text-pink-400">Bold</span><span className="text-slate-500">&gt;</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">32%</span></span><span className="text-slate-500">&lt;/</span><span className="text-pink-400">Bold</span><span className="text-slate-500">&gt;</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">of annual target</span></span><span className="text-slate-500">&lt;/</span><span className="text-pink-400">Text</span><span className="text-slate-500">&gt;</span>
                    </p>
                    <p className="ml-6 font-mono text-xs font-normal tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;</span><span className="text-pink-400">Text</span><span className="text-slate-500">&gt;</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">$ 223,328</span></span><span className="text-slate-500">&lt;/</span><span className="text-pink-400">Text</span><span className="text-slate-500">&gt;</span>
                    </p>
                    <p className="ml-3 font-mono text-xs font-normal tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;/</span><span className="text-pink-400">Flex</span><span className="text-slate-500">&gt;</span>
                    </p>
                    <p className="ml-3 font-mono text-xs font-normal leading-4 tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;</span><span className="text-pink-400">ProgressBar</span><span className="ml-2 text-violet-400">value<span className="text-slate-500">=</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400">{32}</span></span></span><span className="ml-2 text-violet-400">className<span className="text-slate-500">=</span><span className="relative inline-block px-1 before:absolute before:-inset-0.5 before:block before:rounded before:bg-blue-500/10"><span className="relative text-blue-400"></span></span></span><span className="text-slate-500">/&gt;</span>
                    </p>
                    <p className="font-mono text-xs font-normal tracking-wide text-violet-400">
                        <span className="text-slate-500">&lt;/</span><span className="text-pink-400">Learn</span><span className="text-slate-500">&gt;</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CodeEditorCard;