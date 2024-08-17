"use client"

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { cpp } from "@codemirror/lang-cpp"
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
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ShareCode = () => {

    const extraSpace = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"

    const [userCode, setUserCode] = useState(`// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main() {\n\t// Write C++ code here\n\tstd::cout << "Try programiz.pro";\n\treturn 0;\n}${extraSpace}`)
    const [language, setLanguage] = useState("cpp")
    const [theme, setTheme] = useState("dark")

    function onChange(e) {
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
                                <SelectTrigger className="w-full border-2 border-blue-400">
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
                        <div className="lg:col-span-1 md:col-span-2">
                            <Select onValueChange={(e) => setLanguage(e)}>
                                <SelectTrigger className="w-full border-2 border-blue-400">
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
                                    <CodeMirror
                                        className="max-h-[500px] min-h-[500px] overflow-scroll"
                                        value={userCode}
                                        theme={
                                            theme == "dark" ? vscodeDark : vscodeLight
                                        }
                                        onChange={onChange}
                                        extensions={[cpp()]}
                                        style={{ fontSize: "16px" }}
                                        readOnly
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