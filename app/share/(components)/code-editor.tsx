"use client"

import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { cpp } from "@codemirror/lang-cpp"

const CodeEditor = ({ userCode, onChange, language = "cpp", theme = "dark", fontSize = "16px", readOnly = false, className = "max-h-[500px] min-h-[500px] overflow-scroll" }) => {
    return (
        <div>
            <CodeMirror
                className={className}
                value={userCode}
                theme={
                    theme == "Dark" ? vscodeDark : vscodeLight
                }
                onChange={onChange}
                extensions={
                    language == "cpp" ?
                        [cpp()]
                        :
                        [cpp()]
                }
                style={{ fontSize: fontSize }}
                readOnly={readOnly}
            />
        </div>
    );
}

export default CodeEditor;