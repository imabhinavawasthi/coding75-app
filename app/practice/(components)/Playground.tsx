import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp"
import { useRouter } from "next/router";

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}

export default function Playground({ problem = null }) {
	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	let [userCode, setUserCode] = useState<string>("function hello(const x)\n{\n\tprint(x)\n}");

	const [fontSize, setFontSize] = useState("16px")

	const [settings, setSettings] = useState<ISettings>({
		fontSize: fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	function onChange() {

	}

	return (
		<div className='flex min-h-screen h-full flex-col bg-dark-layer-1 relative overflow-x-hidden'>

			<div className='w-full overflow-auto h-full'>
				<CodeMirror
					value={userCode}
					theme={vscodeDark}
					onChange={onChange}
					extensions={[cpp()]}
					style={{ fontSize: settings.fontSize }}
				/>
			</div>
			<div className='w-full px-5 overflow-auto'>
				{/* testcase heading */}
				<div className='flex h-10 items-center space-x-6'>
					<div className='relative flex h-full flex-col justify-center cursor-pointer'>
						<div className='text-sm font-medium leading-5 text-white'>Testcases</div>
						<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
					</div>
				</div>

				<div className='flex'>
					{/* {problem.examples.map((example, index) => (
							<div
								className='mr-2 items-start mt-2 '
								key={example.id}
								onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
									>
										Case {index + 1}
									</div>
								</div>
							</div>
						))} */}
				</div>

				<div className='font-semibold my-4'>
					<p className='text-sm font-medium mt-4 text-white'>Input:</p>
					<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
						{/* {problem.examples[activeTestCaseId].inputText} */}
					</div>
					<p className='text-sm font-medium mt-4 text-white'>Output:</p>
					<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
						{/* {problem.examples[activeTestCaseId].outputText} */}
					</div>
				</div>
			</div>
		</div>
	);
};