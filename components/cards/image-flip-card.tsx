import Image from "next/image";
import Link from "next/link";

const ImageFlipCard = ({title, description, href, image1, image2, href_text}:any) => {
    return (
        <div>
            <Link href={href} className="group relative block">
                <div className="relative h-[500px]">
                    <Image
                        src={image1}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0"
                    />

                    <Image
                        src={image2}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100"
                    />
                </div>

                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <h3 className="text-xl bg-blue-600 p-2 font-medium text-white">{title}</h3>

                    <p className="mt-1.5 bg-blue-600 p-2 text-pretty text-xs text-white">
                        {description}
                    </p>

                    <span
                        className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
                    >
                        {href_text}
                    </span>
                </div>
            </Link>
        </div>
    );
}

export default ImageFlipCard;