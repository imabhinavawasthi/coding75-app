import Image from "next/image";
import UnderlineImage from "../app/(dashboard)/_components/img/underline.gif"


const UnderlineText = ({ heading = "" }) => {
    return (
        <div>
            <h1 className="inline relative mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-6xl dark:text-white">
                <span className="text-blue-800">
                    {heading}
                </span>
                <Image
                    src={UnderlineImage}
                    alt="underline"
                    className="mt-1 w-full h-14 absolute top-2 lg:top-10 md:top-4 left-0"
                />
            </h1>
        </div>
    );
}

export default UnderlineText;