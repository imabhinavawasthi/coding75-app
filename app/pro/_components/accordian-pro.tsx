const AccordianPro = ({
    children, heading
}: {
    children: React.ReactNode;
    heading: any;
}) => {
    return (
        <>
            <h2>
                <button type="button" className="flex text-lg items-center justify-between w-full py-3 px-5 font-medium rtl:text-right text-black border border-b-0 border-blue-200 bg-blue-100">
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