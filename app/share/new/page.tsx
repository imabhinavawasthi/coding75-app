"use client"

import { useState, useEffect } from "react";
import { Navbar } from "@/app/(dashboard)/_components/sidebar/navbar";
import Footer from "@/components/footer";
import PageHeadersButton from "@/components/page-headers/page-headers-button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Link, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CodeEditor from "../(components)/code-editor";

const ShareCode = () => {

    const extraSpace = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"

    const [userCode, setUserCode] = useState(`// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main() {\n\t// Write C++ code here\n\tstd::cout << "Try programiz.pro";\n\treturn 0;\n}${extraSpace}`)
    const [language, setLanguage] = useState("cpp")
    const [theme, setTheme] = useState("Dark")
    const [fontSize, setFontSize] = useState("16px")

    function onCodeChange(e) {
        setUserCode(e)
    }

    return (
        <div>
            <Navbar isLogo={true} />
            <div className="min-h-screen container my-5">
                <PageHeadersButton
                    greenHeading="coding75.com"
                    heading="Share Your Code - "
                    description="Get shareable link of your code in one click, share anywhere and anyone"
                    isButtons={false}
                />
                <div>
                    <div className="mb-5 grid grid-cols-12 gap-x-5">
                        <div className="lg:col-span-2 md:col-span-4">
                            <Select onValueChange={(e) => setLanguage(e)}>
                                <SelectTrigger className="w-full shadow-lg shadow-teal-200 hover:shadow-teal-300">
                                    <SelectValue placeholder={"C++"} />
                                </SelectTrigger>
                                <SelectContent defaultValue={language}>
                                    <SelectGroup>
                                        <SelectLabel>Select Language</SelectLabel>
                                        <SelectItem value="c">C</SelectItem>
                                        <SelectItem defaultChecked value="cpp">C++</SelectItem>
                                        <SelectItem value="java">Java</SelectItem>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="js">Javascript</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-2 md:col-span-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center w-full shadow-lg shadow-teal-200 hover:shadow-teal-300" variant={"outline"}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        <p>Editor Settings</p>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Editor Settings</DialogTitle>
                                        <DialogDescription>
                                            Adjust Fontsize and Select Theme
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Separator className=""/>
                                    <div className="flex gap-x-5 items-center justify-center">
                                        <p className="w-full font-semibold">Adjust Fontsize:</p>
                                        <Select onValueChange={(e) => setFontSize(e)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={fontSize} />
                                            </SelectTrigger>
                                            <SelectContent defaultValue={fontSize}>
                                                <SelectGroup>
                                                    <SelectLabel>Select Font Size</SelectLabel>
                                                    {
                                                        ["12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "21px"].map((data, index) => {
                                                            return (
                                                                <SelectItem key={index} value={data}>{data}</SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-x-5 items-center justify-center">
                                        <p className="w-full font-semibold">Select Theme:</p>
                                        <Select onValueChange={(e) => setTheme(e)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={theme} />
                                            </SelectTrigger>
                                            <SelectContent defaultValue={theme}>
                                                <SelectGroup>
                                                    <SelectLabel>Select Theme</SelectLabel>
                                                    <SelectItem value={"Light"}>Light</SelectItem>
                                                    <SelectItem value={"Dark"}>Dark</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="lg:col-span-2 md:col-span-4 w-full ml-auto">
                            <Button className="w-full flex items-center" variant={"basic"}>
                                <Link className="h-4 w-4 mr-2" /> Get Shareable Link
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Paste Your Code
                                </CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="mt-5">
                                <div >
                                    <CodeEditor
                                        userCode={userCode}
                                        onChange={onCodeChange}
                                        theme={theme}
                                        language={language}
                                        readOnly={false}
                                        fontSize={fontSize}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ShareCode;