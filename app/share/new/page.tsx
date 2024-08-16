"use client"

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp"
import { useRouter } from "next/router";

const ShareCode = () => {
    const [userCode, setUserCode] = useState(`// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main() {\n\t// Write C++ code here\n\tstd::cout << "Try programiz.pro";\n\treturn 0;\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`)

    function onChange(e) {
        console.log(e);
    }

    return (
        <div>
            <CodeMirror
            className="min-h-screen"
                value={userCode}
                theme={vscodeDark}
                onChange={onChange}
                extensions={[cpp()]}
                style={{ fontSize: "16px" }}
            />
        </div>
    );
}

export default ShareCode;