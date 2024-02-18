import { ArrowBigRight, MoveRight } from "lucide-react";
import Link from "next/link";

const ImageCard3 = ({ image = "", title = "", description = "", href="" }) => {
    return (
        <div>
            <Link href={href} className="group cursor-pointer">
                <img
                    src={image}
                    alt="image"
                    className="aspect-video w-full rounded-xl object-cover shadow-2xl transition group-hover:grayscale-[50%]"
                />
                <div className="p-4">
                    <h3 className="hover:underline text-xl text-center flex justify-center items-center font-medium text-gray-900">
                        {title} <ArrowBigRight className="h-4 w-4 ml-2"/>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                        {description}
                    </p>
                </div>
            </Link>
        </div>
    );
}

export default ImageCard3;