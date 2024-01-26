import Image from "next/image";
import UnderlineImage from "../app/(dashboard)/_components/img/underline.png"


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
                    className="mt-1 h-8 absolute top-5 lg:top-12 md:top-8 left-0"
                />
            </h1>
        </div>
    );
}

export default UnderlineText;