"use client"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Playground from "./(components)/Playground";


const Practice = () => {
    return (
        <div className="min-h-screen max-h-screen w-full">
            <div className="px-2 shadow-xl min-h-screen max-h-screen w-full">
                <ResizablePanelGroup className="min-h-screen max-h-screen py-1" direction="horizontal">
                    <ResizablePanel>One</ResizablePanel>
                    <ResizableHandle className="border-x-2 w-2 bg-white border-slate-300" />
                    <ResizablePanel>
                        <Playground />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default Practice;