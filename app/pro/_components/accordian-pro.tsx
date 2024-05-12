const AccordianPro = ({
    children, heading
}: {
    children: React.ReactNode;
    heading: any;
}) => {
    return (
        <>
            <h2>
                <button type="button" className="flex text-lg items-center justify-between w-full py-3 px-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 bg-gray-100 dark:hover:bg-gray-800 gap-3">
                    <span>{heading}</span>
                </button>
            </h2>
            <div>
                {children}
            </div>
        </>
    );
}

export default AccordianPro;