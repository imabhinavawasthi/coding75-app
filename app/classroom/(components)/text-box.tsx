const TextBox = ({ keytext, value }) => {
    return (
        <div className="bg-gray-100 w-full rounded border border-gray-200 flex items-center">
            <span
                className="py-2 px-4 w-full bg-white text-gray-600 rounded-l border-r border-gray-200 hover:bg-gray-50 active:bg-gray-200 disabled:opacity-50 inline-flex items-center focus:outline-none"
            >
                {keytext}
            </span>
            <input
                type="text"
                disabled
                value={value}
                className="bg-transparent py-1 text-gray-600 px-4 focus:outline-none w-full"
            />
        </div>
    );
}

export default TextBox;